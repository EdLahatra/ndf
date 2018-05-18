import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import _ from 'underscore';

import { STATUTS }  from '../../../app/schemas/NoteDeFrais';
import CompteService  from '../../../app/services/CompteService';
import IndemniteKilometriqueService from '../../../app/services/IndemniteKilometriqueService';
import VehiculeService from '../../../app/services/VehiculeService';
import NoteDeFraisService  from '../../../app/services/NoteDeFraisService';
import RealmService  from '../../../app/services/RealmService';

import moment from 'moment';

const seuilVariable = 0.6;
const ikDistance = 100;
const mockBaremeKmService = {
  findSeuil() {
    return {
      variable: seuilVariable
    };
  },

  findByTypeVehicule() {
    return {};
  }
};

const mockCompteSecureService = {
  shouldUseApiService(){
    return false;
  }
};

describe('NoteDeFraisService', () => {

  let indemniteKilometriqueService, noteDeFraisService, db, compteService, vehiculeService;
  const idCompte = 'foobar';
  let ndfList = [];

  beforeEach(function () {
    compteService = new CompteService();
    vehiculeService = new VehiculeService();
    indemniteKilometriqueService = new IndemniteKilometriqueService();
    indemniteKilometriqueService.baremeKilometriqueService = mockBaremeKmService;
    noteDeFraisService = new NoteDeFraisService();
    noteDeFraisService.indemniteKilometriqueService = indemniteKilometriqueService;
    noteDeFraisService.compteSecureService = mockCompteSecureService;
    noteDeFraisService.baremeKilometriqueService = mockBaremeKmService;

    db = RealmService.service;
    assert.isNotNull(indemniteKilometriqueService);
    db.write(()=> {
      db.create('FichePersonnelle', { id: 'ff', idCompte: idCompte, nom: 'foo', prenom: 'bar', email: 'foo@bar' });
      db.create('Compte', { id: idCompte, idFichePersonnelle: 'ff' });

      db.create('Vehicule', {
        idCompte: idCompte,
        id: 'car0',
        nom: 'car 0',
        puissanceFiscale: 5,
        kilometreAnnuel: [{ kilometrage: 0, annee: 2016 }],
        typeVehicule: 'Voiture'
      });

      db.create('Vehicule', {
        idCompte: idCompte,
        id: 'car1',
        nom: 'car 1',
        puissanceFiscale: 7,
        kilometreAnnuel: [{ kilometrage: 5000, annee: 2016 }],
        typeVehicule: 'Voiture'
      });

    });
    for (let i = 0; i < 10; i++) {
      const ndfID = noteDeFraisService.create({
        id: `idndf${i}`,
        idCompte,
        statut: STATUTS.validated.key
      });
      const ndf = noteDeFraisService.find(ndfID);

      for (let j = 0; j < 10; j++) {

        const date = moment().add(j, 'day').toDate();
        indemniteKilometriqueService.create({
          id: 'foobar',
          _depart: 'Lille',
          lieu: 'Paris',
          idVehicule: `car${j % 2}`,
          date,
          distance: ikDistance,
          montantARembourser: ikDistance * seuilVariable
        }, ndf);
      }
      ndfList.push(ndf);
    }

  });

  afterEach(function () {
    ndfList = [];
    db.write(()=> {
      db.delete(db.objects('FichePersonnelle'));
      db.delete(db.objects('Compte'));
      db.delete(db.objects('NoteDeFrais'));
      db.delete(db.objects('IndemniteKilometrique'));
      db.delete(db.objects('Regulation'));
      db.delete(db.objects('Vehicule'));
    });

  });

  it('should find note de frais in progress', () => {
    const compte = compteService.find(idCompte);
    db.write(()=> {
      ndfList[0].statut = STATUTS.inProgress.key;
    });
    const id = noteDeFraisService.findEnCours(compte);
    assert.equal(ndfList[0].id, id);
  });

  it('should throw error severals note de frais is in progress', () => {
    const compte = compteService.find(idCompte);
    db.write(()=> {
      ndfList[0].statut = STATUTS.inProgress.key;
      ndfList[1].statut = STATUTS.inProgress.key;
    });
    expect(noteDeFraisService.findEnCours.bind(noteDeFraisService, compte)).to.throw(Error);
  });

  it('should not delete noteDeFrais with service', () => {
    const compte = compteService.find(idCompte);
    expect(noteDeFraisService.delete.bind(noteDeFraisService, compte)).to.throw(Error);
  });

  it('should not validate ndf with no depenses or ik ', () => {
    const compte = compteService.find(idCompte);
    const noteDeFrais = noteDeFraisService.find(noteDeFraisService.findEnCours(compte));
    expect(noteDeFraisService.validate.bind(noteDeFraisService, compte, noteDeFrais)).to.throw(Error);
  });

  it('should validate ndf', () => {
    const compte = compteService.find(idCompte);
    db.write(()=> {
      ndfList[0].statut = STATUTS.inProgress.key;
    });

    const newNdf = noteDeFraisService.validate(compte, ndfList[0]);

    assert.isNotNull(newNdf);
    assert.equal(ndfList[0].statut, STATUTS.validated.key);
    assert.notEqual(newNdf.id, ndfList[0].id);
    assert.equal(newNdf.idCompte, compte.id);
    assert.equal(newNdf.statut, STATUTS.inProgress.key);
    assert.deepEqual(newNdf.indemnitesKilometriques, {});
  });

  it('should validate ndf without regulation', () => {
    const compte = compteService.find(idCompte);
    db.write(()=> {
      ndfList[0].statut = STATUTS.inProgress.key;
    });

    const newNdf = noteDeFraisService.validate(compte, ndfList[0]);

    assert.isNotNull(newNdf);
    assert.equal(ndfList[0].statut, STATUTS.validated.key);
    assert.notEqual(newNdf.id, ndfList[0].id);
    assert.equal(newNdf.idCompte, compte.id);
    assert.equal(newNdf.statut, STATUTS.inProgress.key);

    const ikRegulationList = _.toArray(db.objects('Regulation').filtered(`idNoteDeFrais = "${ndfList[0].id}"`));

    assert.equal(ikRegulationList.length, 0);

  });

  it('should validate ndf with regulation', () => {
    const compte = compteService.find(idCompte);
    db.write(()=> {
      ndfList[0].statut = STATUTS.inProgress.key;
    });

    const change = -0.5;
    const fixe = 859;
    const idVehicule = 'car0';
    const vehicule = vehiculeService.find(idVehicule);
    noteDeFraisService.baremeKilometriqueService = {
      findSeuil() {
        return {
          variable: seuilVariable + change,
          fixe: fixe
        }
      },
      findByTypeVehicule() {
        return {};
      }
    };

    assert.equal(vehicule.kilometreAnnuel[0].kilometrage, 0);

    const newNdf = noteDeFraisService.validate(compte, ndfList[0]);

    assert.isNotNull(newNdf);
    assert.equal(ndfList[0].statut, STATUTS.validated.key);
    assert.notEqual(newNdf.id, ndfList[0].id);
    assert.equal(newNdf.idCompte, compte.id);
    assert.equal(newNdf.statut, STATUTS.inProgress.key);

    const ikRegulationList = _.toArray(db.objects('Regulation').filtered(`idNoteDeFrais = "${ndfList[0].id}"`));

    assert.equal(ikRegulationList.length, 2);
    const ikRegulation = ikRegulationList[0];

    assert.equal(ikRegulation.idVehicule, idVehicule);
    assert.equal(ikRegulation.montantARembourser, -250);

    assert.equal(vehicule.kilometreAnnuel[0].kilometrage, 5 * ikDistance);

  });

  it('should find all for account and status', ()=> {
    const ndfList = noteDeFraisService.findAllForAccountAndStatus(idCompte, STATUTS.validated.key);
    assert.equal(_.toArray(ndfList).length, 10);
  });

  it('should find all others depenses', () => {
    const all = noteDeFraisService.findAllDepenses(null);
    assert.equal(all.length, 0);
  });

  it('should get first depense commune date', ()=> {
    const all = noteDeFraisService.findAllDepenses(ndfList[0]);
    const date = noteDeFraisService.getFirstDepenseCommuneDate(all);
    assert.equal(moment(date).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'));
  });

  it('should get last depense commune date', ()=> {
    const all = noteDeFraisService.findAllDepenses(ndfList[0]);
    const date = noteDeFraisService.getLastDepenseCommuneDate(all);
    assert.equal(moment(date).format('DD/MM/YYYY'), moment().add(9, 'day').format('DD/MM/YYYY'));
  });

  it('should get null for first depense commune date if depense list is null', ()=> {
    const date = noteDeFraisService.getFirstDepenseCommuneDate(null);
    assert.isNull(date);
  });

  it('should get null for last depense commune date if depense list is empty', ()=> {
    const date = noteDeFraisService.getLastDepenseCommuneDate([]);
    assert.isNull(date);
  });

  it('should update total', () => {
    assert.equal(ndfList[0].totalDepenses, 0);
    assert.equal(ndfList[0].totalIndemnitesKilometriques, 0);
    noteDeFraisService.updateTotal(ndfList[0]);
    assert.equal(ndfList[0].totalDepenses, 0);
    assert.equal(ndfList[0].totalIndemnitesKilometriques, 600);
  });

  it('should get rapport', () => {
    const compte = compteService.find(idCompte);
    let rapport = noteDeFraisService.getRapport(compte);
    assert.deepEqual(rapport, [
      { status: 'inProgress', num: '0 devise' },
      { status: 'validated', num: 10 }
    ]);

  });

});
