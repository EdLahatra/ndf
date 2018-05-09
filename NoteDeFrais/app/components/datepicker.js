import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableHighlight,
  DatePickerAndroid,
  TimePickerAndroid,
  DatePickerIOS,
  Platform,
  Animated
} from 'react-native';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import DatepickerStyle from '../styles/datepicker-style';
import { IconSize, Style, Colors } from '../styles/style';

const FORMATS = {
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm'
};

class DatePicker extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(props) {
    super(props);

    this.format = this.props.format || FORMATS[this.props.mode];

    this.state = {
      date: this.getDate(),
      modalVisible: false,
      disabled: this.props.disabled,
      animatedHeight: new Animated.Value(0)
    };

    this.datePicked = this.datePicked.bind(this);
    this.submitEditing = this.submitEditing.bind(this);
    this.onPressDate = this.onPressDate.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onDatePicked = this.onDatePicked.bind(this);
    this.onTimePicked = this.onTimePicked.bind(this);
    this.onDatetimePicked = this.onDatetimePicked.bind(this);
    this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillMount() {
    // ignore the warning of Failed propType for date of DatePickerIOS,
    // will remove after being fixed by official
    // eslint-disable-next-line no-console
    console.ignoredYellowBox = [
      'Warning: Failed propType'
      // Other warnings you don't want like 'jsSchedulingOverhead',
    ];
  }

  setModalVisible(visible) {
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
    } else {
      this.setState({
        animatedHeight: new Animated.Value(0)
      });
    }
  }

  onPressCancel = () => this.setModalVisible(false);

  onPressConfirm() {
    this.datePicked();
    this.setModalVisible(false);
  }

  getDate(date = this.props.date) {
    if (!date) {
      const now = new Date();
      if (this.props.minDate) {
        const minDate = this.getDate(this.props.minDate);

        if (now < minDate) {
          return minDate;
        }
      }

      if (this.props.maxDate) {
        const maxDate = this.getDate(this.props.maxDate);

        if (now > maxDate) {
          return maxDate;
        }
      }

      return now;
    }

    if (date instanceof Date) {
      return date;
    }

    return moment(date, this.format).toDate();
  }

  /* getDateStr(date = this.props.date) {
    if (date instanceof Date) {
      return moment(date).format(this.format);
    }

    return moment(this.getDate(date)).format(this.format);
  } */

  getDateStr = (date = this.props.date) => date instanceof Date
    ? moment(date).format(this.format)
    : moment(this.getDate(date)).format(this.format);

  datePicked() {
    if (typeof this.props.onDateChange === 'function') {
      this.props.onDateChange(this.getDateStr(this.state.date), this.state.date);
    }
    this.submitEditing();
  }

  submitEditing() {
    if (typeof this.props.onSubmitEditing === 'function') {
      // Waiting modal...
      setTimeout(() => {
        this.props.onSubmitEditing();
      }, this.props.duration);
    }
  }

  getTitleElement() {
    const { date, placeholder } = this.props;
    if (!date && placeholder) {
      return (
        <Text style={[DatepickerStyle.placeholderText, this.props.customStyles.placeholderText]}>
          {placeholder}
        </Text>);
    }
    return (
      <Text style={[DatepickerStyle.dateText, this.props.customStyles.dateText]}>
        {this.getDateStr()}
      </Text>);
  }

  onDatePicked({ action, year, month, day }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day)
      });
      this.datePicked();
    }
  }

  onTimePicked({ action, hour, minute }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: moment().hour(hour).minute(minute).toDate()
      });
      this.datePicked();
    }
  }

  onDatetimePicked({ action, year, month, day }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      const timeMoment = moment(this.state.date);

      TimePickerAndroid.open({
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: !this.format.match(/h|a/)
      }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
    }
  }

  onDatetimeTimePicked(year, month, day, { action, hour, minute }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day, hour, minute)
      });
      this.datePicked();
    }
  }

  onPressDate() {
    if (this.state.disabled) {
      return true;
    }

    // reset state
    this.setState({ date: this.getDate() });

    if (Platform.OS === 'ios') {
      this.setModalVisible(true);
    } else if (this.props.mode === 'date') {
      DatePickerAndroid.open({
        date: this.state.date,
        minDate: this.props.minDate && this.getDate(this.props.minDate),
        maxDate: this.props.maxDate && this.getDate(this.props.maxDate)
      }).then(this.onDatePicked);
    } else if (this.props.mode === 'time') {
      const timeMoment = moment(this.state.date);

      TimePickerAndroid.open({
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: !this.format.match(/h|a/)
      }).then(this.onTimePicked);
    } else if (this.props.mode === 'datetime') {
      DatePickerAndroid.open({
        date: this.state.date,
        minDate: this.props.minDate && this.getDate(this.props.minDate),
        maxDate: this.props.maxDate && this.getDate(this.props.maxDate)
      }).then(this.onDatetimePicked);
    } else {
      throw new Error('The specified mode is not supported');
    }
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render() {
    const customStyles = this.props.customStyles;
    this.format = this.props.format || FORMATS[this.props.mode];

    return (
      <TouchableHighlight
        ref="button"
        style={[DatepickerStyle.dateTouch, this.props.style]}
        underlayColor={'transparent'}
        onPress={this.onPressDate}
      >
        <View style={[DatepickerStyle.dateTouchBody, customStyles.dateTouchBody, { flex: 1 }]}>
          {this.props.showIcon &&
            <MaterialIcons
              name="date-range"
              size={IconSize.medium}
              style={[Colors.greyDarker.color(), { marginRight: 5 }]}
            />
          }
          <Text style={Style.input}>
            {this.getTitleElement()}
          </Text>

          {this.props.showIcon &&
            <MaterialIcons
              name="arrow-drop-down"
              size={IconSize.medium}
              style={[Colors.greyDarker.color(), { marginRight: 5 }]}
            />
          }
          {Platform.OS === 'ios' && <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(false);
            }}
          >
            <TouchableHighlight
              style={DatepickerStyle.datePickerMask}
              activeOpacity={1}
              underlayColor={'#00000077'}
              onPress={this.onPressCancel}
            >
              <TouchableHighlight
                underlayColor={'#fff'}
                style={{ flex: 1 }}
              >
                <Animated.View
                  style={[
                    DatepickerStyle.datePickerCon,
                    { height: this.state.animatedHeight },
                    customStyles.datePickerCon
                  ]}
                >
                  <DatePickerIOS
                    date={this.state.date}
                    mode={this.props.mode}
                    minimumDate={this.props.minDate && this.getDate(this.props.minDate)}
                    maximumDate={this.props.maxDate && this.getDate(this.props.maxDate)}
                    onDateChange={date => this.setState({ date })}
                    style={[DatepickerStyle.datePicker, customStyles.datePicker]}
                  />
                  <TouchableHighlight
                    underlayColor={'transparent'}
                    onPress={this.onPressCancel}
                    style={[
                      DatepickerStyle.btnText, DatepickerStyle.btnCancel, customStyles.btnCancel]}
                  >
                    <Text
                      style={[
                        DatepickerStyle.btnTextText,
                        DatepickerStyle.btnTextCancel,
                        customStyles.btnTextCancel
                      ]}
                    >
                      {this.props.cancelBtnText}
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={'transparent'}
                    onPress={this.onPressConfirm}
                    style={[
                      DatepickerStyle.btnText,
                      DatepickerStyle.btnConfirm,
                      customStyles.btnConfirm
                    ]}
                  >
                    <Text style={[DatepickerStyle.btnTextText, customStyles.btnTextConfirm]}>
                      {this.props.confirmBtnText}
                    </Text>
                  </TouchableHighlight>
                </Animated.View>
              </TouchableHighlight>
            </TouchableHighlight>
          </Modal>}
        </View>
      </TouchableHighlight>
    );
  }
}

DatePicker.defaultProps = {
  mode: 'date',
  date: '',
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height: 259,
  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  confirmBtnText: '确定',
  cancelBtnText: '取消',
  customStyles: {},
  // whether or not show the icon
  showIcon: false,
  disabled: false,
  placeholder: ''
};

DatePicker.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  height: PropTypes.number,
  duration: PropTypes.number,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  customStyles: PropTypes.obj,
  showIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  onDateChange: PropTypes.func,
  placeholder: PropTypes.string
};

export default DatePicker;
