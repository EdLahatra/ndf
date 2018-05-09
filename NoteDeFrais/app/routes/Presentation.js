import React, { Component, } from 'react';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Style, Colors } from '../styles/style';
import I18n from '../i18n/translations';
import ENV from '../config/environment';
import ConfigurationService from '../services/ConfigurationService';

/**
 * Page de présentation
 *
 * @module app/routes/Presentation.js
 * @override React~Component
 */
export default class Presentation extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super();
    /** @type {ConfigurationService} */
    this.configurationService = new ConfigurationService();
  }

  componentDidMount() {
    GoogleAnalytics.setTrackerId(ENV.Analytics.trackerId);
    GoogleAnalytics.trackScreenView('Presentation');
  }

  toComptaCom = () => Linking.openURL(ENV.config.urlSite);

  async componentWillMount() {
    if (this.configurationService.hasAcceptedTermsOfUse()) {
      Actions.connexion();
    }
  }

  toTermsOfUse = () => Linking.openURL(ENV.config.urlCGU);

  acceptTermsOfUse = () => {
    this.configurationService.acceptTermsOfUse();
    Actions.connexion();
  }

  render() {
    return (
      <View style={Style.container}>
        <Image source={require('../images/comptacom-logo.png')} />
        <View>
          <Text style={[Style.h1, Style.textCenter]}>{I18n.t('home.title')}</Text>
          <Text style={[Style.h1, Style.textCenter]}>{I18n.t('home.name')}</Text>
          <Text style={[Style.h3, Style.textCenter, Colors.grey.color()]}>
            <Text>{I18n.t('home.termsOfUse')} </Text>
            <Text style={Style.link} onPress={this.toTermsOfUse}>
              {I18n.t('home.termsOfUseLink')}.
            </Text>
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={this.acceptTermsOfUse}>
            <View style={Style.button}>
              <Text style={Style.buttonText}>{I18n.t('home.termsOfUseButton')} </Text>
            </View>
          </TouchableOpacity>
          <Text style={[Style.h4, Style.textCenter, Colors.grey.color()]}>
            <Text>{I18n.t('home.about')} </Text>
            <Text style={Style.link} onPress={this.toComptaCom}>
              {I18n.t('home.aboutLink')}.
            </Text>
          </Text>
        </View>
      </View>
    );
  }
}
