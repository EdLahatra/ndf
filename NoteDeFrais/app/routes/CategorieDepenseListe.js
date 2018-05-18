import React from 'react';
import { Text, View } from 'react-native';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { Actions } from 'react-native-router-flux';

import Glyphicons from '../Glyphicons';
import { Style, IconSize, Colors } from '../styles/style';
import CompteSecureService from '../services/CompteSecureService';
import CategorieDepenseService from '../services/CategorieDepenseService';
import ListEdit from '../components/list-edit-with-menu';


/**
 * Page de la liste de dépenses
 *
 * @module app/routes/CategorieDepenseListe.js
 * @override app/components/ListEdit
 */
export default class CategorieDepenseListe extends ListEdit {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {CategorieDepenseService} */
    this.categorieDepenseService = new CategorieDepenseService();
  }

  /**
   * Méthode invoquée une fois que le DOM est chargée.
   */
  async componentDidMount() {
    super.componentDidMount();
    this.onRefresh();
    GoogleAnalytics.trackScreenView('CategorieDepenseListe');
  }

  /**
   * Méthode pour supprimer la liste des éléments sélectionnés lors d'un LongPress
   * @param selected
   */
  static deleteAll(selected) {
    new CategorieDepenseService().deleteAll(Object.keys(selected));
    Actions.refresh({ selected: {} });
  }

  /**
   * Méthode qui permet de vérifier la possibilité de supprimer une catégorie de dépense
   * @returns {*}
   */
  static shouldDelete = () => new CompteSecureService().shouldManageCategories();

  /**
   * Méthode qui permet de vérifier la possibilité d'ajouter une catégorie de dépense
   * @returns {*}
   */
  shouldAdd = () => this.compteSecureService.shouldManageCategories();

  /**
   * Méthode qui retoure la liste des éléments à afficher dans la liste
   * @returns {*}
   */
  getElements() {
    return this.categorieDepenseService.findAllForAccount(
      this.compteSecureService.getSelectedAccount().compte.id);
  }

  /**
   * Méthode pour rafraîchir les données
   */
  async onRefresh() {
    if (this.compteSecureService.shouldUseApiService()) {
      await this.categorieDepenseService.mergeAll();
    }
  }

  add() {
    Actions.categorieDepenseForm();
  }

  /**
   * Méthode éxécutée lors d'un LongPress
   * @param category
   * @param isSelected
   */
  onLongPress(category, isSelected = false) {
    if (this.compteSecureService.shouldManageCategories()) {
      super.onLongPress(category, isSelected);
    }
  }

  /**
   * Méthode exécutée lors du press sur une ligne de la liste
   * @param category
   * @param isSelected
   */
  onPress(category, isSelected = false) {
    if (this.compteSecureService.shouldManageCategories()) {
      if (super.onPress(category, isSelected) && isSelected === false) {
        Actions.categorieDepenseForm({ category });
      }
    }
  }

  _renderRowContent(element) {
    const hasSelected = this.props.selected && this.props.selected[element.id];

    const rowIcon = !hasSelected ? (<View style={Style.imageListPreview}>
      <Glyphicons
        name={element.icone}
        size={IconSize.small}
        style={[Colors.greyDarker.color()]}
      />
    </View>) : null;

    return (<View style={{ flex: 1, flexDirection: 'row' }}>

      {rowIcon}

      <View style={{ flex: 4 }}>
        <Text style={Style.h3}>{element.nom}</Text>

        <Text style={[Style.h4, Colors.greyDarker.color()]}>
          TVA: {element.tva} %
        </Text>
      </View >

    </View>);
  }
}
