import DepenseService from '../../../app/services/DepenseService';
import RealmService from '../../../app/services/RealmService';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import moment from 'moment';
import _ from 'underscore';

describe('DepenseService', () => {

  let depenseService, db;

  beforeEach(function () {
    depenseService = new DepenseService();
    assert.isNotNull(depenseService);
    db = RealmService.service;
  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('Depense'));
      db.delete(db.objects('Justificatif'));
    });
  });

  it('should create depense', () => {

    const body = {
      idCompte: 'foo',
      idCategorieDepense: 'category',
      nom: 'Tesla',
      description: 'PEACE',
      date: new Date()
    };

    const id = depenseService.create(body, { id: 'ndf', depenses: [] });
    const depense = depenseService.find(id);
    assert.isNotNull(depense);

  });

  it('should update depense', () => {

    const body = {
      idCompte: 'foo',
      idCategorieDepense: 'category',
      description: 'PEACE',
      date: new Date()
    };
    const ndf = { id: 'ndf', depenses: [] };
    const id = depenseService.create(body, ndf);
    let depense = _.clone(depenseService.find(id));
    depense.description = 'TESLA 2';
    depenseService.update(depense, ndf);

    depense = depenseService.find(id);
    assert.notEqual(body.description, depense.description);

  });

  it('should create depense with justificatifs', () => {
    const body = {
      idCompte: 'foo',
      idCategorieDepense: 'category',
      nom: 'Tesla',
      description: 'PEACE',
      date: new Date(),
      justificatifs: [{ data: 'foo' }, { data: 'bar' }]
    };

    const id = depenseService.create(body, { id: 'ndf', depenses: [] });
    const depense = depenseService.find(id);
    assert.isNotNull(depense);
    assert.equal(2, _.toArray(depense.justificatifs).length);

    assert.deepEqual(_.toArray(db.objects('Justificatif')).map((j)=> {
      return { id: j.id }
    }), _.toArray(depense.justificatifs));
  });

  it('should update depense with justificatifs', () => {

    const body = {
      idCompte: 'foo',
      idCategorieDepense: 'category',
      nom: 'Tesla',
      description: 'PEACE',
      date: new Date(),
      justificatifs: [{ data: 'foo' }, { data: 'bar' }]
    };
    const ndf = { id: 'ndf', depenses: [] };
    const id = depenseService.create(body, ndf);
    let depense = _.clone(depenseService.find(id));
    depense.justificatifs = _.toArray(depense.justificatifs);
    depense.justificatifs.push({ data: 'bar2' });
    depenseService.update(depense, ndf);

    depense = depenseService.find(id);
    assert.deepEqual(_.toArray(db.objects('Justificatif')).map((j)=> {
      return { id: j.id }
    }), _.toArray(depense.justificatifs));

  });

  it('should set depreciation date', () => {
    const depense = {};
    depenseService.setDepreciation(depense);
    assert.deepEqual(new Date(), depense._depreciation);
  });

  it('should not compute TVA without category or tva', () => {
    let tva = depenseService.computeTVA(null, 10);
    assert.isNotOk(tva);
    tva = depenseService.computeTVA({}, 10);
    assert.isNotOk(tva);
  });

  it('should compute TVA without value', () => {
    let tva = depenseService.computeTVA({ tva: 0.2 }, null);
    assert.isNotOk(tva);
  });

  it('should compute TVA with category', () => {
    const tva = depenseService.computeTVA({ tva: 0.2 }, 10);
    assert.equal(0.02, tva);
  });

  it('should delete all depense with justificatifs', () => {

    const body = {
      idCompte: 'foo',
      idCategorieDepense: 'category',
      nom: 'Tesla',
      description: 'PEACE',
      date: new Date(),
      justificatifs: [{ data: 'foo' }, { data: 'bar' }]
    };
    const ndf = { id: 'ndf', depenses: [] };
    const id = depenseService.create(body, ndf);

    ndf.depenses.push({ id: '4fb81775-2879-4cbe-afe0-09bfdea2271b' });

    depenseService.deleteAll([id], ndf);

    assert.equal(0, depenseService.findAll().length);
    assert.equal(0, _.toArray(db.objects('Justificatif').filtered('_depreciation = null')).length);

    assert.equal(1, ndf.depenses.length);

  });

  it('should _computeHT', () => {
    const ht = depenseService._computeHT({ montantARembourser: 100, tva: 10 });
    assert.equal(90, ht);
  });

});
