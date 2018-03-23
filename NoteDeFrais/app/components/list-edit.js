'use strict';

import React, {
  Component,
} from 'react';

import {
  Text,
  Image,
  ListView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native-animatable';
import { Actions, } from 'react-native-router-flux';
import { Style, IconSize, Colors } from '../styles/style';
import I18n from '../i18n/translations';

export default class ListEdit extends Component {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor (props) {
    super(props);

    /** @type {Object} */
    this.state = {
      dataSource: null,
      selected: {},
      refreshing: false
    };
  }

  getElements () {
    return [];
  }

  _loadDatasource (props) {
    const elements = this.getElements(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return ds.cloneWithRows(elements);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return true;
  }

  componentWillUpdate (props, state) {
    state.dataSource = this._loadDatasource(props);
    state.selected = props.selected || {};
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        dataSource: this._loadDatasource(this.props),
        selected: this.props.selected || {}
      });
    });
  }

  onLongPress (element, isSelected = false) {
    const selected = this.state.selected;
    selected[element.id] = !isSelected;
    if (isSelected) {
      delete selected[element.id];
    }
    else {
      selected[element.id] = true;
    }

    Actions.refresh({ selected });
  }

  onPress (element, isSelected = false) {
    const selected = this.state.selected;
    if (isSelected) {
      delete selected[element.id];
      Actions.refresh({ selected });
      return false;
    }
    else if (Object.keys(selected).length > 0) {
      selected[element.id] = true;
      Actions.refresh({ selected });
      return false;
    }
    return true;
  }

  _renderSelectedIcon (isSelected) {

    if (isSelected) {
      return <View animation="jello" style={[Style.imageListPreview, Colors.greyDarker.background()]}>
        <MaterialIcons name="check" size={IconSize.small}
                       style={Colors.yellowGreen.color()}/>
      </View>;
    }
    return null;
  }

  _renderRowContent (element, sectionID, rowID, highlightRow) {
    return null;
  }

  _isSelectedElement (element) {
    return this.state.selected[element.id] === true;
  }

  _renderRow (element, section, id) {
    const isSelected = this._isSelectedElement(element);
    return (
        <TouchableOpacity onPress={this.onPress.bind(this, element, isSelected)}
                          onLongPress={this.onLongPress.bind(this, element, isSelected)}>
          <View style={[Style.row, Style.rowListView]}>
            {this._renderSelectedIcon(isSelected)}
            {this._renderRowContent(element)}
          </View>
        </TouchableOpacity>
    );
  }

  _renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
    return (
        <View
            key={`${sectionID}-${rowID}`}
            style={{
              height: adjacentRowHighlighted ? 4 : 1,
              backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
            }}
        />
    );
  }

  shouldAdd () {
    return true;
  }

  async onRefresh () {
  }

  async _onRefresh () {
    this.setState({ refreshing: true });
    await this.onRefresh();
    this.setState({ refreshing: false });
  }

  render () {

    const refreshControl = <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh.bind(this)}
    />;

    if (this.state.dataSource) {
      let iconAnimation = 'pulse';
      let content;

      if (this.state.dataSource.getRowCount(0) === 0) {

        const message = this.shouldAdd() ? I18n.t('help.emptyList') : I18n.t('help.emptySyncList');
        iconAnimation = 'zoomIn';
        content = <View style={{ alignItems: 'center', marginTop: 50 }}>
          <MaterialIcons name="live-help" size={IconSize.xxlarge} style={[Colors.grey.color()]}/>
          <Text style={[Style.h3, Colors.greyDarker.color(), {
            margin: 20,
            padding: 10,
            textAlign: 'center',
          }]}>{message}</Text>
        </View>

      }
      else {
        content = <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={this._renderSeparator.bind(this)}
            style={{ backgroundColor: Colors.white.code }}
        />
      }

      const addIcon = this.shouldAdd() ?
          <TouchableOpacity ref="add" onPress={this.add.bind(this)} style={Style.buttonActionContainer}>
            <View style={Style.buttonAction} animation={iconAnimation}>
              <MaterialIcons name="add" size={IconSize.medium} style={[Colors.white.color()]}/>
            </View>
          </TouchableOpacity> : null;

      return (

          <View style={Style.containerWithNavBar}>
            <ScrollView ref='scrollView' keyboardDismissMode='none' showsVerticalScrollIndicator={true}
                        refreshControl={refreshControl} style={{ backgroundColor: Colors.greyLighter.code }}>
              {content}
            </ScrollView>
            {addIcon}
          </View>);
    }
    return null;

  }

}
