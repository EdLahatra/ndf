import VehiculeService from '../../../app/services/VehiculeService';
import RealmService from '../../../app/services/RealmService';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import moment from 'moment';
import _ from 'underscore';

describe('VehiculeService', () => {

  let vehiculeService, db;

  beforeEach(function () {
    vehiculeService = new VehiculeService();
    assert.isNotNull(vehiculeService);
    db = RealmService.service;
  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('Vehicule'));
    });
  });

  it('should get annee from date', () => {
    const annee = vehiculeService.getAnnee(moment(['2012', '02', '01']).toDate());
    assert.equal(2012, annee);
  });

  it('should find kilometrage annuel', () => {
    const vehicule = { kilometreAnnuel: { 0: { annee: 2013, kilometrage: 1000 } } };
    let kilometreAnnuel = vehiculeService.findKilometreAnnuel(vehicule, moment([2012]).toDate());
    assert.isNotOk(kilometreAnnuel);

    kilometreAnnuel = vehiculeService.findKilometreAnnuel(vehicule, moment([2013]).toDate());
    assert.isOk(kilometreAnnuel);
    assert.equal(1000, kilometreAnnuel.kilometrage);
  });

  it('should create kilometre annuel', () => {
    const vehicule = { kilometreAnnuel: [] };
    const ka = vehiculeService._createKilometrageAnnuel(vehicule, moment([2014]).toDate());
    assert.deepEqual({ annee: 2014, kilometrage: 0 }, ka);
    assert.equal(1, vehicule.kilometreAnnuel.length);
    assert.deepEqual(ka, vehicule.kilometreAnnuel[0]);
  });

  it('should find or create kilometre annuel', () => {
    const vehicule = { kilometreAnnuel: [] };
    let ka = vehiculeService.findOrCreateKilometreAnnuel(vehicule, moment([2015]), 100);
    assert.deepEqual({ annee: 2015, kilometrage: 100 }, ka);
    assert.equal(1, vehicule.kilometreAnnuel.length);
    assert.deepEqual(ka, vehicule.kilometreAnnuel[0]);

    ka = vehiculeService.findOrCreateKilometreAnnuel(vehicule, moment([2015]), 100);
    assert.deepEqual({ annee: 2015, kilometrage: 100 }, ka);
  });

  it('should find kilometrage', () => {
    db.write(()=> {
      db.create('Vehicule', {
        id: 'foobar',
        idCompte: 'foo',
        nom: 'Tesla',
        immatriculation: 'PEACE',
        typeVehicule: 'Voiture',
        puissanceFiscale: 10
      });
    });

    const vehicule = vehiculeService.find('foobar');
    let kilometrage = vehiculeService.findKilometrage(vehicule, moment([1999]).toDate());

    assert.equal(0, kilometrage);
    assert.equal(1, vehicule.kilometreAnnuel.length);
    assert.deepEqual({ annee: 1999, kilometrage: 0 }, vehicule.kilometreAnnuel[0]);

    db.write(()=> {
      vehicule.kilometreAnnuel.push({ annee: 2005, kilometrage: 10101 });
    });

    kilometrage = vehiculeService.findKilometrage(vehicule, moment([2005]).toDate());
    assert.equal(2, vehicule.kilometreAnnuel.length);
    assert.equal(10101, kilometrage);

  });

  it('should create vehicule', () => {

    const body = {
      idCompte: 'foo',
      nom: 'Tesla',
      immatriculation: 'PEACE',
      typeVehicule: 'Voiture',
      puissanceFiscale: 10
    };

    const id = vehiculeService.create(body);
    const vehicule = vehiculeService.find(id);
    assert.isNotNull(vehicule);

  });

  it('should create severals vehicules but have one "favori"', () => {

    const body = {
      idCompte: 'foo',
      nom: 'Tesla',
      immatriculation: 'PEACE',
      typeVehicule: 'Voiture',
      puissanceFiscale: 10,
      favori: true
    };

    for (let i = 0; i < 10; i++) {
      vehiculeService.create(body);
    }

    assert.equal(10, db.objects('Vehicule').length);
    assert.equal(1, db.objects('Vehicule').filtered('favori=true').length);

  });

  it('should update vehicule when already have "favori" but have one "favori"', () => {

    const body = {
      idCompte: 'foo',
      nom: 'Tesla',
      immatriculation: 'PEACE',
      typeVehicule: 'Voiture',
      puissanceFiscale: 10,
      favori: true
    };

    for (let i = 0; i < 10; i++) {
      vehiculeService.create(body);
    }

    assert.equal(10, db.objects('Vehicule').length);
    assert.equal(1, db.objects('Vehicule').filtered('favori=true').length);

    const notFavori = _.clone(db.objects('Vehicule').filtered('favori=false')[0]);
    assert.equal(false, notFavori.favori);
    notFavori.favori = true;

    vehiculeService.update(notFavori);
    const favoris = db.objects('Vehicule').filtered('favori=true');
    assert.equal(1, favoris.length);
    assert.deepEqual(notFavori, favoris[0]);

  });

  it('should delete all', () => {

    const body = {
      idCompte: 'foo',
      nom: 'Tesla',
      immatriculation: 'PEACE',
      typeVehicule: 'Voiture',
      puissanceFiscale: 10,
      favori: true
    };

    for (let i = 0; i < 10; i++) {
      vehiculeService.create(body);
    }

    const all = vehiculeService.findAll();
    assert.equal(10, all.length);
    const idList = vehiculeService.findAll().map((v)=> v.id);

    vehiculeService.deleteAll(idList);
    assert.equal(0, vehiculeService.findAll());

  });

  it('should not find fake id', () => {

    assert.isNotOk(vehiculeService.find('fakeId'));

  });

  it('should find all for account', () => {

    const body = {

      nom: 'Tesla',
      immatriculation: 'PEACE',
      typeVehicule: 'Voiture',
      puissanceFiscale: 10,
      favori: true
    };

    for (let i = 0; i < 10; i++) {
      body.idCompte = `foo-${i}`;
      vehiculeService.create(body);
    }

    assert.equal(1, vehiculeService.findAllForAccount('foo-7').length);

  });

  it('should format vehicule', () => {

    const body = {
      idCompte: 'foo',
      nom: 'Tesla',
      immatriculation: 'PEACE',
      typeVehicule: 'Voiture',
      puissanceFiscale: 10
    };

    const id = vehiculeService.create(body);
    const vehicule = vehiculeService.find(id);

    assert.deepEqual({
      "depreciation": null,
      "favori": "false",
      "id": `${id}`,
      "idCompte": "foo",
      "derniereModification": moment().utc().format(),
      "immatriculation": "PEACE",
      "kilometreAnnuel": [],
      "nom": "Tesla",
      "puissanceFiscale": 10,
      "typeVehicule": "Voiture"
    }, vehiculeService.format(vehicule));

  });

  it('should parse vehicule', () => {

    const v = {
      "depreciation": null,
      "favori": "false",
      "id": 'foobar',
      "idCompte": "foo",
      "immatriculation": "PEACE",
      "kilometreAnnuel": [],
      "nom": "Tesla",
      "puissanceFiscale": 10,
      "typeVehicule": "Voiture"
    };

    assert.deepEqual({
      "depreciation": null,
      "favori": false,
      "id": "foobar",
      "idCompte": "foo",
      "immatriculation": "PEACE",
      "kilometreAnnuel": [],
      "nom": "Tesla",
      "puissanceFiscale": 10,
      "typeVehicule": "Voiture"
    }, vehiculeService.parse(v));

  });

});
