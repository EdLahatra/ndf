'use strict';

import React, { Component, } from 'react';

import { Text, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native-animatable';
import { Actions, } from 'react-native-router-flux';
import { Style, IconSize, Colors } from '../styles/style';

import CategorieDepenseService from '../services/CategorieDepenseService';
import CompteSecureService from '../services/CompteSecureService';
import DepenseService from '../services/DepenseService';
import IndemniteKilometriqueService from '../services/IndemniteKilometriqueService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import VehiculeService from '../services/VehiculeService';

/**
 * NavBar spécifique à l'application
 *
 * @module app/components/NavBar.js
 * @override React~Component
 */
export default class NavBar extends Component {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();
    /** @type {CategorieDepenseService} */
    this.categorieDepenseService = new CategorieDepenseService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {DepenseService} */
    this.depenseService = new DepenseService();
    /** @type {IndemniteKilometriqueService} */
    this.indemniteKilometriqueService = new IndemniteKilometriqueService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {VehiculeService} */
    this.vehiculeService = new VehiculeService();
  }

  /**
   * Méthode qui retourne le fait de pouvoir supprimer
   * @param props
   * @returns {boolean} true
   */
  shouldDelete (props) {
    return true;
  }

  /**
   * Méthode qui supprime l'ensemble des éléments sélectionnés
   * @param selected
   */
  deleteAll (selected) {
    const ndf = this.props.noteDeFrais;
    const all = Object.keys(selected);

    if (ndf) {
      this.depenseService.deleteAll(all, ndf);
      this.indemniteKilometriqueService.deleteAll(all, ndf);
      this.noteDeFraisService.updateTotal(ndf);
    }

    this.vehiculeService.deleteAll(all);
    this.categorieDepenseService.deleteAll(all);

    Actions.refresh({ selected: {} });
  }

  /**
   * Retour le titre de la NavBar
   * @returns {*}
   */
  getTitle () {
    return this.props.title;
  }

  /**
   * Affirme la présence d'un menu
   * @returns {boolean}
   */
  hasMenu () {
    return true;
  }

  /**
   * Affirme si des éléments sont sélectionnés
   * @returns {boolean}
   */
  hasSelected () {
    return this.props.selected && Object.values(this.props.selected).filter((value)=> value === true).length > 0;
  }

  /**
   * Rendu graphique lorsque des éléments sont sélectionés
   * @returns React~Component
   */
  renderWhenSelected () {

    const hasSelected = this.hasSelected();

    const deleteIcon = this.shouldDelete(this.props) && hasSelected ?
        <TouchableOpacity onPress={this.deleteAll.bind(this, this.props.selected)}>
          <MaterialIcons name="delete" size={IconSize.medium} style={Style.navBarIcon}/>
        </TouchableOpacity> : null;

    const menuAction = this.hasMenu() ?
        <TouchableOpacity onPress={()=> Actions.refresh({
          key: 'drawer',
          open: value => !value,
          onCloseStart: ()=> Actions.refresh({ selected: {} })
        })}>
          <MaterialIcons name="menu" size={IconSize.medium} style={[Style.navBarIcon]}/>
        </TouchableOpacity>
        : <TouchableOpacity onPress={()=> {
      if (hasSelected) {
        Actions.refresh({ selected: {} })
      }
      else {
        Actions.pop();
      }
    }}>
      <MaterialIcons name="arrow-back" size={IconSize.medium} style={Colors.white.color()}/>
    </TouchableOpacity>;

    const title = hasSelected ? Object.keys(this.props.selected).length : this.getTitle();

    const backgroundColor = hasSelected ? Colors.greyDarker.background() : null;

    return <View style={[Style.navBar, backgroundColor]}>

      {menuAction}

      <Text style={[Style.navBarTitle, { flex: 1 }]}>{title}</Text>

      {deleteIcon}
    </View>
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @return react~Component
   */
  render () {

    if (this.hasSelected()) {
      return this.renderWhenSelected();
    }

    return <View style={Style.navBar}>

      <TouchableOpacity onPress={()=> Actions.refresh({
        key: 'drawer',
        open: value => !value,
        onCloseStart: ()=> Actions.refresh({ selected: {} })
      })}>
        <MaterialIcons name="menu" size={IconSize.medium} style={[Style.navBarIcon]}/>
      </TouchableOpacity>

      <View style={[Style.flexRowCenter, Style.label]}>
        <Text style={[Style.labelText]}>{this.getTitle()}</Text>
      </View>


    </View>
  }

}