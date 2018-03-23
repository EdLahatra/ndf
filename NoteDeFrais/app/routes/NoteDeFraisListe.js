'use strict';

import React, {
    Component,
} from 'react';

import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import { Actions, } from 'react-native-router-flux';
import { Style, IconSize, Colors } from '../styles/style';
import I18n from '../i18n/translations';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CompteSecureService from '../services/CompteSecureService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import ListEdit from '../components/list-edit-with-menu';

import moment from 'moment';
import _ from 'underscore';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

/**
 * Page de la liste de notes de frais
 *
 * @module app/routes/NoteDeFraisListe.js
 * @override app/components/ListEdit
 */
export default class NoteDeFraisListe extends ListEdit {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
  }

  /**
   * Méthode pour empêcher la suppression
   * @returns {boolean} false
   */
  static shouldDelete () {
    return false;
  }

  static renderNavigationBar (props) {

    return <View style={Style.navBar}>

      <TouchableOpacity onPress={()=> Actions.refresh({
        key: 'drawer',
        open: value => !value,
        onCloseStart: ()=> Actions.refresh({ selected: {} })
      })}>
        <MaterialIcons name="menu" size={IconSize.medium} style={[Style.navBarIcon]}/>
      </TouchableOpacity>

      <Text style={[Style.navBarTitle, { flex: 1 }]}>{I18n.t('NoteDeFrais.history')}</Text>

    </View>
  }

  _renderRow (element, section, id) {
    const isSelected = this._isSelectedElement(element);
    return (
        <TouchableOpacity onPress={this.onPress.bind(this, element, isSelected)}
                          onLongPress={this.onLongPress.bind(this, element, isSelected)}>
          <View style={[Style.row, Style.rowListView, { height: 85 }]}>
            {this._renderRowContent(element)}
          </View>
        </TouchableOpacity>
    );
  }

  shouldAdd () {
    return false;
  }

  getElements () {
    return this.noteDeFraisService.findAllForAccountAndStatus(this.compteSecureService.getSelectedAccount().compte.id, this.props.statut);
  }

  async onRefresh () {
    if (this.compteSecureService.shouldUseApiService()) {
      await this.noteDeFraisService.mergeAll();
    }
  }

  async componentDidMount () {
    GoogleAnalytics.trackScreenView('NoteDeFraisListe');
    super.componentDidMount();
    this.onRefresh();
  }

  onPress (noteDeFrais, isSelected = false) {
    Actions.depenseCommuneHistoriqueListe({ noteDeFrais });
  }

  _formatDate (date) {
    return moment(date).format('DD/MM/YYYY');
  }

  _renderRowContent (element) {

    const depenseCommuneList = this.noteDeFraisService.findAllDepenses(element);
    const firstDate = this.noteDeFraisService.getFirstDepenseCommuneDate(depenseCommuneList);
    const lastDate = this.noteDeFraisService.getLastDepenseCommuneDate(depenseCommuneList);

    return (<View style={[{ flex: 1, flexDirection: 'row' }]}>

      <View style={{ flex: 4 }}>
        <Text style={Style.h3}>
          {this._formatDate(element.dateEnvoi)}
        </Text>

        <Text style={[Style.h4, Colors.greyDarker.color()]}>
          {I18n.t('NoteDeFrais.fees', { count: _.toArray(element.depenses).length })}
          - {element.totalDistance} {I18n.t('distanceUnit')}
        </Text>

        <Text style={[Style.h4, Colors.greyDarker.color()]}>
          {I18n.t('NoteDeFrais.period', { first: this._formatDate(firstDate), last: this._formatDate(lastDate) })}
        </Text>

      </View >

      <Text style={[Style.h3]}>
        {Math.round((element.totalDepenses + element.totalIndemnitesKilometriques) * 100) / 100} {I18n.t('devise')}
      </Text>

    </View>);

  }

}
