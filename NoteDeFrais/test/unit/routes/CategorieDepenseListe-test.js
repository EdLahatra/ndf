import RealmService from '../../../app/services/RealmService';
import CategorieDepenseListe from '../../../app/routes/CategorieDepenseListe';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('Routes: CategorieDepenseListe', () => {

  let db;

  beforeEach(function () {

  });

  afterEach(function () {
  });

  it('should load component', () => {
    assert.isNotNull(CategorieDepenseListe);
  });

});
