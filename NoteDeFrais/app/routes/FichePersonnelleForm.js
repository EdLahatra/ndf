'use strict';

import React from 'react';
import { View, Text } from 'react-native';

import { Actions, } from 'react-native-router-flux';

import CompteService from '../services/CompteService';
import FichePersonnelle from '../schemas/FichePersonnelle';
import RealmForm from '../components/realm-form';
import I18n from '../i18n/translations';

import CompteSecureService from '../services/CompteSecureService';
import FichePersonnelleService from '../services/FichePersonnelleService';

import _ from 'underscore';

/**
 * Page du formulaire de fiche personnelle
 *
 * @module app/routes/FichePersonnelleForm.js
 * @override app/components/RealmForm
 */
export default class FichePersonnelleForm extends RealmForm {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {FichePersonnelleService} */
    this.fichePersonnelleService = new FichePersonnelleService();
  }

  getConfig () {
    const formType = this.compteSecureService.shouldUseApiService() ? 'secure' : 'autonome';
    return { schema: FichePersonnelle.schema, formType };
  }

  getStateValue (props) {
    const compte = this.compteSecureService.getSelectedAccount().compte;
    const idFichePersonnelle = compte.idFichePersonnelle;
    if (idFichePersonnelle) {
      const fichePersonnelle = this.fichePersonnelleService.find(idFichePersonnelle);
      return fichePersonnelle;
    }
    return { idCompte: compte.id };
  }

  async componentDidMount () {
    super.componentDidMount();
    const idFichePersonnelle = this.compteSecureService.getSelectedAccount().compte.idFichePersonnelle;
    if (idFichePersonnelle) {
      const fiche = await this.fichePersonnelleService.merge(idFichePersonnelle);
      if (fiche) {
        this.setState({
          value: fiche
        });
      }
    }
  }

  componentWillMount () {
    Actions.refresh({ key: 'drawer', open: false });
  }

  static compteSecureService = new CompteSecureService();
  static fichePersonnelleService = new FichePersonnelleService();
  static compteService = new CompteService();

  static hasMenu () {
    return true;
  }

  static shouldDelete () {
    return false;
  }

  static getTitle () {
    return I18n.t('identity.title')
  }

  static save (props, formValues) {
    if (formValues.id) {
      this.fichePersonnelleService.update(formValues);
    }
    else {
      const compte = _.clone(this.compteSecureService.getSelectedAccount().compte);
      const idFichePersonnelle = this.fichePersonnelleService.create(formValues);
      compte.idFichePersonnelle = idFichePersonnelle;
      this.compteService.update(compte);
    }

    Actions.pop({ refresh: {} });

  }

}
