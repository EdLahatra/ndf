import EntityService  from './EntityService';
import FichePersonnelle from '../schemas/FichePersonnelle';

/**
 * Service de gestion de la fiche personnelle
 * @override {EntityService}
 */
export default class FichePersonnelleService extends EntityService {

  /**
   * Initialisation du service
   */
  constructor () {
    super(FichePersonnelle.schema);
  }

}