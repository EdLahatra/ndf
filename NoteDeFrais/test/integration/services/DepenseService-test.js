import { describe, it } from 'mocha';

import OauthService from '../../../app/services/OauthService';
import DepenseService from '../../../app/services/DepenseService';
import RealmService from '../../../app/services/RealmService';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert, expect } = chai;
const { equal, isOk } = assert;
chai.should();

describe('DepenseService', () => {

  let service = new DepenseService();

  before(function (done) {

    new OauthService().authenticate({
      username: 'ndf.test',
      password: 'compta'
    }).should.be.fulfilled.should.notify(done);

  });

  it('should find and merge all', (done) => {
    service.findAll().should.be.fulfilled.then((response) => {
      isOk(response);
      //console.log(response);
      service.mergeAll(response).should.be.fulfilled.then((results) => {
        equal(RealmService.service.objects(service.schema.name).length, results.length);
      }).should.notify(done);

    });
  });



 /* it('should find', (done) => {
    service.find('376a84e6-bcab-45f6-8a86-9a088f36dfcf').should.be.fulfilled.then((response) => {
      isOk(response);
    }).should.notify(done);
  });

  it('should find and merge', (done) => {
    service.find('376a84e6-bcab-45f6-8a86-9a088f36dfcf').should.be.fulfilled.then((response) => {
      isOk(response);
      //service.merge(response);
    }).should.notify(done);
  });*/

});
