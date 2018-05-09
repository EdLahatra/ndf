import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Actions, } from 'react-native-router-flux';
import _ from 'underscore';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import { Style, IconSize, Colors } from '../styles/style';
import I18n from '../i18n/translations';
import ListEdit from '../components/list-edit-with-menu';
import VehiculeService from '../services/VehiculeService';
import CompteSecureService from '../services/CompteSecureService';


/**
 * Page de la liste des véhicules
 *
 * @module app/routes/VehiculeListe.js
 * @override app/components/ListEdit
 */
export default class VehiculeListe extends ListEdit {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(props) {
    super(props);
    /** @type {VehiculeService} */
    this.vehiculeService = new VehiculeService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
  }

  static vehiculeService = new VehiculeService();

  static deleteAll(selected) {
    this.vehiculeService.deleteAll(Object.keys(selected));
    Actions.refresh({ selected: {} });
  }

  getElements() {
    return this.vehiculeService.findAllForAccount(
      this.compteSecureService.getSelectedAccount().compte.id);
  }

  async componentDidMount() {
    GoogleAnalytics.trackScreenView('VehiculeListe');
    super.componentDidMount();
    this.onRefresh();
  }

  async onRefresh() {
    if (this.compteSecureService.shouldUseApiService()) {
      await this.vehiculeService.mergeAll();
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  add() {
    Actions.vehiculeForm({ account: this.compteSecureService.getSelectedAccount().compte });
  }

  onPress(car, isSelected = false) {
    if (super.onPress(car, isSelected) && isSelected === false) {
      Actions.vehiculeForm({ account: this.compteSecureService.getSelectedAccount().compte, car });
    }
  }

  onPressIcon(element) {
    const car = _.clone(element);
    car.favori = !element.favori;
    this.vehiculeService.update(car);
    Actions.refresh();
  }

  _renderRowContent(element) {
    const hasSelected = this.props.selected && this.props.selected[element.id];
    let starButton = null;
    if (!hasSelected) {
      const starIcon = element.favori ? 'star' : 'star-border';
      const starColor = element.favori ? Colors.gold : Colors.greyDarker;
      starButton = (
        <TouchableOpacity
          style={Style.imageListPreview}
          onPress={this.onPressIcon.bind(this, element)}
        >
          <MaterialIcons name={starIcon} size={IconSize.medium} style={starColor.color()} />
        </TouchableOpacity>);
    }

    return (<View style={{ flex: 1, flexDirection: 'row' }}>

      {starButton}

      <View style={{ flex: 4 }}>

        <Text style={Style.h3}>{element.nom}</Text>

        <Text style={[Style.h4, Colors.greyDarker.color()]}>
          {I18n.t(`Vehicule.${element.typeVehicule}`)} | {element.immatriculation}
        </Text>
      </View >

      <Text style={[Style.h4, Colors.greyDarker.color(), { flex: 1 }]}>
        {element.puissanceFiscale} CV
      </Text>

    </View>);
  }
}
