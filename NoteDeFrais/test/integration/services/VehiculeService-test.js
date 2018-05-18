import { describe, it } from 'mocha';

import OauthService from '../../../app/services/OauthService';
import VehiculeService from '../../../app/services/VehiculeService';
import RealmService from '../../../app/services/RealmService';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert, expect } = chai;
const { equal, isOk } = assert;
chai.should();

describe('VehiculeService', () => {

  let service = new VehiculeService();

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
        equal(RealmService.service.objects(service.schema.name).length, results.length);
      }).should.notify(done);

    });
  });

  it('should find and merge', (done) => {
    const id = '7dc7030d-3632-4119-a688-6f3bcf971ed2';
    service.find(id).should.be.fulfilled.then((response) => {
      isOk(response);
      service.merge(response).should.be.fulfilled.then((result) => {
        const mergeElement = RealmService.service.objects(service.schema.name).filtered(`id = "${id}"`)[0];
        equal(mergeElement.id, result.id);
      }).should.notify(done);
    });
  });

 /* it('should create and synchronize', (done)=> {

    const car = {
      nom: 'VW Golf',
      immatriculation: '01-NDF-06',
      typeVehicule: 'Voiture',
      puissanceFiscale: 5,
      favori: true,
      idCompte: '5d3a4eb0-a769-4a54-9c36-2881ba5ec374',
    };

    const id = service.create(car);
    assert.isNotNull(id);

    service._synchronise().should.be.fulfilled.then((result) => {
      console.log('result', result);
    }).should.notify(done);

  });


  it('should delete and synchronize', (done)=> {

    const cars = RealmService.service.objects(service.schema.name);

    const id = service.delete(cars[0]);
    assert.isNotNull(id);

    service._synchronise().should.be.fulfilled.then((result) => {

      service.find(id).should.be.fulfilled.then((element) => {

        console.log(element);
        assert.isNotNull(element.depreciation);

      }).should.notify(done);

    });

  });*/

});
