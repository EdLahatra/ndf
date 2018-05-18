import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity, Linking, Alert, ScrollView, InteractionManager
} from 'react-native';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import OauthServiceFactory from '../services/OauthService';
import CompteSecureService from '../services/CompteSecureService';
import CompteService from '../services/CompteService';
import CompteSecure from '../schemas/CompteSecure';
import { TYPES } from '../schemas/Compte';
import FormStyle from '../styles/formStyle';
import I18n from '../i18n/translations';
import TextboxFieldFactory from '../components/textbox-field-factory';

import { Style } from '../styles/style';
import NoteDeFraisService from '../services/NoteDeFraisService';

import ENV from '../config/environment';

const t = require('tcomb-form-native');

const Form = t.form.Form;

/**
 * Page du formulaire de Login
 *
 * @module app/routes/Login.js
 * @override React~Component
 */
export default class Login extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(props) {
    super(props);
    /** @type {NoteDeFrais} */
    this.noteDeFraisService = new NoteDeFraisService();
    /** @type {CompteService} */
    this.compteService = new CompteService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();

    /** @type {Object} */
    this.state = {
      loading: false,
      form: t.struct({
        username: t.String,
        password: t.String
      }),
      options: {
        auto: 'placeholders',
        i18n: {
          optional: '',
          required: ''
        },
        stylesheet: FormStyle,
        fields: {
          username: {
            autoCorrect: false,
            autoCapitalize: 'none',
            placeholder: I18n.t('CompteSecure.placeholder.username'),
            factory: TextboxFieldFactory,
            onSubmitEditing: this._focusNextInput.bind(this, 'username')
          },
          password: {
            secureTextEntry: true,
            autoCorrect: false,
            factory: TextboxFieldFactory,
            placeholder: I18n.t('CompteSecure.placeholder.password')
          }
        }
      },
    };
  }

  onChange(value) {
    this.setState({ value });
  }

  getConfig() {
    return { schema: CompteSecure.schema };
  }

  _onImageClick() {
    Linking.openURL(ENV.config.urlSite);
  }

  _focusNextInput(inputId) {
    const fields = Object.keys(this.state.options.fields);
    const currentInput = fields.indexOf(inputId);
    if (currentInput !== -1 && fields.length >= currentInput + 1) {
      const nextInpuId = fields[currentInput + 1];
      if (nextInpuId) {
        if (this.state.options.fields[nextInpuId].editable === false) {
          return this._focusNextInput(nextInpuId);
        }
        const nextInput = this.refs.form.getComponent(nextInpuId);
        if (nextInput) {
          if (nextInput.refs.input) {
            nextInput.refs.input.focus();
          }
        }
      }
    }
  }

  _getInput(index = 0) {
    if (this.state && this.state.options.fields) {
      const fields = Object.keys(this.state.options.fields);
      const fieldId = fields[index];
      if (fieldId) {
        const input = this.refs.form.getComponent(fieldId);
        if (input && input.refs) {
          if (input.refs.input && input.refs.input.props.editable !== false) {
            return input;
          }
        }
        return this._getInput(index + 1);
      }
    }
    return null;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      GoogleAnalytics.trackScreenView('Page de Login');
      this._getInput().refs.input.focus && this._getInput().refs.input.focus();
    });
  }

  render() {
    let logo = null;

    if (this.props.typeCompte === TYPES.COMPTACOM) {
      logo = (<Image
        style={{ alignSelf: 'center' }}
        source={require('../images/comptacom-logo-login.png')}
      />);
    } else {
      logo = (<Image
        resizeMode="center"
        style={{ alignSelf: 'center', width: 300, height: 50 }}
        source={require('../images/gescab-logo.png')}
      />);
    }

    return (<View style={{ margin: 20 }}>

      <ScrollView
        ref="scrollView"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
      >
        <Form
          ref="form"
          type={this.state.form}
          options={this.state.options}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
      </ScrollView>

      <TouchableOpacity onPress={this.next.bind(this)}>
        <View style={Style.button}>
          <Text style={Style.buttonText}>{I18n.t('login.next')}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={this._onImageClick.bind(this)}>{logo}</TouchableOpacity>
      <Spinner visible={this.state.loading} />
    </View>);
  }

  async next() {
    const validate = this.refs.form.validate();

    let compteSecureId = null;

    if (validate.errors.length > 0) {
      // eslint-disable-next-line
      console.log(validate.errors);
    } else {
      try {
        this.setState({ loading: true });

        const values = this.refs.form.getValue();

        const oauthService = OauthServiceFactory(this.props.typeCompte);
        compteSecureId = await oauthService.authenticate(values);

        const comptes = await this.compteService.mergeAll();
        await this.noteDeFraisService.mergeAll();

        this.compteSecureService.attachCompte(compteSecureId, comptes[0]);

        this.setState({
          value: { loading: false }
        });

        Actions.chargement();
      } catch (e) {
        if (compteSecureId) {
          const compteSecure = this.compteSecureService.find(compteSecureId);
          this.compteSecureService.delete(compteSecure);
        }
        // eslint-disable-next-line
        if (e.message == 'Network request failed') {
          // eslint-disable-next-line
          console.log(I18n.t('Alert.network'));
          Alert.alert(I18n.t('Alert.warning'), I18n.t('Alert.network'), [{
            text: I18n.t('Alert.ok'),
            onPress: () => {
              this.setState({ loading: false });
            }
          }]);
        } else {
          // eslint-disable-next-line
          console.log(`Code d'erreur : ${e.message}`);
          Alert.alert(I18n.t('Alert.warning'), e.message, [{
            text: I18n.t('Alert.ok'),
            onPress: () => {
              this.setState({ loading: false });
            }
          }]);
        }
      }
    }
  }

  static getTitle = () => I18n.t('login.title');
}
