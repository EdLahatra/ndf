import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Dimensions,
  NetInfo,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconSize, Style, Colors } from '../styles/style';

import { countries } from '../lib/countries';
import { query, details } from '../lib/requette';

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
      dataSource: [],
      offline: false,
    };
  }

  handleConnectionChange = isConnected => this.setState({ offline: !isConnected });

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(isConnected => this.setState({ offline: !isConnected }));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  _handleChangeText = value => this.setState({ value });

  _onChangeText(value, placeholder) {
    this.setState({ value });
    if (!this.state.offline && placeholder !== 'Pays') {
      axios.get(query(value))
        .then(res => this.setState({ dataSource: res.data.predictions }))
        .catch(() => this.setState({ dataSource: [] }));
    }
    if (placeholder === 'Pays') {
      this.setState({ dataSource: countries.filter(key => key.name.includes(value)) });
    }
  }

  _renderRow = (rowData = {}) => (
    <ScrollView
      style={{ flex: 1 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <TouchableHighlight
        style={{ width: WINDOW.width, marginTop: 40 }}
        onPress={() => this.onSelect(rowData)}
      >
        <View>
          <Text>{rowData.name || rowData.description} </Text>
        </View>
      </TouchableHighlight>
    </ScrollView>
  )

  onSelect = (rowData) => {
    this.setState({ value: rowData.name || rowData.description, dataSource: [] });
    if (rowData.place_id && !this.state.offline) {
      axios.get(details(rowData.place_id))
        .then(() => {
          // this.setState({ value: res.data.result.geometry.location.lat.toString() });
        }).catch(() => this.setState({ dataSource: [] }));
    }
  }

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
    let icon = null;
    if (locals.icon) {
      if (MaterialIcons.glyphMap[locals.icon]) {
        icon = (<MaterialIcons
          name={locals.icon}
          size={IconSize.medium}
          style={[Colors.greyDarker.color(), { marginRight: 5 }]}
        />);
      } else {
        icon = (<Text style={[Style.iconText, { marginRight: 5 }]}>
          {locals.icon.toUpperCase()}</Text>);
      }
    }

    let iconEnd = <Text style={[Style.iconText, { marginHorizontal: 15 }]} />;
    if (locals.iconEnd) {
      if (MaterialIcons.glyphMap[locals.iconEnd]) {
        iconEnd = (<TouchableOpacity onPress={locals.openModal}>
          <MaterialIcons
            name={locals.iconEnd}
            size={IconSize.medium}
            style={[Colors.greyDarker.color(), { marginHorizontal: 5 }]}
          />
        </TouchableOpacity>);
      } else {
        iconEnd = (<Text
          style={[Style.iconText, {
            marginLeft: 10,
            marginRight: 15,
          }]}
        >{locals.iconEnd.toUpperCase()}</Text>);
      }
    }

    if (locals.api === 'places') {
      iconEnd = (<TouchableOpacity onPress={locals.onCallApi}>
        <MaterialIcons
          name="my-location"
          size={IconSize.medium}
          style={[Colors.greyDarker.color(), { marginHorizontal: 5 }]}
        />
      </TouchableOpacity>);
    }

    return (
      <View style={[Style.formRow, Style.inline, formGroupStyle]}>
        {label}
        {icon}
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
            this._onChangeText(value, locals.placeholder);
          }}
          onChange={locals.onChange}
          placeholder={locals.placeholder}
          style={[Style.input, textboxStyle]}
          value={this.state.value}
        />
        {locals.renderModal}
        {iconEnd}
        {help}
        {error}
        {this._getFlatList()}
      </View>
    );
  }
}
