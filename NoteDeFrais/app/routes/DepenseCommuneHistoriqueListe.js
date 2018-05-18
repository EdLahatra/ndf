import GoogleAnalytics from 'react-native-google-analytics-bridge';

import DepenseCommuneListe from './DepenseCommuneListe';
import NoteDeFraisService from '../services/NoteDeFraisService';

/**
 * Page d'historique des dépenses communes
 *
 * @module app/routes/DepenseCommuneHistoriqueListe.js
 * @override {DepenseCommuneListe}
 */
export default class DepenseCommuneHistoriqueListe extends DepenseCommuneListe {
  /**
   * Méthode invoquée une fois que le DOM est chargé.
   */
  componentDidMount() {
    super.componentDidMount();
    GoogleAnalytics.trackScreenView('DepenseCommuneHistoriqueListe');
  }

  /**
   * Retourne la note de frais courrante
   * @param props
   * @returns {NoteDeFrais}
   */
  static getNoteDeFrais(props) {
    return props.noteDeFrais;
  }

  static noteDeFraisService = new NoteDeFraisService();

  static _getElements(props) {
    const noteDeFrais = this.getNoteDeFrais(props);
    if (noteDeFrais) {
      if (props.filtre) {
        return this.noteDeFraisService[props.filtre](noteDeFrais);
      }
      return this.noteDeFraisService.findAllDepenses(noteDeFrais);
    }
    return [];
  }

  /**
   * Retourne la liste des éléments en fonction du contexte
   * @param props
   * @returns {array}
   */
  getElements = props => DepenseCommuneHistoriqueListe._getElements(props);

  // eslint-disable-next-line
  onPress(depenseCommune, isSelected = false) {
  }
  // eslint-disable-next-line
  onLongPress(element, isSelected = false) { 
  }

  shouldAdd = () => false;
}
