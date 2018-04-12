import ApiService from '../../../app/services/ApiService';
import RealmService from '../../../app/services/RealmService';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('ApiService', () => {

  let apiService, db;

  beforeEach(function () {
    apiService = new ApiService({ url: 'http://test', grant_type: 'password', client_id: '', client_secret: '' });
    assert.isNotNull(apiService);
    db = RealmService.service;
  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('CompteSecure'));
    });
  });

  it('should get configuration from selected account', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar', typeCompte: 'ComptaCom', isSelected: true });
    });

    assert.isNotNull(apiService.getConfiguration());
    assert.isNotNull(apiService.getApiConfiguration());
  });

  it('should get oauth service', () => {

    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar', typeCompte: 'ComptaCom', isSelected: true });
    });

    assert.isNotNull(apiService.getOauthService());
  });

  it('should transform object to query params', () => {
    const queryParams = apiService.toQueryParams({ foo: 'bar', num: 5 });
    assert.equal('foo=bar&num=5', queryParams);
  });

  it('should build url', () => {
    db.write(()=> {
      db.create('CompteSecure', { id: 'foobar', typeCompte: 'ComptaCom', isSelected: true });
    });

    const url = apiService.buildUrl('test', ['id'], { foo: 'bar' });
    assert.equal(url, 'https://test.compta.com/API/rest/notesDeFrais/v1/test/id?foo=bar');
  });

});
