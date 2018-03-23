import OauthService from '../../../app/services/OauthService';
import RealmEncryptionService from '../../../app/services/RealmEncryptionService';
import { describe, it } from 'mocha';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert } = chai;
chai.should();

describe('OuathService', () => {

  let service;

  beforeEach(function () {
    service = new OauthService();
    assert.isNotNull(service);
    RealmEncryptionService.removeToken();
  });

  afterEach(function () {
  });

  it('should not authenticate with invalid username/password', (done) => {

    service.authenticate({
      username: 'foo',
      password: 'bar'
    }).should.be.rejected.and.notify(done);

  });

  it('should authenticate with valid username/password', (done) => {

    service.authenticate({
      username: 'ndf.test',
      password: 'compta'
    }).should.be.fulfilled.and.notify(done);

  });

});
