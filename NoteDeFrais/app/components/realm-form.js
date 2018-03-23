'use strict';

import React, {
  Component,
} from 'react';

import {
  Alert,
  Platform,
  Text,
  TextInput,
  View,
  ScrollView,
  findNodeHandle,
  TouchableOpacity,
  InteractionManager
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Style, IconSize } from '../styles/style';
import FormStyle from '../styles/formStyle';
import { Actions, } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import PlatformHelper from '../lib/platform-helper';

import utils from '../lib/utils'

const t = require('tcomb-form-native');
const Form = t.form.Form;

import _ from 'underscore';

let currentForm;

/**
 * Composant permetant d'automatiser la création de formulaire basée sur les modèles de données realm.
 * @module app/components/RealmForm.js
 * @override React.Component
 */
export default class RealmForm extends Component {

  _initForm (value) {
    const fields = utils.toFieldsOptions(this.getConfig(), this.getActions());

    this.setState({
      value: value,
      options: {
        auto: 'placeholders',
        i18n: {
          optional: '',
          required: '',
          add: 'Add',   // add button
          remove: '✘',  // remove button
          up: '↑',      // move up button
          down: '↓'     // move down button
        },
        stylesheet: FormStyle,
        fields
      },
      form: utils.toForm(this.getConfig())
    });

  }

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor (props) {
    super(props);
    this.state = {
      value: null,
      options: {
        auto: 'placeholders',
        i18n: {
          optional: '',
          required: '',
          add: 'Add',   // add button
          remove: '✘',  // remove button
          up: '↑',      // move up button
          down: '↓'     // move down button
        },
        stylesheet: FormStyle,
        fields: null
      },
      form: null
    };
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      GoogleAnalytics.trackScreenView(`Formulaire ${this.getConfig().schema.name}`);
      this._initForm(this.getStateValue());
      currentForm = this.refs.form;
      this._getInput().refs.input.focus && this._getInput().refs.input.focus();
    });
  }

  componentWillReceiveProps (props) {
    this._initForm(this.state.value);
    if (props.place && props.place.data.description !== this.state.value[props.place.input]) {
      const value = _.clone(this.state.value);
      value[props.place.input] = props.place.data.description;
      this.setState({ value });
    }

    else if (props.distance && props.distance.data !== this.state.value[props.distance.input]) {
      const value = _.clone(this.state.value);
      value[props.distance.input] = props.distance.data;
      this.setState({ value });
    }
    else if (props.valeurAnalytique) {
      const value = _.clone(this.state.value);
      const valeursAnalytiques = _.toArray(value.valeursAnalytiques);
      const index = _.findLastIndex(valeursAnalytiques, { idAxeAnalytique: props.valeurAnalytique.idAxeAnalytique });
      if (index > -1) {
        valeursAnalytiques[index] = props.valeurAnalytique;
      }
      else {
        valeursAnalytiques.push(props.valeurAnalytique);
      }

      value.valeursAnalytiques = valeursAnalytiques;
      this.setState({ value });
    }

  }

  getConfig () {
  }

  /**
   * Méthode qui retourne la valeur de l'état du formulaire
   * @returns {Object}
   */
  getStateValue () {
  }

  _getInput (index = 0) {
    if (this.state && this.state.options.fields) {
      const fields = Object.keys(this.state.options.fields);
      const fieldId = fields[index];
      if (fieldId) {
        const input = this.refs.form.getComponent(fieldId);
        if (input && input.refs) {
          if (input.refs.input && input.refs.input.props.editable !== false) {
            return input
          }
          else if (input.refs.datepicker) {
            return input;
          }
        }
        return this._getInput(index + 1);
      }

    }
    return null;
  }

  getActions () {
    return {
      onSubmitEditing: this._focusNextInput.bind(this),
      onFocus: this._scrollToInput.bind(this),
      onCallApi: this._onCallApi.bind(this)
    };
  }

  _onCallApi (inputId, apiId, param) {
    if (apiId === 'axesAnalytiques') {
      const valeurAnalytique = _.findWhere(_.toArray(this.state.value.valeursAnalytiques), { idAxeAnalytique: param.id });
      const value = valeurAnalytique ? valeurAnalytique.description : '';
      Actions.valeursAnalytiquesAutocomplete({ input: inputId, axe: param, value });
    }
  }

  _focusNextInput (inputId) {
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
          else if (nextInput.refs.datepicker) {
            nextInput.refs.datepicker.onPressDate();
          }
        }
      }
    }
  }

  _scrollToInput (inputId) {
    if (!PlatformHelper.isAndroid()) {
      setTimeout(() => {
        if (this.refs.scrollView) {
          const scrollResponder = this.refs.scrollView.getScrollResponder();
          let input = this.refs.form.getComponent(inputId);
          if (!input) {
            input = this._getInput();
          }
          const nodle = findNodeHandle(input);
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(nodle, 110, true);
        }
      }, 50);
    }

  }

  componentDidUpdate () {
    currentForm = this.refs.form;
  }

  onChange (value) {
    this.setState({ value });
  }

  static _save (props) {

    const validate = currentForm.validate();

    if (validate.errors.length > 0) {
      console.log(validate.errors);
    }
    else {
      let values = {};
      try {
        values = _.extend(values, currentForm.getValue());
        this.save(props, values);
      } catch (e) {
        console.log('--Erreur de saisie', values);
        Alert.alert('Erreur de saisie', e.message,
            [
              { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ]
        )

      }
    }
  }

  static _delete (props) {
    try {
      this.delete(currentForm.getValue(), props);
    } catch (e) {
      Actions.pop();
    }
  }

  static getTitle () {
    return 'Realm form...';
  }

  static shouldDelete (props) {
    return true;
  }

  static hasMenu () {
    return false;
  }

  static renderNavigationBar (props) {

    const deleteAction = this.shouldDelete(props) ? <TouchableOpacity onPress={this._delete.bind(this, props)}>
      <MaterialIcons name="delete" size={IconSize.medium} style={Style.navBarIcon}/>
    </TouchableOpacity> : null;

    const menuAction = this.hasMenu() ?
        <TouchableOpacity onPress={() => Actions.refresh({
          key: 'drawer',
          open: value => !value,
          onCloseStart: () => Actions.refresh({ selected: {} })
        })}>
          <MaterialIcons name="menu" size={IconSize.medium} style={[Style.navBarIcon]}/>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => Actions.pop({ account: props.account })}>
          <MaterialIcons name="arrow-back" size={IconSize.medium} style={Style.navBarIcon}/>
        </TouchableOpacity>;

    return <View style={Style.navBar}>

      <View style={[Style.flexRowCenter]}>

        {menuAction}

        <Text style={[Style.navBarTitle]}>{this.getTitle(props)}</Text>

      </View>

      {deleteAction}

      <TouchableOpacity onPress={this._save.bind(this, props)}>
        <MaterialIcons name="check" size={IconSize.medium} style={Style.navBarIcon}/>
      </TouchableOpacity>

    </View>
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render () {
    if (this.state.form && this.state.options) {
      return <View style={Style.containerWithNavBar}>

        <ScrollView ref='scrollView' scrollEnabled={false} showsVerticalScrollIndicator={true}>

          <Form ref="form" type={this.state.form} options={this.state.options} value={this.state.value}
                onChange={this.onChange.bind(this)} style={{ backgroundColor: 'red' }}/>

        </ScrollView>
      </View>
    }
    return null;
  }

}
