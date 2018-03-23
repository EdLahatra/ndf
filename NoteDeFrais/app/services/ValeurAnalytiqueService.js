import EntityService  from './EntityService';
import ValeurAnalytique from '../schemas/ValeurAnalytique';

/**
 * Service de gestion des valeurs analytiques
 * @override {EntityService}
 */
export default class ValeurAnalytiqueService extends EntityService {

  /**
   * Initialisation du service
   */
  constructor () {
    super(ValeurAnalytique.schema);
  }

}