import React, { Component, } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TextInput, ListView, ScrollView, TouchableOpacity } from 'react-native';

import CompteSecureService from '../services/CompteSecureService';
import AxeAnalytiqueService from '../services/AxeAnalytiqueService';
import ValeurAnalytiqueService from '../services/ValeurAnalytiqueService';

import { Style } from '../styles/style';

export default class PlaceAutocomplete extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super();
    this.compteSecureService = new CompteSecureService();
    this.axeAnalytiqueService = new AxeAnalytiqueService();
    this.valeurAnalytiqueService = new ValeurAnalytiqueService();
    this.state = {
      query: '',
      valeursAnalytiques: [],
      dataSource: null
    };
  }

  onPress(element) {
    let valeurAnalytique = element;

    if (element === null) {
      console.log('element is null'); // eslint-disable-line
      const suggestions = this.state.valeursAnalytiques
        .filter(valeur => valeur.description.toLowerCase() === this.state.query.toLowerCase());

      if (suggestions.length === 1) {
        valeurAnalytique = suggestions[0];
        console.log('suggestions'); // eslint-disable-line
      } else {
        valeurAnalytique = { idAxeAnalytique: this.props.axe.id };
        console.log('default'); // eslint-disable-line
      }
    }
    console.log(valeurAnalytique); // eslint-disable-line
    Actions.pop({ refresh: { valeurAnalytique } });
  }

  componentWillUpdate(props, state) {
    state.dataSource = this._loadDatasource(props, state);
  }

  componentDidMount() {
    this.setState({
      query: this.props.value || '',
      valeursAnalytiques: this.valeurAnalytiqueService
        .findAll(`idAxeAnalytique = "${this.props.axe.id}"`),
      dataSource: this._loadDatasource(this.props)
    });
  }

  _loadDatasource(props, state = this.state) {
    const regex = new RegExp(`${state.query.trim()}`, 'i');
    const valeursAnalytiques = state.valeursAnalytiques
      .filter(valeur => valeur.description.search(regex) >= 0);
    const elements = valeursAnalytiques;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return ds.cloneWithRows(elements);
  }

  _renderRow(element) {
    return (
      <TouchableOpacity onPress={this.onPress.bind(this, element)}>
        <View style={[Style.autoCompleteListRow]}>
          <Text>{element.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (<View key={`${sectionID}-${rowID}`} style={Style.autoCompleteListSeparator} />);
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render() {
    let List = null;
    if (this.state.dataSource) {
      List = (
        <ScrollView ref="scrollView" keyboardDismissMode="none" showsVerticalScrollIndicator={true}>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={this._renderSeparator.bind(this)}
          />
        </ScrollView>);
    }
    return (<View style={{ flex: 1 }}>
      <View style={[{ flex: 1 }, Style.autoCompleteTextInputContainer]}>
        <TextInput
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          onChangeText={(query) => {
            this.setState({ query });
          }}
          onSubmitEditing={this.onPress.bind(this, null)}
          style={[Style.autoCompleteTextInput]}
          placeholder={this.props.axe.description}
          value={this.state.query}
          clearButtonMode="while-editing"
        />
      </View>
      {List}
    </View>);
  }
}
