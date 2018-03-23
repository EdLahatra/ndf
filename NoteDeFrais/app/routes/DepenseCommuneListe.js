'use strict';

import React, { Component, } from 'react';
import { Text, TouchableOpacity, InteractionManager, NetInfo, Alert, Animated } from 'react-native';
import { View } from 'react-native-animatable';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Glyphicons from '../Glyphicons';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import moment from 'moment';

import { Actions, } from 'react-native-router-flux';
import { Style, IconSize, Colors } from '../styles/style';
import I18n from '../i18n/translations';

import ListEdit from '../components/list-edit-with-menu';

import CategorieDepenseService from '../services/CategorieDepenseService';
import CompteSecureService from '../services/CompteSecureService';
import DepenseService from '../services/DepenseService';
import IndemniteKilometriqueService from '../services/IndemniteKilometriqueService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import CompteService from '../services/CompteService';
import JustificatifService from '../services/JustificatifService';
import Logger from '../lib/Logger';

/**
 * Page de la liste de dépenses
 *
 * @module app/routes/DepenseCommuneListe.js
 * @override app/components/ListEdit
 */
export default class DepenseCommuneListe extends ListEdit {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();
    /** @type {CategorieDepenseService} */
    this.categorieDepenseService = new CategorieDepenseService();
    /** @type {DepenseService} */
    this.depenseService = new DepenseService();
    /** @type {IndemniteKilometriqueService} */
    this.indemniteKilometriqueService = new IndemniteKilometriqueService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {JustificatifService} */
    this.justificatifService = new JustificatifService();

    /** @type {CompteService} */
    this.compteService = new CompteService();
    this.syncIteration = 0;
    NetInfo.addEventListener('connectionChange', this._networkListener.bind(this));
  }

  async _networkListener (reach) {
    if (this.compteSecureService.shouldUseApiService()) {
      if ((reach === 'wifi' || reach === 'cell') && this.handleError) {
        await this.onRefresh();
      }
    }
  }

  /**
   * Méthode qui retourne la liste des note de frais
   * @param props
   * @returns {array}
   */
  getElements (props) {
    const noteDeFrais = props.noteDeFrais;
    if (noteDeFrais && noteDeFrais.isValid()) {
      if (props.filtre) {
        return this.noteDeFraisService[props.filtre](noteDeFrais);
      }
      return this.noteDeFraisService.findAllDepenses(noteDeFrais);
    }
    return []
  }

  /**
   * Méthode invoquée une fois que le DOM est chargé.
   */
  async componentDidMount () {
    super.componentDidMount();
    if (this.compteSecureService.shouldUseApiService()) {
      this._scheduleSync();
    }
    GoogleAnalytics.trackScreenView('DepenseCommuneListe');
  }

  async onRefresh () {
    if (this.compteSecureService.shouldUseApiService()) {
      try {
        this.handleError = false;
        return await Promise.all([
          this.compteService.mergeAll(),
          this.noteDeFraisService.mergeAll(),
          this.depenseService.mergeAll(),
          this.indemniteKilometriqueService.mergeAll(),
          this.justificatifService.mergeAll()
        ]);
      } catch (e) {
        this.handleError = true;
      } finally {
        const compteSecure = this.compteSecureService.getSelectedAccount();
        const noteDeFrais = this.noteDeFraisService.find(this.noteDeFraisService.findEnCours(compteSecure.compte));
        Actions.refresh({ noteDeFrais });
      }
    }
    return Promise.resolve(true);

  }

  add () {
    Actions.categorieDepenseSelection();
  }

  onPress (depenseCommune, isSelected = false) {
    if (super.onPress(depenseCommune, isSelected)) {
      if (isSelected === false) {
        const category = this.getCategorieDepense(depenseCommune);
        if (category.id) {
          Actions.depenseForm({ depenseCommune, category });
        }
        else {
          Actions.indemniteKilometriqueForm({ depenseCommune, category });
        }
      }
    }
  }

  /**
   * Retourne la catégorie en fonction de son identifiant
   * @param idCategorieDepense
   * @returns {CategorieDepense}
   */
  getCategorieDepense ({ idCategorieDepense }) {
    return this.categorieDepenseService.find(idCategorieDepense) || this.categorieDepenseService.getIndemniteKilometriqueCategorie();
  }

  async _sync () {
    if (this.syncIteration < 2) {
      Actions.refresh();
    }
    else {
      await this.onRefresh();
    }

    this.syncIteration++;
  }

  _scheduleSync () {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = null;
    }

    if (this.syncIteration < 3) {
      this.handle = setTimeout(() => {
        requestAnimationFrame(this._sync.bind(this));
      }, 2000);
    }
  }

  _renderRowContent (depense) {
    const categorieDepense = this.getCategorieDepense(depense);

    const isSelected = this.props.selected && this.props.selected[depense.id];

    let icon = null;

    if (depense._isSynchronized === false) {

      if (this.handleError) {
        icon =
            <View animation="pulse" style={Style.imageListPreview}>
              <MaterialIcons
                  name="sync-problem"
                  size={IconSize.small}
                  style={[Colors.orange.color()]}/>
            </View>;
      }
      else {
        icon =
            <View animation="rotate" direction="reverse"
                  iterationCount={15}
                  duration={600} style={Style.imageListPreview}
                  onAnimationEnd={() => {
                    if (this.syncIteration > 2) {
                      this.onRefresh();
                    }
                  }}>
              <MaterialIcons
                  name="sync"
                  size={IconSize.small}
                  style={[Colors.yellowGreen.color(), {paddingBottom: -15, paddingLeft: 5}]}/>
            </View>;
        this._scheduleSync();
      }
    }
    else if (!isSelected) {
      icon = <View style={Style.imageListPreview}>
        <Glyphicons
            name={ categorieDepense.icone }
            size={IconSize.small}
            style={[Colors.greyDarker.color(),{marginLeft: 5, marginBottom: 6}]}/>
      </View>
    }

    return (
        <View style={[{ flex: 1, flexDirection: 'row' }]}>

          {icon}

          <View style={{ flex: 4 }}>
            <Text style={Style.h3}>
              {depense.description || depense.lieu}
            </Text>

            <Text style={[Style.h4, Colors.greyDarker.color()]}>
              {moment(depense.date).format('DD/MM')} - {categorieDepense.nom}
            </Text>

          </View>

          <Text style={[Style.h4, Colors.greyDarker.color()]}>
            {I18n.toCurrency(depense.montantARembourser)}
          </Text>

        </View>
    );
  }

}
