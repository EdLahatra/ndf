import { describe, it } from 'mocha';

import OauthService from '../../../app/services/OauthService';
import FichePersonnelleService from '../../../app/services/FichePersonnelleService';
import RealmService from '../../../app/services/RealmService';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert, expect } = chai;
const { equal, isOk } = assert;
chai.should();

describe('FicgePersonnelleService', () => {

  let service = new FichePersonnelleService();

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

  it('should find and merge', (done) => {
    const id = '61bbfab2-23e6-432c-9c87-a1caed672a66';
    service.find(id).should.be.fulfilled.then((response) => {
      isOk(response);
      service.merge(response).should.be.fulfilled.then((result) => {
        const mergeElement = RealmService.service.objects(service.schema.name).filtered(`id = "${id}"`)[0];
        equal(mergeElement.id, result.id);
      }).should.notify(done);
    });
  });

});
