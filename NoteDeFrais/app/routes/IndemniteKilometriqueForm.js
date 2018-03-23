'use strict';

import React, { Component, } from 'react';

import { Alert, } from 'react-native';
import _ from 'underscore';
import { Actions, } from 'react-native-router-flux';

import I18n from '../i18n/translations';

import CompteSecureService from '../services/CompteSecureService';
import VehiculeService from '../services/VehiculeService';
import CompteService from '../services/CompteService';
import IndemniteKilometriqueService from '../services/IndemniteKilometriqueService';
import FichePersonnelleService from '../services/FichePersonnelleService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import RealmForm from '../components/realm-form';
import IndemniteKilometrique from '../schemas/IndemniteKilometrique';
import Distance from '../components/distance';
import AxeAnalytiqueService from '../services/AxeAnalytiqueService';
import ValeurAnalytiqueService from '../services/ValeurAnalytiqueService';

/**
 * Page du formulaire d'indemnité kilométrique
 *
 * @module app/routes/IndemniteKilometriqueForm.js
 * @override app/components/RealmForm
 */
export default class IndemniteKilometriqueForm extends RealmForm {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {CompteService} */
    this.compteService = new CompteService();
    /** @type {CompteSecureService} */
    this.IndemniteKilometriqueService = new IndemniteKilometriqueService();
    /** @type {VehiculeService} */
    this.vehiculeService = new VehiculeService();
    /** @type {FichePersonnelleService} */
    this.fichePersonnelleService = new FichePersonnelleService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {AxeAnalytiqueService} */
    this.axeAnalytiqueService = new AxeAnalytiqueService();
    /** @type {ValeurAnalytiqueService} */
    this.valeurAnalytiqueService = new ValeurAnalytiqueService();
  }

  getStateValue (props) {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    const compte = selectedAccount.compte;

    let indemniteKilometrique = _.clone(this.props.depenseCommune) || {};

    const vehicules = this.vehiculeService.findAllForAccount(compte.id);
    let favori;
    if (vehicules.length === 1) {
      favori = vehicules[0];
    }
    else {
      favori = vehicules.find((vehicule) => vehicule.favori === true);
    }

    if (favori) {
      indemniteKilometrique.idVehicule = favori.id;
    }

    if (vehicules === null || vehicules.length === 0) {

      Alert.alert(I18n.t('Alert.warning'), I18n.t('Alert.shouldAddVehicule'),
          [

            { text: I18n.t('Alert.cancel'), style: 'cancel' },
            { text: I18n.t('Alert.ok'), onPress: () => Actions.vehiculeForm({ account: compte }) }
          ]
      )

    }

    if (indemniteKilometrique.valeursAnalytiques) {
      indemniteKilometrique.valeursAnalytiques = _.toArray(indemniteKilometrique.valeursAnalytiques)
                                                  .map((valeur)=> this.valeurAnalytiqueService.find(valeur.id));
    }

    return indemniteKilometrique;
  }

  _onCallApi (inputId, apiId, param) {
    super._onCallApi(inputId, apiId, param);
    if (apiId === 'places') {
      Actions.placeAutocomplete({ input: inputId });
    }
    else if (apiId === 'distance-matrix') {

      const originFieldId = '_depart';
      const destinationFieldId = 'lieu';
      const origins = this.state.value[originFieldId];
      const destinations = this.state.value[destinationFieldId];

      if (origins && destinations) {
        Distance.compute(origins, destinations).then((distance)=> {
          const data = param && typeof param === 'function' ? param(distance) : distance;
          Actions.refresh({ distance: { data, input: inputId } });
        }).catch(()=> {

          Alert.alert(I18n.t('Alert.warning'), I18n.t('Alert.notFoundPlaces'),
              [
                {
                  text: I18n.t('Alert.changeOrigins', { origins }),
                  onPress: () => this._onCallApi(originFieldId, 'places')
                },
                {
                  text: I18n.t('Alert.changeDestinations', { destinations }),
                  onPress: () => this._onCallApi(destinationFieldId, 'places')
                },
                { text: I18n.t('Alert.cancel'), style: 'cancel' }

              ])

        });
      }
      else if (!!origins === false) {
        Alert.alert(I18n.t('Alert.warning'), I18n.t('Alert.addOriginPlace'),
            [
              {
                text: I18n.t('Alert.useGooglePlaceApi'), onPress: () => this._onCallApi(originFieldId, 'places')
              },
              {
                text: I18n.t('Alert.cancel'),
                onPress: () => this.refs.form.getComponent(originFieldId).refs.input.focus(),
                style: 'cancel'
              }
            ]
        )
      }
      else if (!!destinations === false) {
        Alert.alert(I18n.t('Alert.warning'), I18n.t('Alert.addDestinationPlace'),
            [
              { text: I18n.t('Alert.useGooglePlaceApi'), onPress: () => this._onCallApi(destinationFieldId, 'places') },
              {
                text: I18n.t('Alert.cancel'),
                onPress: () => this.refs.form.getComponent(destinationFieldId).refs.input.focus(),
                style: 'cancel'
              }
            ]
        )

      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.addCar) {
      const selectedAccount = this.compteSecureService.getSelectedAccount();
      const vehicules = this.vehiculeService.findAllForAccount(selectedAccount.compte.id);
      this.state.value.idVehicule = vehicules[0].id;
    }
    super.componentWillReceiveProps(nextProps);
  }

  getConfig () {

    const selectedAccount = this.compteSecureService.getSelectedAccount();

    const vehicules = this.vehiculeService.findAllForAccount(selectedAccount.compte.id);
    const vehiculesOptions = vehicules.map((vehicule) => {
      return { value: vehicule.id, text: vehicule.nom }
    });

    if (this.compteSecureService.shouldUseApiService()) {
      const axesAnalytiques = this.axeAnalytiqueService.findAllForAccount(selectedAccount.compte.id);
      this.setState({ axesAnalytiques });
      return {
        schema: IndemniteKilometrique.schema,
        axesAnalytiques,
        idVehicule: vehiculesOptions,
        formType: 'secure'
      };
    }
    else {
      return {
        schema: IndemniteKilometrique.schema,
        idVehicule: vehiculesOptions,
        formType: 'autonome'
      };
    }

  }

  static getTitle (props) {
    return props.category.nom;
  }

  static compteSecureService = new CompteSecureService();
  static indemniteKilometriqueService = new IndemniteKilometriqueService();
  static noteDeFraisService = new NoteDeFraisService();

  static shouldDelete (props) {
    if (props.depenseCommune) {
      return true;
    }
    return false;
  }

  static delete (depenseCommune, props) {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    const ndf = this.noteDeFraisService.find(this.noteDeFraisService.findEnCours(selectedAccount.compte));
    this.indemniteKilometriqueService.delete(depenseCommune, ndf);
    this.noteDeFraisService.updateTotal(ndf);
    const noteDeFrais = this.noteDeFraisService.find(ndf.id);
    Actions.pop({ refresh: { noteDeFrais } });
  }

  static save (props, formValues) {
    const selectedAccount = this.compteSecureService.getSelectedAccount();

    const ndf = this.noteDeFraisService.find(this.noteDeFraisService.findEnCours(selectedAccount.compte));

    formValues.valeursAnalytiques = _.filter(formValues.valeursAnalytiques, (valeur) => valeur.id)
                                     .map((valeur) => {
                                       return { id: valeur.id }
                                     });
    if (formValues.id) {
      this.indemniteKilometriqueService.update(formValues, ndf);
      this.noteDeFraisService.updateTotal(ndf);
      const noteDeFrais = this.noteDeFraisService.find(ndf.id);
      Actions.pop({ refresh: { noteDeFrais } });
    }
    else {
      this.indemniteKilometriqueService.create(formValues, ndf);
      this.noteDeFraisService.updateTotal(ndf);
      const noteDeFrais = this.noteDeFraisService.find(ndf.id);
      Actions.pop({ popNum: 2, refresh: { noteDeFrais } });
    }

  }

}
