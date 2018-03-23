import React from 'react';

const t = require('tcomb-form-native');
const Component = t.form.Component;
const Nil = t.Nil;
import DatepickerField from './datepicker-field';
import I18n from '../i18n/translations';
import moment from 'moment';

export default class DatePicker extends Component {

  getTemplate () {
    return DatepickerField;
  }

  getLocals () {
    const locals = super.getLocals();
    [
      'help',
      'maximumDate',
      'minimumDate',
      'minuteInterval',
      'mode',
      'timeZoneOffsetInMinutes',
      'icon',
      'iconEnd',
      'onSubmitEditing',
      'format'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

DatePicker.transformer = {
  format: value => Nil.is(value) ? new Date() : value,
  parse: value => {
    return moment(value, I18n.t('dateFormat')).toDate();
  }
};