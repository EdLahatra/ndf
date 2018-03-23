'use strict';

import React, { Component } from 'react';
import { Alert, View } from 'react-native';

import { Actions, } from 'react-native-router-flux';

import DepenseService from '../services/DepenseService';
import IndemniteKilometriqueService from '../services/IndemniteKilometriqueService';
import JustificatifService from '../services/JustificatifService';
import FichePersonnelleService from '../services/FichePersonnelleService';
import BaremeKilometriqueService from '../services/BaremeKilometriqueService';
import CategorieDepenseService from '../services/CategorieDepenseService';
import CompteSecureService from '../services/CompteSecureService';
import CompteService from '../services/CompteService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import VehiculeService from '../services/VehiculeService';
import AxeAnalytiqueService from '../services/AxeAnalytiqueService';
import ValeurAnalytiqueService from '../services/ValeurAnalytiqueService';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import Spinner from 'react-native-loading-spinner-overlay';

import I18n from '../i18n/translations';
/**
 * Page de chargement des données
 *
 * @module app/routes/Chargement.js
 * @override react/Component
 */
export default class Chargement extends Component {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();

    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {CategorieDepenseService} */
    this.categorieDepenseService = new CategorieDepenseService();
    /** @type {CompteService} */
    this.compteService = new CompteService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {AxeAnalytiqueService} */
    this.axeAnalytiqueService = new AxeAnalytiqueService();
    /** @type {ValeurAnalytiqueService} */
    this.valeurAnalytiqueService = new ValeurAnalytiqueService();
    /** @type {VehiculeService} */
    this.vehiculeService = new VehiculeService();
    /** @type {DepenseService} */
    this.depenseService = new DepenseService();
    /** @type {IndemniteKilometriqueService} */
    this.indemniteKilometriqueService = new IndemniteKilometriqueService();
    /** @type {JustificatifService} */
    this.justificatifService = new JustificatifService();
    /** @type {BaremeKilometriqueService} */
    this.baremeKilometriqueService = new BaremeKilometriqueService();
    /** @type {BaremeKilometriqueService} */
    this.baremeKilometriqueService = new BaremeKilometriqueService();

    this.fichePersonnelleService = new FichePersonnelleService();
    /** @type {Object} */
    this.state = {
      loading: true
    }
  }

  /**
   * Méthode invoquée une fois que le DOM est chargée.
   * En fonction du compte on charge les données ou simplement les barêmes kilométriques
   */
  async componentDidMount () {

    GoogleAnalytics.trackScreenView('Chargement');

    const compteSecure = this.compteSecureService.getSelectedAccount();
    GoogleAnalytics.setUser(compteSecure.id);

    if (this.compteSecureService.shouldFetchAll()) {
      try {
        await Promise.all([
          this.categorieDepenseService.mergeAll(compteSecure),
          this.compteService.mergeAll(),

          this.noteDeFraisService.mergeAll(),
          this.depenseService.mergeAll(),
          this.indemniteKilometriqueService.mergeAll(),
          this.baremeKilometriqueService.mergeAll(),
          this.vehiculeService.mergeAll(),
          this.axeAnalytiqueService.mergeAll(),
          this.valeurAnalytiqueService.mergeAll(),
          this.fichePersonnelleService.mergeAll(),
          this.justificatifService.mergeAll()
        ]);
        this.compteSecureService.setFetchAll(new Date());
      } catch (e) {
        this.setState({ loading: false });
        Alert.alert(I18n.t('Alert.warning'), e.message, [{ text: I18n.t('Alert.ok') }]);
      }
    }
    else {
      try {
        await this.baremeKilometriqueService.mergeAll();
      } catch (e) {
        this.setState({ loading: false });
        Alert.alert(I18n.t('Alert.warning'), e.message, [{ text: I18n.t('Alert.ok') }]);
      }
    }

    const noteDeFrais = this.noteDeFraisService.find(this.noteDeFraisService.findEnCours(compteSecure.compte));
    Actions.depenseCommuneListe({ noteDeFrais });
  }

  /**
   * Méthode au rendu de l'application.
   * On affiche une roue de chargement.
   *
   * @function render
   * @return react~Component
   */
  render () {
    return <View>
      <Spinner visible={this.state.loading}/>
    </View>
  }

}
