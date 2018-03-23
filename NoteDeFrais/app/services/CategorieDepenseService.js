import CategorieDepense from '../schemas/CategorieDepense';
import EntityService  from './EntityService';
import I18n from '../i18n/translations';

import { TYPE } from '../schemas/Depense';

/**
 * Service de gestion des catégories de dépense
 * @override {EntityService}
 */
export default class CategorieDepenseService extends EntityService {

  /**
   * Initialisation du service
   */
  constructor () {
    super(CategorieDepense.schema);
  }

  /**
   * Retourne la catégorie par défaut
   * @returns {{nom: *, icone: string}}
   */
  getIndemniteKilometriqueCategorie () {
    return {
      nom: I18n.t('categories.carFees'),
      icone: 'glyphicons-car'
    };
  }

}