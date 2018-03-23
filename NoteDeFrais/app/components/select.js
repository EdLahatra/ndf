import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  Platform,
  Animated,
  Picker
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { IconSize, Style, Colors } from '../styles/style';
import DatepickerStyle from '../styles/datepicker-style';
import PlatformHelper from '../lib/platform-helper';

class Select extends Component {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value,
      modalVisible: false,
      disabled: this.props.disabled,
      animatedHeight: new Animated.Value(0)
    };

    this.valuePicked = this.valuePicked.bind(this);
    this.submitEditing = this.submitEditing.bind(this);
    this.onPressValue = this.onPressValue.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onValuePicked = this.onValuePicked.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillMount () {
    // ignore the warning of Failed propType for date of DatePickerIOS, will remove after being fixed by official
    console.ignoredYellowBox = [
      'Warning: Failed propType'
      // Other warnings you don't want like 'jsSchedulingOverhead',
    ];
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible });

    // slide animation
    if (visible) {
      Animated.timing(
          this.state.animatedHeight,
          {
            toValue: this.props.height,
            duration: this.props.duration
          }
      ).start();
    }
    else {
      this.setState({
        animatedHeight: new Animated.Value(0)
      });
    }
  }

  onPressCancel () {
    this.setModalVisible(false);
  }

  onPressConfirm () {
    this.valuePicked();
    this.setModalVisible(false);
    this.submitEditing();
  }

  valuePicked () {
    if (typeof this.props.onValuePicked === 'function') {
      this.props.onValuePicked(this.state.value);
    }
  }

  focus () {
    this.onPressValue();
  }

  submitEditing () {
    if (typeof this.props.onSubmitEditing === 'function') {
      setTimeout(() => {
        this.props.onSubmitEditing();
      }, this.props.duration);
    }
  }

  getTitleElement () {
    const { value, placeholder } = this.props;
    if (!value && placeholder) {
      return <Text style={[Style.input, Style.placeholder, this.props.textboxStyle]}>{placeholder}</Text>
    }
    return <Text style={[Style.input, this.props.textboxStyle]}>{this._getText(value)}</Text>;
  }

  _getText (value) {
    return this.props.options.filter((o) => o.value === value).map((o) => o.text)[0];
  }

  onValuePicked ({ value }) {
    this.setState({
      value
    });
    this.valuePicked();
  }

  onPressValue () {
    if (this.state.disabled) {
      return true;
    }

    if (Platform.OS === 'ios') {
      this.setModalVisible(true);
    }

  }

  getPicker () {
    const options = this.props.options.map(({ value, text }) => <Picker.Item key={value} value={value} label={text}/>);

    const onValueChange = (value) => {
      this.setState({ value });

      if (PlatformHelper.isAndroid()) {
        if (typeof this.props.onValuePicked === 'function') {
          this.props.onValuePicked(value);
        }
        this.submitEditing();
      }
    };

    return <Picker
        style={[Style.select, this.props.textboxStyle]}
        mode='dropdown'
        selectedValue={this.state.value}
        onValueChange={(value) => onValueChange(value)}>
      {options}
    </Picker>

  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render () {

    let customStyles = this.props.customStyles;
    if (PlatformHelper.isAndroid()) {
      return <TouchableHighlight
          ref="button"
          style={[this.props.style]}
          underlayColor={'transparent'}
          onPress={this.onPressValue.bind(this)}>

        <View style={[Style.inline]}>

          { this.props.icon && <MaterialIcons name={this.props.icon}
                                              size={IconSize.medium}
                                              style={[Colors.greyDarker.color(), { marginRight: 1 }]}/> }

          {this.getPicker()}

          <MaterialIcons name="arrow-drop-down" size={IconSize.medium}
                         style={[Colors.greyDarker.color(), { marginRight: 5 }]}/>

        </View>

      </TouchableHighlight>
    }

    return (<TouchableHighlight
            ref="button"
            style={[this.props.style]}
            underlayColor={'transparent'}
            onPress={this.onPressValue.bind(this)}>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

            { this.props.icon && <MaterialIcons name={this.props.icon} size={IconSize.medium}
                                                style={[Colors.greyDarker.color(), { marginRight: 5 }]}/> }

            {this.getTitleElement()}

            <MaterialIcons name="arrow-drop-down" size={IconSize.medium}
                           style={[Colors.greyDarker.color(), { marginRight: 5 }]}/>

            <Modal transparent={true}
                   visible={this.state.modalVisible}
                   onRequestClose={() => {
                     this.setModalVisible(false);
                   }}>

              <TouchableHighlight
                  style={DatepickerStyle.datePickerMask}
                  activeOpacity={1}
                  underlayColor={'#00000077'}
                  onPress={this.onPressCancel}>
                <TouchableHighlight underlayColor={'#fff'} style={{ flex: 1 }}>
                  <Animated.View
                      style={[DatepickerStyle.datePickerCon, { height: this.state.animatedHeight }, customStyles.datePickerCon]}>

                    {this.getPicker()}

                    <TouchableHighlight
                        underlayColor={'transparent'}
                        onPress={this.onPressCancel}
                        style={[DatepickerStyle.btnText, DatepickerStyle.btnCancel, customStyles.btnCancel]}>
                      <Text
                          style={[DatepickerStyle.btnTextText, DatepickerStyle.btnTextCancel, customStyles.btnTextCancel]}>
                        {this.props.cancelBtnText}
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        onPress={this.onPressConfirm}
                        style={[DatepickerStyle.btnText, DatepickerStyle.btnConfirm, customStyles.btnConfirm]}>
                      <Text
                          style={[DatepickerStyle.btnTextText, customStyles.btnTextConfirm]}>{this.props.confirmBtnText}</Text>
                    </TouchableHighlight>
                  </Animated.View>
                </TouchableHighlight>
              </TouchableHighlight>
            </Modal>


          </View>
        </TouchableHighlight>
    );
  }
}

Select.defaultProps = {
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  confirmBtnText: 'Ok',
  cancelBtnText: 'Cancel',
  customStyles: {},

  // whether or not show the icon
  showIcon: false,
  disabled: false,
  placeholder: ''
};

Select.propTypes = {
  height: React.PropTypes.number,
  duration: React.PropTypes.number,
  confirmBtnText: React.PropTypes.string,
  cancelBtnText: React.PropTypes.string,
  customStyles: React.PropTypes.object,
  showIcon: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onValueChange: React.PropTypes.func,
  placeholder: React.PropTypes.string
};

export default Select;
