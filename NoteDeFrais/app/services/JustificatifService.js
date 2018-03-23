import Justificatif from '../schemas/Justificatif';
import EntityService  from './EntityService';

/**
 * Service de gestion des justificatifs
 * @override {EntityService}
 */
export default class JustificatifService extends EntityService {

  /**
   * Initialisation du service
   */
  constructor () {
    super(Justificatif.schema);
  }

}