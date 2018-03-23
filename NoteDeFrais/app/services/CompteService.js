import Utils from '../lib/utils';

import { Compte, TYPES } from '../schemas/Compte';
import FichePersonnelle  from '../schemas/FichePersonnelle';
import EntityService from './EntityService';
import FichePersonnelleService from './FichePersonnelleService';

/**
 * Service de gestion des comptes
 * @override {EntityService}
 */
export default class CompteService extends EntityService {

  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super(Compte.schema);
    /** @type {FichePersonnelleService} */
    this.fichePersonnelleService = new FichePersonnelleService();
  }

  create () {
    throw new Error('Not implemented');
  }

  createOrUpdateFichePersonnelle (compte, { nom, prenom, email }) {
    let id = null;
    if (compte.idFichePersonnelle) {
      id = compte.idFichePersonnelle;

      this.service.write(() => {
        this.service.create(FichePersonnelle.schema.name, {
          id: compte.idFichePersonnelle,
          nom,
          prenom,
          email
        }, true);
      });

    }
    else {
      id = Utils.uuid();

      this.service.write(() => {
        this.service.create(FichePersonnelle.schema.name, {
          id,
          nom,
          prenom,
          email,
          idCompte: compte.id
        });

        compte.idFichePersonnelle = id;

      });
    }

    return id;
  }

}