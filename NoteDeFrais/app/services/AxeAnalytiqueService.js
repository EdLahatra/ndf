import EntityService  from './EntityService';
import AxeAnalytique from '../schemas/AxeAnalytique';

/**
 * Service de gestion des axes analytiques
 * @override {EntityService}
 */
export default class AxeAnalytiqueService extends EntityService {

  /**
   * Initialisation du service
   */
  constructor () {
    super(AxeAnalytique.schema);
  }

}