import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import CompteService  from '../../../app/services/CompteService';
import FichePersonnelleService  from '../../../app/services/FichePersonnelleService';
import RealmService  from '../../../app/services/RealmService';

describe('CompteService', () => {

  let compteService, db, fichePersonnelleService;
  const idCompte = 'foobar';

  beforeEach(function () {
    compteService = new CompteService();
    fichePersonnelleService = new FichePersonnelleService();
    db = RealmService.service;
    db.write(()=> {
      db.create('Compte', { id: idCompte });
    });
  });

  afterEach(function () {
    db.write(()=> {
      db.delete(db.objects('Compte'));
      db.delete(db.objects('FichePersonnelle'));
    });
  });

  it('should not create compte', () => {
    expect(compteService.create.bind(compteService)).to.throw(Error);
  });

  it('should create or update fiche personnelle', () => {
    const compte = compteService.find(idCompte);
    const form = { nom: 'foo', prenom: 'bar', email: 'foo@bar' };
    const idFiche = compteService.createOrUpdateFichePersonnelle(compte, form);
    assert.isNotNull(idFiche);
    let fiche = fichePersonnelleService.find(idFiche);
    assert.equal(fiche.nom, form.nom);
    assert.equal(compte.idFichePersonnelle, idFiche);

    form.nom = 'fou';

    compteService.createOrUpdateFichePersonnelle(compte, form);
    fiche = fichePersonnelleService.find(idFiche);
    assert.equal(fiche.nom, form.nom);
    assert.equal(fiche.id, idFiche);
    assert.equal(compte.idFichePersonnelle, idFiche);


  });

});