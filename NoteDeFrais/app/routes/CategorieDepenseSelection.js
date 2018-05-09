

import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import Glyphicons from '../Glyphicons';
import { Style, IconSize, Colors } from '../styles/style';
import I18n from '../i18n/translations';
import CompteSecureService from '../services/CompteSecureService';
import CategorieDepenseService from '../services/CategorieDepenseService';

/**
 * Page de choix d'une catégorie pour l'ajout d'une dépense commune
 *
 * @module app/routes/CategorieDepenseSelection.js
 * @override React.Component
 */
export default class CategorieDepenseSelection extends Component {
  /**
     * Méthode permettant de surcharger la NavBar
     * @param props
     * @returns React.Component
     */
  static renderNavigationBar(props) {
    return (<View style={Style.navBar}>
      <TouchableOpacity onPress={() => Actions.pop({ refresh: { account: props.account } })}>
        <MaterialIcons name="arrow-back" size={IconSize.medium} style={Colors.white.color()} />
      </TouchableOpacity>
      <Text style={Style.navBarTitle}>{this.getTitle()}</Text>
    </View>);
  }

  /**
     * Méthode pour définir le titre de la NavBar
     * @returns {*}
     */
  static getTitle() {
    return I18n.t('categories.title');
  }

  /**
     * Initialisation de l'état du composant.
     * Initialisation de l'ensemble des services utiles pour le chargement des données.
     */
  constructor() {
    super();
    /** @type {CategorieDepenseService} */
    this.categorieDepenseService = new CategorieDepenseService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {Object} */
    this.state = {
      compteSecure: this.compteSecureService.getSelectedAccount(),
      categories: []
    };
  }

  /**
     * Méthode invoquée une fois que le DOM est chargée.
     */
  async componentDidMount() {
    GoogleAnalytics.trackScreenView('CategorieDepenseSelection');
    let categories = this.categorieDepenseService.findAllForAccount(
      this.state.compteSecure.compte.id
    );
    categories.unshift(this.categorieDepenseService.getIndemniteKilometriqueCategorie());
    this.setState({ categories });
    if (this.compteSecureService.shouldUseApiService()) {
      categories = await this.categorieDepenseService.mergeAll();
      if (categories) {
        categories.unshift(this.categorieDepenseService.getIndemniteKilometriqueCategorie());
        this.setState({ categories });
      }
    }
  }

  /**
     * Exécuté lors du touch d'une catégorie pour l'affichage du bon type de formulaire
     * @param category
     */
  add(category) {
    if (category.id) {
      Actions.depenseForm({ category });
    } else {
      Actions.indemniteKilometriqueForm({ category });
    }
  }

  /**
     * Retourne un composant icône touchable
     * @param element
     * @returns React~Component
     */
  renderTouchableOpacity(element) {
    return (
      <View
        key={element.id || 'indemnitesKilometrique'}
        style={[{ alignSelf: 'center', width: 170, height: 150, margin: 5 }]}
      >
        <TouchableOpacity onPress={this.add.bind(this, element)} style={{ flex: 1 }}>
          <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={[{ textAlign: 'center', width: 100 }]}>{element.icon}</Text>
            <Text style={[{ textAlign: 'center', width: 170, height: 100, margin: 3 }]}>
              {element.nom}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  /**
     * Méthode éxécuté lors du rendu du composant.
     * @returns React~Component
     */
  render() {
    const categories = this.state.categories;
    return (
      <View style={Style.containerWithNavBar}>
        <ScrollView ref="scrollView" keyboardDismissMode="none" showsVerticalScrollIndicator={true}>
          <View style={{
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'

          }}
          >
            {
              categories.map((category) => {
                if (category.depreciation === undefined) {
                  if (category.icone.indexOf('glyphicons') !== 0) {
                    category.icon =
                      <FontAwesome name={category.icone} size={IconSize.large} />;
                    return this.renderTouchableOpacity(category);
                  }
                  category.icon =
                    <Glyphicons name={category.icone} size={IconSize.large} />;
                  return this.renderTouchableOpacity(category);
                }
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
