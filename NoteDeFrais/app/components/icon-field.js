import React, { Component, } from 'react';

import {
    Alert,
    Platform,
    Text,
    TextInput,
    View,
    Image,
    Linking,
    TouchableNativeFeedback,
    ScrollView,
    findNodeHandle,
    Modal,
    TouchableOpacity
} from 'react-native';

import { Style, IconSize, Colors } from '../styles/style';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Glyphicons from '../Glyphicons';
import I18n from '../i18n/translations';

class IconField extends Component {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor (props) {
    super(props);
    /** @type {Object} */
    this.state = {
      icon: this.props.locals.value,
      isDisplayedModal: false
    };
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render () {
    const renderImage = this.renderImage();
    const modal = this.renderModal();

    return <View>
      {renderImage}

      <View style={{ height: IconSize.medium }}></View>

      <TouchableOpacity style={[Style.buttonAction, Style.buttonAbovePrevious]} onPress={this.openModal.bind(this)}>
        <View>
          <MaterialIcons name="mode-edit" size={IconSize.medium} style={Colors.white.color()}/>
        </View>
      </TouchableOpacity>

      {modal}
    </View>;

  }

  select (icon) {
    this.setState({ icon: icon.value });
    this.props.locals.onChange(icon.value);
    this.closeModal();
  }

  renderIconList () {

    const iconElements = [];

    const self = this;

    this.props.locals.options.forEach(function (icon) {

      const iconElement = <View key={icon.text} style={[{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.white,
        width: 120,
        height: 100,
        flexDirection: 'row'
      }]}>

        <TouchableOpacity onPress={self.select.bind(self, icon)} style={{ flex: 1, alignItems: 'center' }}>
          <Glyphicons name={icon.value} size={IconSize.large}
                      style={[Colors.greyDarker.color(), { textAlign: 'center', width: IconSize.large * 2 }]}/>
        </TouchableOpacity>

      </View>;

      iconElements.push(iconElement);

    });

    return (
        <ScrollView ref='scrollView' keyboardDismissMode='none' showsVerticalScrollIndicator={true}>
          <View style={[{
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center', 
            marginLeft: 5,
            marginBottom: 6    
          }, Colors.greyLighter.background()]}>
            {iconElements}
          </View>
        </ScrollView>
    )
  }

  renderModal () {

    const iconList = this.renderIconList();

    return <Modal animationType={"fade"}
                  transparent={false}
                  visible={this.state.isDisplayedModal}
                  onRequestClose={this.closeModal.bind(this)}>

      <View style={Style.modalNavBar}>
        <TouchableOpacity onPress={this.closeModal.bind(this)}>
          <MaterialIcons name="arrow-back" size={IconSize.medium} style={Style.imagePreviewIcon}/>
        </TouchableOpacity>

        <View style={[Style.flexRowCenter, Style.label]}>
          <Text style={[Style.navBarTitle]}>{I18n.t(`iconFieldPicker.title`)}</Text>
        </View>

      </View>
      {iconList}

    </Modal>
  }

  openModal () {
    this.setState({ isDisplayedModal: true });
  }

  closeModal () {
    this.setState({ isDisplayedModal: false });
  }

  deleteImage () {
    this.setState({ icon: null });
  }

  renderImage () {

    if (this.state.icon) {

      return <View style={[Style.flexRowCenter, { justifyContent: 'center', marginLeft: 5,
          marginBottom: 6 }, Colors.greyLighter.background()]}>

        <Glyphicons name={this.state.icon.replace('glyphicons-', '')} size={IconSize.xxlarge}
                    style={Colors.greyDarker.color()}/>

        <TouchableOpacity style={Style.imagePreviewActions} onPress={this.deleteImage.bind(this)}>
          <View>
            <MaterialIcons name="close" size={IconSize.medium} style={Style.imagePreviewIcon}/>
          </View>
        </TouchableOpacity>

      </View>;

    }
    else {
      return <View style={[Style.flexRowCenter, { justifyContent: 'center', marginLeft: 5,
          marginBottom: 6 }, Colors.greyLighter.background()]}>
        <Glyphicons name="fake" size={IconSize.xxlarge} style={Colors.greyDarker.color()}/>
      </View>
    }
  }
}

function iconField (locals) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  const label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  const error = locals.hasError && locals.error ?
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;

  return (
      <View style={[formGroupStyle]}>
        {label}
        <IconField locals={locals}/>
        {help}
        {error}
      </View>
  );
}

module.exports = iconField;