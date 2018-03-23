import { describe, it } from 'mocha';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert, expect } = chai;
chai.should();

describe('ApiService', () => {

  let service = null;

  // NOT WORK 500
  it('should getIndemnitesKilometriques', (done) => {
    service.getIndemnitesKilometriques().should.be.fulfilled.then((response) => {
    }).should.notify(done);
  });


});
