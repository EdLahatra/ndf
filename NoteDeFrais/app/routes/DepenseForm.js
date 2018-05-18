import _ from 'underscore';
import { Actions } from 'react-native-router-flux';
import CompteSecureService from '../services/CompteSecureService';
import ValeurAnalytiqueService from '../services/ValeurAnalytiqueService';
import DepenseService from '../services/DepenseService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import JustificatifService from '../services/JustificatifService';
import RealmForm from '../components/realm-form';
import Depense from '../schemas/Depense';
import AxeAnalytiqueService from '../services/AxeAnalytiqueService';

/**
 * Page du formulaire de depense
 *
 * @module app/routes/DepenseCommuneForm.js
 * @override app/components/RealmForm
 */
export default class DepenseCommuneForm extends RealmForm {
  constructor() {
    super();
    /** @type {AxeAnalytiqueService} */
    this.axeAnalytiqueService = new AxeAnalytiqueService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {ValeurAnalytiqueService} */
    this.valeurAnalytiqueService = new ValeurAnalytiqueService();
    /** @type {DepenseService} */
    this.depenseService = new DepenseService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {JustificatifService} */
    this.justificatifService = new JustificatifService();
  }

  /**
   * Retourne la dépense en cours en fonction du contexte
   * Charge les justificatifs
   * Charge les valeurs anallytiques
   * @param props
   * @returns {Object}
   */
  getStateValue() {
    const depenseCommune = _.clone(this.props.depenseCommune) || {};
    if (depenseCommune.justificatifs) {
      depenseCommune.justificatifs = depenseCommune.justificatifs
        .map(justificatif => this.justificatifService.find(justificatif.id))
        .filter(justificatif => justificatif !== null);
    }


    if (depenseCommune.valeursAnalytiques) {
      depenseCommune.valeursAnalytiques = _.toArray(depenseCommune.valeursAnalytiques)
        .map(valeur => this.valeurAnalytiqueService.find(valeur.id));
    }

    if (depenseCommune.codeTva !== 'ok') {
      depenseCommune.codeTva = this.props.category.codeTva;
    }

    if (depenseCommune.codeTva === 'undefined') {
      this.props.navigationState.component.depenseService.schema._form.secure.tva.hidden = true;
      this.props.navigationState.component.depenseService.schema._form.autonome.tva.hidden = true;
    } else if (depenseCommune.codeTva === undefined) {
      this.props.navigationState.component.depenseService.schema._form.secure.tva.hidden = true;
      this.props.navigationState.component.depenseService.schema._form.autonome.tva.hidden = true;
    } else if (depenseCommune.codeTva == null) {
      this.props.navigationState.component.depenseService.schema._form.secure.tva.hidden = true;
      this.props.navigationState.component.depenseService.schema._form.autonome.tva.hidden = true;
    } else {
      this.props.navigationState.component.depenseService.schema._form.secure.tva.hidden = false;
      this.props.navigationState.component.depenseService.schema._form.autonome.tva.hidden = false;
    }

    return depenseCommune;
  }

  /**
   * Méthode qui vérifie la possibilité de supprimer un instance en fonction du contexte
   * @param props
   * @returns {boolean}
   */
  static shouldDelete = props => props.depenseCommune

  /**
   * Méthode qui recalcule la TVA applicable au montant à rembourser
   * @param value
   * @returns {boolean}
   */
  onChange(value) {
    const updatedValue = _.clone(value);
    if (this.state.value.montantARembourser !== value.montantARembourser) {
      const tva = this.depenseService.computeTVA(
        this.props.category, updatedValue.montantARembourser
      );
      if (tva) {
        updatedValue.tva = tva;
      }
    }
    this.setState({ value: updatedValue });
  }

  /**
   * Retourne la configuration du formulaire
   * Charge les axes analytiques
   * @returns {Object}
   */
  getConfig() {
    if (this.compteSecureService.shouldUseApiService()) {
      const selectedAccount = this.compteSecureService.getSelectedAccount();
      const axesAnalytiques = this.axeAnalytiqueService.findAllForAccount(
        selectedAccount.compte.id);
      this.setState({ axesAnalytiques });

      return {
        schema: Depense.schema,
        axesAnalytiques,
        formType: 'secure'
      };
    }

    return {
      schema: Depense.schema,
      formType: 'autonome'
    };
  }

  static getTitle = props => props.category ? props.category.nom : null;

  static compteSecureService = new CompteSecureService();
  static depenseService = new DepenseService();
  static noteDeFraisService = new NoteDeFraisService();

  static delete(depenseCommune) {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    const ndf = this.noteDeFraisService.find(
      this.noteDeFraisService.findEnCours(selectedAccount.compte));
    this.depenseService.delete(depenseCommune, ndf);
    this.noteDeFraisService.updateTotal(ndf);
    const noteDeFrais = this.noteDeFraisService.find(ndf.id);
    Actions.pop({ refresh: { noteDeFrais } });
  }

  static save(props, formValues) {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    const ndf = this.noteDeFraisService.find(
      this.noteDeFraisService.findEnCours(selectedAccount.compte));

    formValues.valeursAnalytiques = _.filter(formValues.valeursAnalytiques, valeur => valeur.id)
      .map(valeur => ({ id: valeur.id }));
    if (formValues.id) {
      this.depenseService.update(formValues);
      this.noteDeFraisService.updateTotal(ndf);
      const noteDeFrais = this.noteDeFraisService.find(ndf.id);
      Actions.pop({ refresh: { noteDeFrais } });
    } else {
      formValues.idCategorieDepense = props.category.id;
      this.depenseService.create(formValues, ndf);
      this.noteDeFraisService.updateTotal(ndf);
      const noteDeFrais = this.noteDeFraisService.find(ndf.id);
      Actions.pop({ popNum: 2, refresh: { noteDeFrais } });
    }
  }
}
