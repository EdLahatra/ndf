import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import CompteService  from '../../../app/services/CompteService';
import ConfigurationService  from '../../../app/services/ConfigurationService';
import RealmService  from '../../../app/services/RealmService';

describe('ConfigurationService', () => {

  let compteService, db, configurationService;
  const idCompte = 'foobar';

  beforeEach(function () {
    compteService = new CompteService();
    configurationService = new ConfigurationService();
    db = RealmService.service;
  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('Configuration'));
    });
  });

  it('should get configuration', () => {
    assert.isNotNull(configurationService.getConfiguration());
  });

});