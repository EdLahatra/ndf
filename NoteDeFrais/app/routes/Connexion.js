import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from 'react-native-google-signin';
import _ from 'underscore';
import { Actions } from 'react-native-router-flux';

import { Style, Colors } from '../styles/style';
import I18n from '../i18n/translations';
import { TYPES } from '../schemas/Compte';
import CompteService from '../services/CompteService';
import CompteSecureService from '../services/CompteSecureService';

import Logger from '../lib/Logger';
import ENV from '../config/environment';

const FBSDK = require('react-native-fbsdk');

const { LoginManager, GraphRequest, GraphRequestManager } = FBSDK;

/**
 * Page de connexion
 *
 * @module app/routes/Connexion.js
 * @override React.Component
 */
export default class Connexion extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {CompteService} */
    this.compteService = new CompteService();
  }

  /**
   * Méthode invoquée une fois que le DOM est chargée.
   */
  async componentDidMount() {
    GoogleAnalytics.trackScreenView('Connexion');
    const selectedAccount = this.compteSecureService.getSelectedAccount();

    if (this.props.shouldAddAccount) {
      Actions.refresh({ key: 'drawer', open: false });
    } else if (selectedAccount && this.compteSecureService.shouldSkipAuthentication()) {
      Actions.chargement();
    }
  }

  static _skip() {
    new CompteSecureService().create({});
    Actions.chargement();
  }

  /**
   * Méthode permettant de surcharger la NavBar
   * @param props
   * @returns React.Component
   */
  static renderNavigationBar() {
    return (<View style={[Style.navBar, Style.flexRowCenterEnd]}>

      <TouchableOpacity onPress={this._skip.bind(this)}>
        <View>
          <Text style={[Style.buttonTextSecondary]}>{I18n.t('authenticate.ignore')} </Text>
        </View>
      </TouchableOpacity>

    </View>);
  }

  /**
   * Méthode pour le login Facebook
   */
  loginWithFacebook() {
    const compteSecureService = this.compteSecureService;
    const compteService = this.compteService;

    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      (result) => {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          // eslint-disable-next-line
          const _responseInfoCallback = (error, result) => {
            if (error) {
              alert(`Error fetching data: ${error.toString()}`);
            } else {
              const compteSecureId = compteSecureService.create({});
              const compteSecure = compteSecureService.find(compteSecureId);

              compteService.createOrUpdateFichePersonnelle(compteSecure.compte, {
                nom: result.last_name,
                prenom: result.first_name,
                email: result.email
              });

              Actions.chargement();
            }
          };

          const parameters = { fields: { string: 'email,first_name,last_name' } };
          const infoRequest = new GraphRequest('/me', { parameters }, _responseInfoCallback);
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      (error) => {
        alert(`Login fail with error: ${error}`);
      }
    );
  }

  /**
   * Méthode pour le login Google
   */

  async loginWithGoogle() {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices({ autoResolve: true });
      if (hasPlayServices) {
        await GoogleSignin.configure(
          {
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            // iosClientId: '519286638345-kg3fd0pv8ou19qc0ridhecob7qb06d29.apps.googleusercontent.com',
            // webClientId: '519286638345-iqupvlcp25fhoi3cluivfm1r5psa1cpq.apps.googleusercontent.com',
            iosClientId: ENV.GoogleSignin.iosClientId,
            webClientId: ENV.GoogleSignin.webClientId,
            offlineAccess: true,
            hostedDomain: '',
            forceConsentPrompt: true,
            accountName: '',
          }
        );

        const usr = await GoogleSignin.currentUserAsync();

        if (usr === null || _.isEmpty(usr)) {
          GoogleSignin.signIn().then((user) => {
            const compteSecureId = this.compteSecureService.create({});
            const compteSecure = this.compteSecureService.find(compteSecureId);

            this.compteService.createOrUpdateFichePersonnelle(compteSecure.compte, {
              nom: user.name,
              email: user.email
            });

            Actions.chargement();
          }).catch((err) => {
            alert(`Login err: ${err}`);
            Logger.error(err);
          }).done();
        } else {
          const compteSecureId = this.compteSecureService.create({});
          const compteSecure = this.compteSecureService.find(compteSecureId);

          this.compteService.createOrUpdateFichePersonnelle(compteSecure.compte, {
            nom: usr.name,
            email: usr.email
          });
          alert(`Login success: ${usr}`);
          Actions.chargement();
        }
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  /**
   * Affiche le formulaire d'authentification spécifique
   * @param typeCompte
   */
  login(typeCompte) {
    Actions.login({ typeCompte });
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   * @returns React~Component
   */
  render() {
    return (
      <View style={Style.containerWithNavBar}>
        <View style={[Style.header, Colors.red.background()]}>
          <Text style={[Style.h1, Style.textCenter, Colors.white.color()]}>
            {I18n.t('authenticate.title')}
          </Text>
          <Text style={[Style.h3, Style.textCenter, Colors.white.color()]}>
            {I18n.t('authenticate.description')}
          </Text>
        </View>
        <View style={Style.content}>
          <View style={Style.row}>
            <View style={Style.columnCenter}>
              <Text style={[Style.textCenter, Colors.grey.color()]}>
                {I18n.t('authenticate.connectWith')}
              </Text>
              <TouchableOpacity onPress={this.login.bind(this, TYPES.COMPTACOM)}>
                <Image
                  style={{ width: 290, height: 60 }}
                  source={require('../images/comptacom-logo-login.png')}
                />
              </TouchableOpacity>
              <FontAwesome.Button
                name="facebook"
                style={[Colors.blueFacebook.background()]}
                onPress={this.loginWithFacebook.bind(this)}
              >
                {I18n.t('authenticate.connectWithFacebook')}
              </FontAwesome.Button>
              <FontAwesome.Button
                name="google-plus"
                style={[Colors.redGoogle.background()]}
                onPress={this.loginWithGoogle.bind(this)}
              >
                {I18n.t('authenticate.connectWithGoogle')}
              </FontAwesome.Button>
            </View>
          </View>
        </View>
      </View>);
  }
}

/*
 <TouchableOpacity onPress={this.login.bind(this, TYPES.GESCAB)}>
 <Image
 resizeMode="center"
 style={{ width: 300, height: 50 }}
 source={require('../images/gescab-logo.png')}/>
 </TouchableOpacity>
 */
