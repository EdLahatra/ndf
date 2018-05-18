import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import _ from 'underscore';

import { Style, IconSize, Colors } from '../styles/style';
import Glyphicons from '../Glyphicons';
import i18n from '../i18n/translations';
import ENV from '../config/environment';
import Logger from '../lib/Logger';

class ImageField extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(props) {
    super(props);
    /** @type {Object} */
    this.state = {
      images: this.props.locals.value,
    };
  }

  render() {
    const cameraImage = this.renderImage();

    return (<View>
      <View style={[Colors.greyLighter.background(), Style.flexRowCenter, {
        justifyContent: 'center',
        height: 200
      }]}
      >
        {cameraImage}
      </View>
      <View style={{ height: IconSize.medium }} />
      <TouchableOpacity
        style={[Style.buttonAction, Style.buttonAbovePrevious]}
        onPress={this.camera.bind(this)}
      >
        <View>
          <MaterialIcons name="photo-camera" size={IconSize.medium} style={Colors.white.color()} />
        </View>
      </TouchableOpacity>

    </View>);
  }

  renderModal(source, index) {
    return (
      <Modal
        animationType={'fade'}
        transparent={false}
        visible={this.state.imageVisible === index}
        onRequestClose={this.closeModal.bind(this, index)}
      >
        <Image source={source} style={Style.imagePreview} resizeMode="contain" />
        <TouchableOpacity
          style={Style.imagePreviewActions}
          onPress={this.closeModal.bind(this, index)}
        >
          <View>
            <MaterialIcons
              name="arrow-back"
              size={IconSize.medium}
              style={Style.imagePreviewIcon}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  openModal(index) {
    this.setState({ imageVisible: index });
  }

  closeModal() {
    this.setState({ imageVisible: null });
  }

  deleteImage(index) {
    const images = this.state.images;
    images.splice(index, 1);
    this.setState({ images });
    this.props.locals.onChange(images);
  }

  renderImage() {
    if (this.state.images && this.state.images.length > 0) {
      const self = this;
      const imageElements = [];
      this.state.images.forEach((image, index) => {
        if (image) {
          const source = { uri: `data:image/jpeg;base64,${image.data}`, isStatic: true };
          const modal = self.renderModal(source, index);
          const element = (
            <TouchableOpacity
              key={`${index}`}
              style={{ flex: 1 }}
              onPress={self.openModal.bind(self, index)}
            >
              <View style={{ flex: 1 }}>
                {modal}
                <Image source={source} style={Style.imagePreview} />
                <TouchableOpacity
                  style={Style.imagePreviewActions}
                  onPress={self.deleteImage.bind(self, index)}
                >
                  <View>
                    <MaterialIcons
                      name="close"
                      size={IconSize.medium}
                      style={Style.imagePreviewIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>);
          imageElements.push(element);
        }
      });
      return imageElements;
    }

    return <Glyphicons name="picture" size={IconSize.xxlarge} style={Colors.greyDarker.color()} />;
  }

  camera() {
    const options = {
      title: i18n.t('imagePicker.title'), // 'Ajouter un justificatif'
      cancelButtonTitle: i18n.t('imagePicker.cancelButtonTitle'), // 'Annuler',
      // 'depuis l\'appareil photo',
      takePhotoButtonTitle: i18n.t('imagePicker.takePhotoButtonTitle'),
      // 'depuis la gallerie',
      chooseFromLibraryButtonTitle: i18n.t('imagePicker.chooseFromLibraryButtonTitle'),
      storageOptions: {
        path: ENV.cameraConfig.path
      },
      noData: false,
      maxWidth: ENV.cameraConfig.maxWidth,
      maxHeight: ENV.cameraConfig.maxHeight,
      quality: ENV.cameraConfig.quality,
      allowsEditing: true
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Logger.error(response.error);
      } else {
        const images = _.map(this.state.images, _.clone).filter(image => image !== null);
        images.push({ data: response.data });
        this.setState({ images });
        this.props.locals.onChange(images);
      }
    });
  }
}

imageField = (locals) => {
  let imageField = null;
  if (!locals.hidden) {
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

    imageField = (
      <View style={[formGroupStyle]}>
        {label}
        <ImageField locals={locals} />
        {help}
        {error}
      </View>
    );
  }
  return imageField;
};

export default imageField;
