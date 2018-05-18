import React from 'react';
import { Text, TouchableOpacity, InteractionManager, Modal, Alert } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native-animatable';
import { Actions, } from 'react-native-router-flux';
import { Style, IconSize, Colors } from '../styles/style';
import I18n from '../i18n/translations';

import CompteSecureService from '../services/CompteSecureService';
import NoteDeFraisService from '../services/NoteDeFraisService';
import { STATUTS } from '../schemas/NoteDeFrais';

import NavBar from './NavBar';

const FILTRES = [
  'findAllDepenses',
  'findAllIndemnitesKilometriquesWithRegulation',
  'findAllAutresDepenses'
];

/**
 * NavBar spécifique à la liste des dépenses communes
 *
 * @module app/components/DepenseCommuneNavBar.js
 * @override {NavBar}
 */
export default class DepenseCommuneNavBar extends NavBar {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(props) {
    super(props);

    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {NoteDeFraisService} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {Object} */
    this.state = {
      filtre: FILTRES[0],
      showMenu: false,
    };
    this.validate = this.validate.bind(this);
  }

  _getChecked = filtre => this.state.filtre === filtre
    ? <MaterialIcons
      name="check"
      size={IconSize.small}
      style={Colors.yellowGreen.color()}
    /> : null;


  _renderMenu() {
    return FILTRES.map(filtre => (<TouchableOpacity
      key={filtre}
      onPress={() => {
        this.setState({ filtre });
        InteractionManager.runAfterInteractions(() => {
          this.setState({ showMenu: false });
          Actions.refresh({ filtre });
        });
      }}
      value={filtre}
      style={{ flex: 1, flexDirection: 'row' }}
    >
      <View style={{ flex: 1 }}>{this._getChecked(filtre)}</View>
      <Text style={{ fontSize: 18, margin: 2 }}>{I18n.t(`filters.${filtre}`)}</Text>
    </TouchableOpacity>));
  }

  _validateAfterConfirm() {
    try {
      const compteSecure = this.compteSecureService.getSelectedAccount();
      const noteDeFrais = this.noteDeFraisService.find(
        this.noteDeFraisService.findEnCours(compteSecure.compte));
      this.noteDeFraisService.validate(compteSecure.compte, noteDeFrais);

      const title = I18n.t('DepenseCommuneListe.afterValidate.title');
      const message = I18n.t('DepenseCommuneListe.afterValidate.message');

      Alert.alert(title, message, [{
        text: I18n.t('Alert.ok'),
        onPress: () => {
          Actions.chargement();
        }
      }]);
    } catch (e) {
      Alert.alert(I18n.t('Alert.warning'), e.message, [{ text: I18n.t('Alert.ok') }]);
    }
  }

  /**
   * Méthode de validation d'une note de frais.
   */
  validate() {
    const title = I18n.t('DepenseCommuneListe.confirm.title');
    let message = I18n.t('DepenseCommuneListe.confirm.validationSimple');
    if (this.compteSecureService.shouldUseApiService()) {
      message = I18n.t('DepenseCommuneListe.confirm.validation');
    }

    Alert.alert(title, message,
      [
        { text: I18n.t('Alert.ok'), onPress: this._validateAfterConfirm.bind(this) },
        { text: I18n.t('Alert.cancel'), style: 'cancel' }
      ]
    );
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render() {
    if (this.hasSelected()) {
      return this.renderWhenSelected();
    }

    const validateAction = this.props.noteDeFrais.statut === STATUTS.inProgress.key ?
      (<TouchableOpacity onPress={this.validate}>
        <MaterialIcons
          name="playlist-add-check"
          size={IconSize.medium}
          style={[Style.navBarIcon]}
        />
      </TouchableOpacity>) : null;

    const sum = I18n.toCurrency(
      this.props.noteDeFrais.totalDepenses + this.props.noteDeFrais.totalIndemnitesKilometriques);
    return (<View style={Style.navBar}>

      <TouchableOpacity onPress={() => Actions.refresh({
        key: 'drawer',
        open: value => !value,
        onCloseStart: () => Actions.refresh({ selected: {} })
      })}
      >
        <MaterialIcons name="menu" size={IconSize.medium} style={[Style.navBarIcon]} />
      </TouchableOpacity>

      <View style={[Style.flexRowCenter, Style.label]}>
        <Text style={[Style.labelText]}>{I18n.t(`state.${this.props.noteDeFrais.statut}`)}</Text>
      </View>

      <View style={[Style.flexRowCenterEnd, Style.label, Style.success]}>
        <Text style={[Style.labelText]}>{sum}</Text>
      </View>

      <TouchableOpacity onPress={() => {
        this.setState({ showMenu: !this.state.showMenu });
      }}
      >
        <MaterialIcons name="filter-list" size={IconSize.medium} style={[Style.navBarIcon]} />
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.showMenu}
          onRequestClose={() => {
            this.setState({ showMenu: !this.state.showMenu });
          }}
        >
          <View style={{
            backgroundColor: 'white',
            width: 220,
            position: 'absolute',
            right: 10,
            top: 20,
            flex: 1,
            margin: 10,
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.greyLighter.code
          }}
          >
            {this._renderMenu()}
          </View>
        </Modal>
      </TouchableOpacity>
      {validateAction}
    </View>);
  }
}
