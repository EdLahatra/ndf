import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import CompteSecureService  from '../../../app/services/CompteSecureService';
import RealmService  from '../../../app/services/RealmService';

import moment from 'moment';
import _ from 'underscore';

describe('CompteSecureService', () => {

  let db, compteSecureService;

  beforeEach(function () {
    compteSecureService = new CompteSecureService();
    db = RealmService.service;
  });

  afterEach(function () {

    db.write(()=> {
      db.delete(db.objects('CompteSecure'));
      db.delete(db.objects('Compte'));
      db.delete(db.objects('Vehicule'));
      db.delete(db.objects('AxeAnalytique'));
      db.delete(db.objects('ValeurAnalytique'));
      db.delete(db.objects('Depense'));
      db.delete(db.objects('NoteDeFrais'));
      db.delete(db.objects('IndemniteKilometrique'));
    });

  });

  it('should get default categories', () => {
    assert.isNotNull(compteSecureService._getDefaultCategories());
  });

  it('should find by id', () => {
    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });

    assert.isNotNull(compteSecureService.find('foobar'));

  });

  it('should find by all', () => {
    db.write(()=> {
      for (let i = 0; i < 10; i++) {
        db.create('CompteSecure', { id: `foobar${i}` });
      }

    });

    const all = compteSecureService.findAll();
    assert.isNotNull(all);
    assert.equal(_.toArray(all).length, 10);

  });

  it('should get/set selected', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });

    const foobar = compteSecureService.find('foobar');
    assert.notDeepEqual(foobar, compteSecureService.getSelectedAccount());

    compteSecureService.setSelected(foobar);

    assert.deepEqual(foobar, compteSecureService.getSelectedAccount());
  });

  it('should check if selected account can manage categories', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });

    assert.equal(false, compteSecureService.shouldManageCategories());

    const foobar = compteSecureService.find('foobar');
    compteSecureService.setSelected(foobar);

    assert.equal(true, compteSecureService.shouldManageCategories());

  });

  it('should check if selected account should use api service ', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });

    const foobar = compteSecureService.find('foobar');
    assert.equal(true, compteSecureService.shouldUseApiServiceWith(foobar));

    db.write(()=> {
      foobar.compte = { id: 'compte' };
    });

    assert.equal(false, compteSecureService.shouldUseApiServiceWith(foobar));

    db.write(()=> {
      foobar.typeCompte = 'ComptaCom';
    });

    assert.equal(false, compteSecureService.shouldUseApiServiceWith(foobar));

    db.write(()=> {
      foobar.access_token = 'user';
    });

    assert.equal(true, compteSecureService.shouldUseApiServiceWith(foobar));

    db.write(()=> {
      foobar.typeCompte = 'Gescab';
    });

    assert.equal(true, compteSecureService.shouldUseApiServiceWith(foobar));

  });

  it('should skip authentification', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });

    assert.equal(false, compteSecureService.shouldSkipAuthentication());

    const foobar = compteSecureService.find('foobar');
    compteSecureService.setSelected(foobar);

    assert.equal(true, compteSecureService.shouldSkipAuthentication());

    db.write(()=> {
      foobar.compte = { id: 'compte' };
    });

    assert.equal(false, compteSecureService.shouldSkipAuthentication());

    db.write(()=> {
      foobar.compte.idFichePersonnelle = 'fiche';
    });

    assert.equal(true, compteSecureService.shouldSkipAuthentication());

  });

  it('should delete all in cascade', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'future', compte: { id: 'futureCompte' } });
      db.create('CompteSecure', { id: 'foobar', compte: { id: 'compte' } });
      db.create('Vehicule', {
        id: 'foobar',
        nom: 'tesla',
        immatriculation: 'ae-dc-32',
        typeVehicule: 'Voiture',
        puissanceFiscale: 15,
        idCompte: 'compte'
      });

      db.create('AxeAnalytique', {
        id: 'axe',
        idCompte: 'compte',
        description: '',
        valeurAnalytiques: [{ id: 'valeur' }]
      });
      db.create('ValeurAnalytique', { id: 'valeur', idAxeAnalytique: 'axe', description: '', code: 'ZZ' });
      db.create('NoteDeFrais', { id: 'ndf', idCompte: 'compte' });
      db.create('Depense', {
        id: 'dep',
        idNoteDeFrais: 'ndf',
        description: '',
        date: new Date(),
        idCategorieDepense: 'ddd'
      });
      db.create('IndemniteKilometrique', {
        id: 'ik',
        idNoteDeFrais: 'ndf',
        description: '',
        date: new Date(),
        _depart: 'Lille',
        lieu: 'Laval',
        idVehicule: 'xxx'
      });
    });

    const foobar = compteSecureService.find('foobar');
    compteSecureService.delete(foobar);

    assert.equal('future', compteSecureService.getSelectedAccount().id);

    const future = compteSecureService.find('future');
    compteSecureService.delete(future);
    assert.isNotOk(compteSecureService.getSelectedAccount());
  });

  it('should create compte secure', () => {

    const id = '81cc6e07-b726-4325-b02c-f96a82753724';
    db.write(()=> {
      db.create('Compte', {
        id,
        typeCompte: 'Autonome'
      });
    });

    const compteSecureId = compteSecureService.create({});
    assert.equal(id, compteSecureService.find(compteSecureId).compte.id);
  });

  it('should attach compte to compte secure', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });

    const compte = { id: 'compte' };
    compteSecureService.attachCompte('foobar', compte);
    const foobar = compteSecureService.find('foobar');
    assert.isNotNull(foobar.compte);

  });

  it('should unselect all selected account', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar', isSelected: true });
      db.create('CompteSecure', { id: 'foobar2', isSelected: true });
    });

    let all = _.toArray(db.objects('CompteSecure').filtered('isSelected = true'));
    assert.equal(2, all.length);

    db.write(()=> {
      compteSecureService._unsetSelectedAccounts();
    });

    all = _.toArray(db.objects('CompteSecure').filtered('isSelected = true'));
    assert.equal(0, all.length);
    assert.isNotOk(compteSecureService.getSelectedAccount());

  });

  it('should check if compte secure has expired token', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar' });
    });
    assert.equal(true, compteSecureService.hasExpiredToken());

    const foobar = compteSecureService.find('foobar');
    db.write(()=> {
      foobar.isSelected = true;
    });
    assert.equal(true, compteSecureService.hasExpiredToken());

    db.write(()=> {
      foobar.expirationDate = moment().subtract('1', 'minute').toDate();
    });
    assert.equal(true, compteSecureService.hasExpiredToken());

    db.write(()=> {
      foobar.expirationDate = moment().add('1', 'hour').toDate();
    });
    assert.equal(false, compteSecureService.hasExpiredToken());

  });

  it('should get access_token from select compte secure', () => {
    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar', isSelected: true });
    });

    expect(compteSecureService.getAccessToken.bind(compteSecureService)).to.throw(Error, '[CompteSecureService] No access token found for foobar');

    const foobar = compteSecureService.find('foobar');
    db.write(()=> {
      foobar.access_token = 'token';
    });

    assert.equal('token', compteSecureService.getAccessToken());

  });

  it('should get/set fetch all property', () => {
    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar', isSelected: true });
    });
    expect(false, compteSecureService.shouldFetchAll());

    compteSecureService.setFetchAll(new Date());

    expect(false, compteSecureService.shouldFetchAll());
    const foobar = compteSecureService.find('foobar');
    db.write(()=> {
      foobar.compte = { id: 'compte' };
      foobar.typeCompte = 'ComptaCom';
    });
    expect(false, compteSecureService.shouldFetchAll());

  });

  it('should create only one compte secure "AUTONOME"', () => {
    const compteSecureId = compteSecureService.create({});
    assert.isNotNull(compteSecureId);
    const compteSecure = compteSecureService.find(compteSecureId);
    assert.isNotNull(compteSecure);
    assert.equal(compteSecure.typeCompte, 'Autonome');
    assert.equal(compteSecure.isSelected, true);
    assert.isNotNull(compteSecure.compte);
    assert.equal(compteSecureId, compteSecureService.create({}));
  });

});
