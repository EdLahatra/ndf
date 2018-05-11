import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  findNodeHandle,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  PixelRatio,
  StyleSheet,
  FlatList,
  NetInfo,
  TouchableHighlight
} from 'react-native';
import axios from 'axios';
import { Actions, } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';

import { Style, IconSize } from '../styles/style';
import FormStyle from '../styles/formStyle';
import PlatformHelper from '../lib/platform-helper';
import utils from '../lib/utils';

import { countries } from '../lib/countries';
import { query } from '../lib/requette';

const t = require('tcomb-form-native');

const Form = t.form.Form;

let currentForm;

const WINDOW = Dimensions.get('window');

const defaultStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {
    backgroundColor: '#C9C9CE',
    height: 44,
    borderTopColor: '#7e7e7e',
    borderBottomColor: '#b5b5b5',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    flex: 1,
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  powered: {},
  listView: {
    // flex: 1,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  description: {},
  loader: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
};


/**
 * Composant permetant d'automatiser la création de formulaire basée sur
 * les modèles de données realm.
 * @module app/components/RealmForm.js
 * @override React.Component
 */
export default class RealmForm extends Component {
  _initForm(value) {
    const fields = utils.toFieldsOptions(this.getConfig(), this.getActions());

    this.setState({
      value,
      options: {
        auto: 'placeholders',
        i18n: {
          optional: '',
          required: '',
          add: 'Add', // add button
          remove: '✘', // remove button
          up: '↑', // move up button
          down: '↓' // move down button
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
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      options: {
        auto: 'placeholders',
        i18n: {
          optional: '',
          required: '',
          add: 'Add', // add button
          remove: '✘', // remove button
          up: '↑', // move up button
          down: '↓' // move down button
        },
        stylesheet: FormStyle,
        fields: null
      },
      form: null,
      text: '',
      dataSource: [],
      offline: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      GoogleAnalytics.trackScreenView(`Formulaire ${this.getConfig().schema.name}`);
      this._initForm(this.getStateValue());
      currentForm = this.refs.form;
      this._getInput().refs.input.focus && this._getInput().refs.input.focus();
    });
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(isConnected => this.setState({ offline: !isConnected }));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ offline: !isConnected });
  }

  componentWillReceiveProps(props) {
    this._initForm(this.state.value);
    if (props.place && props.place.data.description !== this.state.value[props.place.input]) {
      const value = _.clone(this.state.value);
      value[props.place.input] = props.place.data.description;
      this.setState({ value });
    } else if (props.distance && props.distance.data !== this.state.value[props.distance.input]) {
      const value = _.clone(this.state.value);
      value[props.distance.input] = props.distance.data;
      this.setState({ value });
    } else if (props.valeurAnalytique) {
      const value = _.clone(this.state.value);
      const valeursAnalytiques = _.toArray(value.valeursAnalytiques);
      const index = _.findLastIndex(valeursAnalytiques,
        { idAxeAnalytique: props.valeurAnalytique.idAxeAnalytique });
      if (index > -1) {
        valeursAnalytiques[index] = props.valeurAnalytique;
      } else {
        valeursAnalytiques.push(props.valeurAnalytique);
      }

      value.valeursAnalytiques = valeursAnalytiques;
      this.setState({ value });
    }
  }

  getConfig() {
  }

  /**
   * Méthode qui retourne la valeur de l'état du formulaire
   * @returns {Object}
   */
  getStateValue() {
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
          } else if (input.refs.datepicker) {
            return input;
          }
        }
        return this._getInput(index + 1);
      }
    }
    return null;
  }

  getActions() {
    return {
      onSubmitEditing: this._focusNextInput.bind(this),
      onFocus: this._scrollToInput.bind(this),
      onCallApi: this._onCallApi.bind(this)
    };
  }

  _onCallApi(inputId, apiId, param) {
    if (apiId === 'axesAnalytiques') {
      const valeurAnalytique = _.findWhere(_.toArray(this.state.value.valeursAnalytiques),
        { idAxeAnalytique: param.id });
      const value = valeurAnalytique ? valeurAnalytique.description : '';
      Actions.valeursAnalytiquesAutocomplete({ input: inputId, axe: param, value });
    }
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
          } else if (nextInput.refs.datepicker) {
            nextInput.refs.datepicker.onPressDate();
          }
        }
      }
    }
  }

  _scrollToInput(inputId) {
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

  componentDidUpdate() {
    currentForm = this.refs.form;
  }

  onChange = value => this.setState({ value });

  _handleChangeText = (text) => {
    this.setState({ text, dataSource: countries.filter(key => key.name.includes(text)) });
  }

  static _save(props) {
    const validate = currentForm.validate();

    if (validate.errors.length > 0) {
      console.log(validate.errors); // eslint-disable-line
    } else {
      let values = {};
      try {
        values = _.extend(values, currentForm.getValue());
        this.save(props, values);
      } catch (e) {
        console.log('--Erreur de saisie', values); // eslint-disable-line
        Alert.alert('Erreur de saisie', e.message,
          [
            { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // eslint-disable-line
          ]
        );
      }
    }
  }

  static _delete(props) {
    try {
      this.delete(currentForm.getValue(), props);
    } catch (e) {
      Actions.pop();
    }
  }

  static getTitle() {
    return 'Realm form...';
  }

  static shouldDelete() {
    return true;
  }

  static hasMenu() {
    return false;
  }

  static renderNavigationBar(props) {
    const deleteAction = this.shouldDelete(props)
      ? (<TouchableOpacity onPress={this._delete.bind(this, props)}>
        <MaterialIcons name="delete" size={IconSize.medium} style={Style.navBarIcon} />
      </TouchableOpacity>)
      : null;

    const menuAction = this.hasMenu() ?
      (<TouchableOpacity onPress={() => Actions.refresh({
        key: 'drawer',
        open: value => !value,
        onCloseStart: () => Actions.refresh({ selected: {} })
      })}
      >
        <MaterialIcons name="menu" size={IconSize.medium} style={[Style.navBarIcon]} />
      </TouchableOpacity>)
      :
      (<TouchableOpacity onPress={() => Actions.pop({ account: props.account })}>
        <MaterialIcons name="arrow-back" size={IconSize.medium} style={Style.navBarIcon} />
      </TouchableOpacity>);

    return (<View style={Style.navBar}>
      <View style={[Style.flexRowCenter]}>
        {menuAction}
        <Text style={[Style.navBarTitle]}>{this.getTitle(props)}</Text>
      </View>
      {deleteAction}
      <TouchableOpacity onPress={this._save.bind(this, props)}>
        <MaterialIcons name="check" size={IconSize.medium} style={Style.navBarIcon} />
      </TouchableOpacity>

    </View>);
  }

  async _onChangeText(text) {
    this.setState({ text });
    try {
      if (!this.state.offline) {
        return axios.get(query(text))
          .then(res => this.setState({ dataSource: res.data.predictions }))
          .catch(() => this.setState({ dataSource: [] }));
      }
      return this.setState({ dataSource: countries.filter(key => key.name.includes(text)) });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  _renderRow = (rowData = {}) => (
    <ScrollView
      style={{ flex: 1 }}
      scrollEnabled={this.props.isRowScrollable}
      keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <TouchableHighlight
        style={{ width: WINDOW.width, marginTop: 40 }}
        onPress={() => this.setState({ text: rowData.name || rowData.description, dataSource: [] })}
        underlayColor={this.props.listUnderlayColor || '#c8c7cc'}
      >
        <View
          style={[
            defaultStyles.row,
            rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}
          ]}
        >
          <Text>{ rowData.name || rowData.description} </Text>
        </View>
      </TouchableHighlight>
    </ScrollView>
  )

  _getFlatList = () => {
    const keyGenerator = () => (
      Math.random().toString(36).substr(2, 10)
    );
    if (this.state.dataSource && this.state.dataSource.length > 0) {
      return (
        <FlatList
          style={[defaultStyles.listView]}
          data={this.state.dataSource}
          keyExtractor={keyGenerator}
          extraData={[this.state.dataSource, this.props]}
          // ItemSeparatorComponent={this._renderSeparator}
          renderItem={({ item }) => this._renderRow(item)}
          // ListFooterComponent={this._renderPoweredLogo}
          // {...this.props}
        />
      );
    }
    return null;
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render() {
    if (this.state.form && this.state.options) {
      return (<View style={Style.containerWithNavBar}>
        { /* <TextInput
          ref="textInput"
          returnKeyType={this.props.returnKeyType}
          autoFocus={this.props.autoFocus}
          style={[Style.input]}
          value={this.state.text}
          placeholder={'pays'}

          placeholderTextColor={this.props.placeholderTextColor}
          // onFocus={onFocus ? () => { this._onFocus(); onFocus(); } : this._onFocus}
          clearButtonMode="while-editing"
          underlineColorAndroid={this.props.underlineColorAndroid}
          onChangeText={text => this._onChangeText(text)}
        />
        {/* this._getFlatList() */ }
        <ScrollView ref="scrollView" scrollEnabled={true} showsVerticalScrollIndicator={true}>
          <Form
            ref="form"
            type={this.state.form}
            options={this.state.options}
            value={this.state.value}
            onChange={this.onChange}
            style={{ backgroundColor: 'red' }}
          />
        </ScrollView>
      </View>);
    }

    return null;
  }
}
