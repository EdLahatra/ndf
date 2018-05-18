import { describe, it } from 'mocha';

import OauthService from '../../../app/services/OauthService';
import ValeurAnalytiqueService from '../../../app/services/ValeurAnalytiqueService';
import RealmService from '../../../app/services/RealmService';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert, expect } = chai;
const { equal, isOk } = assert;
chai.should();

describe('ValeurAnalytiqueService', () => {

  let service = new ValeurAnalytiqueService();

  before(function (done) {

    new OauthService().authenticate({
      username: 'ndf.test',
      password: 'compta'
    }).should.be.fulfilled.should.notify(done);

  });

  it('should find and merge all', (done) => {
    service.findAll().should.be.fulfilled.then((response) => {
      isOk(response);
      service.mergeAll(response).should.be.fulfilled.then((results) => {
        console.log(results.length);
        equal(RealmService.service.objects(service.schema.name).length, results.length);
      }).should.notify(done);

    });
  });

  it('should find and merge', (done) => {
    const id = '8095efd5-d5dd-4bed-bf38-bf63d1001f4e';
    service.find(id).should.be.fulfilled.then((response) => {
      isOk(response);
      service.merge(response).should.be.fulfilled.then((result) => {
        const mergeElement = RealmService.service.objects(service.schema.name).filtered(`id = "${id}"`)[0];
        equal(mergeElement.id, result.id);
      }).should.notify(done);
    });
  });

});
