import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import IndemniteKilometriqueService from '../../../app/services/IndemniteKilometriqueService';
import NoteDeFraisService from'../../../app/services/NoteDeFraisService';
import RealmService  from '../../../app/services/RealmService';
import _ from 'underscore';

const seuilVariable = 0.654;
const mockBaremeKmService = {
  findSeuil() {
    return {
      variable: seuilVariable
    };
  },

  findByTypeVehicule(){
    return {}
  }
};

const mockVehiculeService = {
  find(){
    return {};
  },

  findKilometrage(){
    return 10;
  },

  findOrCreateKilometreAnnuel(){
    return {
      annee: 2016,
      kilometrage: 5000
    }
  }
};

const mockCompteSecureService = {
  shouldUseApiService(){
    return false;
  }
};

describe('IndemniteKilometriqueService', () => {

  let indemniteKilometriqueService, noteDeFraisService, db;

  beforeEach(function () {
    indemniteKilometriqueService = new IndemniteKilometriqueService();
    indemniteKilometriqueService.vehiculeService = mockVehiculeService;
    indemniteKilometriqueService.baremeKilometriqueService = mockBaremeKmService;
    noteDeFraisService = new NoteDeFraisService();
    noteDeFraisService.vehiculeService = mockVehiculeService;
    noteDeFraisService.indemniteKilometriqueService = indemniteKilometriqueService;
    noteDeFraisService.compteSecureService = mockCompteSecureService;
    noteDeFraisService.baremeKilometriqueService = mockBaremeKmService;
    db = RealmService.service;
  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('Compte'));
      db.delete(db.objects('NoteDeFrais'));
      db.delete(db.objects('IndemniteKilometrique'));
    });
  });

  it('should compute montantARembourser', () => {
    const idVehicule = 'foobar';
    const distance = 110;
    const date = new Date();
    const montantARembourser = 0;
    const montant = indemniteKilometriqueService._computeMontantARembourser({
      idVehicule,
      distance,
      date,
      montantARembourser
    });
    assert.isNotNull(montant);
    assert.equal(montant, 110 * seuilVariable);
  });

  it('should throw error if no seuil found when compute montantARembourser', () => {
    indemniteKilometriqueService.baremeKilometriqueService = {
      findSeuil() {
        return null;
      },

      findByTypeVehicule(){
        return {}
      }
    };

    const idVehicule = 'foobar';
    const distance = 110;
    const date = new Date();
    const montantARembourser = 0;
    expect(indemniteKilometriqueService._computeMontantARembourser.bind(indemniteKilometriqueService, {
      idVehicule,
      distance,
      date,
      montantARembourser
    })).to.throw(Error);
  });

  it('should create ik', () => {
    const ndfID = noteDeFraisService.create({ id: 'idndf', idCompte: 'idcompte' })
    const ndf = noteDeFraisService.find(ndfID);

    const ikID = indemniteKilometriqueService.create({
      _depart: 'Lille',
      lieu: 'Paris',
      idVehicule: 'foobar',
      date: new Date(),
      distance: 10
    }, ndf);
    assert.isNotNull(ikID);

    const ik = indemniteKilometriqueService.find(ikID);
    assert.isNotNull(ik);
    assert.equal(indemniteKilometriqueService.parseFloat(ik.montantARembourser), seuilVariable * 10);
    assert.equal(_.toArray(ndf.indemnitesKilometriques).length, 1);
  });

  it('should delete ik', () => {
    const ndfID = noteDeFraisService.create({ id: 'idndf', idCompte: 'idcompte' });
    const ndf = noteDeFraisService.find(ndfID);

    indemniteKilometriqueService.create({
      _depart: 'Lille',
      lieu: 'Paris',
      idVehicule: 'foobar',
      date: new Date(),
      distance: 10
    }, ndf);

    const ikID = indemniteKilometriqueService.create({
      _depart: 'Lille',
      lieu: 'Paris',
      idVehicule: 'foobar',
      date: new Date(),
      distance: 10
    }, ndf);
    assert.isNotNull(ikID);

    const ik = indemniteKilometriqueService.find(ikID);
    assert.isNotNull(ik);
    assert.equal(_.toArray(ndf.indemnitesKilometriques).length, 2);

    indemniteKilometriqueService.delete(ik, ndf);
    assert.equal(_.toArray(ndf.indemnitesKilometriques).length, 1);
    assert.isNull(indemniteKilometriqueService.find(ikID));
  });

  it('should delete all', () => {
    const ndfID = noteDeFraisService.create({ id: 'idndf', idCompte: 'idcompte' });
    let ndf = noteDeFraisService.find(ndfID);

    const ik1 = indemniteKilometriqueService.create({
      _depart: 'Lille',
      lieu: 'Paris',
      idVehicule: 'foobar',
      date: new Date(),
      distance: 10
    }, ndf);

    const ik2 = indemniteKilometriqueService.create({
      _depart: 'Lille',
      lieu: 'Paris',
      idVehicule: 'foobar',
      date: new Date(),
      distance: 10
    }, ndf);

    assert.equal(_.toArray(ndf.indemnitesKilometriques).length, 2);
    indemniteKilometriqueService.deleteAll([ik1, ik2], ndf);
    assert.equal(_.toArray(ndf.indemnitesKilometriques).length, 0);
  });

  it('should update ik', () => {

    const ndfID = noteDeFraisService.create({ id: 'idndf', idCompte: 'idcompte' });
    const ndf = noteDeFraisService.find(ndfID);

    const ikID = indemniteKilometriqueService.create({
      _depart: 'Lille',
      lieu: 'Paris',
      idVehicule: 'foobar',
      date: new Date(),
      distance: 10
    }, ndf);
    assert.isNotNull(ikID);

    const distance = 56456.65;
    indemniteKilometriqueService.update({ id: ikID, distance }, ndf);
    const ik = indemniteKilometriqueService.find(ikID);
    assert.isNotNull(ik);
    assert.equal(indemniteKilometriqueService.parseFloat(ik.distance), distance);
    assert.equal(indemniteKilometriqueService.parseFloat(ik.montantARembourser), indemniteKilometriqueService.parseFloat(distance * seuilVariable));

  });

});
