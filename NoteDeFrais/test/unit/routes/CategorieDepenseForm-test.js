import RealmService from '../../../app/services/RealmService';
import CategorieDepenseForm from '../../../app/routes/CategorieDepenseForm';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('Routes: CategorieDepenseForm', () => {

  let db;

  beforeEach(function () {

  });

  afterEach(function () {
  });

  it('should load component', () => {
    assert.isNotNull(CategorieDepenseForm);
  });

});
