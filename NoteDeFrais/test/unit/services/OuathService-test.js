import { OauthServiceFactory } from '../../../app/services/OauthService';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('OuathService', () => {

  let service;

  beforeEach(function () {
    service = OauthServiceFactory.getInstance('ComptaCom');
    assert.isNotNull(service);
  });

  afterEach(function () {
  });

  it('should build url for ouath', () => {
    const url = service.buildAuthUrl({ username: 'foo', password: 'bar' });
    const result = ['https://test.compta.com/ComptaWeb/rest/token',
      '?grant_type=password&client_id=oauth2clientid',
      '&client_secret=oauth2clientsecret&username=foo&password=bar'].join('')
    assert.equal(result, url);
  });

});
