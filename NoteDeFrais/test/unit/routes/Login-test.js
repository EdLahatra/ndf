import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import RealmService from '../../../app/services/RealmService';
import Login from '../../../app/routes/Login';
import CompteSecure from '../../../app/schemas/CompteSecure';
import { TYPES } from '../../../app/schemas/Compte';

describe('Routes: Login', () => {

  let db;

  beforeEach(function () {

  });

  afterEach(function () {
  });

  it('should instantiate component', () => {
    const login = new Login({ typeCompte: TYPES.COMPTACOM });
    assert.isNotNull(login);
  });

  it('should get config', () => {
    const login = new Login({ typeCompte: TYPES.COMPTACOM });
    assert.deepEqual({ schema: CompteSecure.schema }, login.getConfig());
  });

  it('should get state value', () => {
    const login = new Login({ typeCompte: TYPES.COMPTACOM });
    assert.isOk(login.state);
  });

});
