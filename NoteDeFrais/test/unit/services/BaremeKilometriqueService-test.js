import BaremeKilometriqueService from '../../../app/services/BaremeKilometriqueService';
import RealmService from '../../../app/services/RealmService';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import moment from 'moment';

describe('BaremeKilometriqueService', () => {

  let baremeKilometriqueService, db;

  beforeEach(function () {
    baremeKilometriqueService = new BaremeKilometriqueService();
    assert.isNotNull(baremeKilometriqueService);
    db = RealmService.service;

    db.write(()=> {
      db.create('BaremeKilometrique', {
        id: 'foobar',
        typeVehicule: 'Voiture',
        debut: moment([2014, 1]).toDate(),
        fin: moment([2015, 12]).toDate(),
        seuils: [{
          mini: -1,
          variable: 0.54,
          fixe: 0,
          puissanceFiscale: 4
        }, {
          mini: 5001,
          variable: 0.54,
          fixe: 832,
          puissanceFiscale: 4
        }, {
          mini: 20001,
          variable: 0.50,
          fixe: 0,
          puissanceFiscale: 4
        }, {
          mini: -1,
          variable: 0.64,
          fixe: 0,
          puissanceFiscale: 6
        }, {
          mini: 5001,
          variable: 0.6,
          fixe: 800,
          puissanceFiscale: 6
        }, {
          mini: 20001,
          variable: 0.55,
          fixe: 0,
          puissanceFiscale: 6
        }]
      });

      db.create('BaremeKilometrique', {
        id: 'foobar2',
        typeVehicule: 'Voiture',
        debut: moment([2016, 1]).toDate(),
        fin: moment([2016, 12]).toDate(),
        seuils: [{
          mini: -1,
          variable: 0.54,
          fixe: 0,
          puissanceFiscale: 4
        }, {
          mini: 5001,
          variable: 0.54,
          fixe: 832,
          puissanceFiscale: 4
        }, {
          mini: 20001,
          variable: 0.50,
          fixe: 0,
          puissanceFiscale: 4
        }, {
          mini: -1,
          variable: 0.64,
          fixe: 0,
          puissanceFiscale: 6
        }, {
          mini: 5001,
          variable: 0.6,
          fixe: 800,
          puissanceFiscale: 6
        }, {
          mini: 20001,
          variable: 0.55,
          fixe: 0,
          puissanceFiscale: 6
        }]
      });
    });

  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('BaremeKilometrique'));
      db.delete(db.objects('Seuil'));
    });
  });

  it('should find All', () => {
    assert.equal(2, baremeKilometriqueService.findAll().length);
  });

  it('should find bareme kilometrique by vehicule type and date', () => {
    const date = moment([2017, 6]).toDate();
    expect(baremeKilometriqueService.findByTypeVehicule.bind(baremeKilometriqueService, 'fake', date)).to.throw(Error);
    const bareme = baremeKilometriqueService.findByTypeVehicule('Voiture', date);
    assert.isOk(bareme);
  });

  it('should find seuil', () => {
    const date = moment([2016, 6]).toDate();
    const bareme = baremeKilometriqueService.findByTypeVehicule('Voiture', date);
    const seuil = baremeKilometriqueService.findSeuil(bareme, 5);
    assert.equal(-1, seuil.mini);
    assert.equal(4, seuil.puissanceFiscale);

  });

});
