import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

import { Style } from '../styles/style';
import { countries } from '../lib/countries';

const WINDOW = Dimensions.get('window');

export default class Select extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.locals && this.props.locals.value ? this.props.locals.value : '',
      dataSource: []
    };
  }

  _handleChangeText = (value) => {
    this.setState({ value });
  }

  _onChangeText = (value) => {
    this._handleChangeText(value);
    return this.setState({ dataSource: countries.filter(key => key.name.includes(value)) });
  }

  _renderRow = (rowData = {}) => (
    <ScrollView
      style={{ flex: 1 }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <TouchableHighlight
        style={{ width: WINDOW.width, marginTop: 40 }}
        onPress={() => this.setState({ value: rowData.name, dataSource: [] })}
      >
        <View>
          <Text>{rowData.name} </Text>
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
          data={this.state.dataSource}
          keyExtractor={keyGenerator}
          extraData={[this.state.dataSource, this.props]}
          renderItem={({ item }) => this._renderRow(item)}
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
    const { locals } = this.props;

    const stylesheet = locals.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let textboxStyle = stylesheet.textbox.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    const errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
      formGroupStyle = stylesheet.formGroup.error;
      controlLabelStyle = stylesheet.controlLabel.error;
      textboxStyle = stylesheet.textbox.error;
      helpBlockStyle = stylesheet.helpBlock.error;
    }

    if (locals.editable === false) {
      textboxStyle = stylesheet.textbox.notEditable;
    }

    const label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
    const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
    const error = locals.hasError && locals.error ?
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
    return (
      <View style={[Style.formRow, Style.inline, formGroupStyle]}>
        {label}
        <TextInput
          accessibilityLabel={locals.accessibilityLabel}
          ref="input"
          autoCapitalize={locals.autoCapitalize}
          autoCorrect={locals.autoCorrect}
          autoFocus={locals.autoFocus}
          blurOnSubmit={locals.blurOnSubmit}
          editable={locals.editable}
          keyboardType={locals.keyboardType}
          maxLength={locals.maxLength}
          multiline={locals.multiline}
          onBlur={locals.onBlur}
          onEndEditing={locals.onEndEditing}
          onFocus={locals.onFocus}
          onLayout={locals.onLayout}
          onSelectionChange={locals.onSelectionChange}
          onSubmitEditing={locals.onSubmitEditing}
          placeholderTextColor={locals.placeholderTextColor}
          secureTextEntry={locals.secureTextEntry}
          selectTextOnFocus={locals.selectTextOnFocus}
          selectionColor={locals.selectionColor}
          numberOfLines={locals.numberOfLines}
          underlineColorAndroid="transparent"
          clearButtonMode={locals.clearButtonMode}
          clearTextOnFocus={locals.clearTextOnFocus}
          enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
          keyboardAppearance={locals.keyboardAppearance}
          onKeyPress={locals.onKeyPress}
          returnKeyType={locals.returnKeyType}
          selectionState={locals.selectionState}
          onChangeText={(value) => {
            locals.onChange(value);
            this._onChangeText(value);
          }}
          onChange={locals.onChange}
          placeholder={locals.placeholder}
          style={[Style.input, textboxStyle]}
          value={this.state.value}
        />
        {locals.renderModal}
        {help}
        {error}
        {this._getFlatList()}
      </View>
    );
  }
}

Select.propTypes = {
  locals: PropTypes.any,
};
