import React from 'react';
import { View, Text } from 'react-native';
import { Style } from '../styles/style';
import DatePicker from './datepicker';
import I18n from '../i18n/translations';

const datepicker = (locals) => {
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
  const error = locals.hasError && locals.error
    ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text>
    : null;

  return (
    <View style={[Style.formRow, Style.inline, formGroupStyle]}>
      {label}
      <DatePicker
        ref="datepicker"
        style={[Style.inline]}
        date={locals.value}
        mode="date"
        placeholder={locals.placeholder}
        format={locals.format}
        confirmBtnText={I18n.t('datepicker.confirmBtnText')}
        cancelBtnText={I18n.t('datepicker.cancelBtnText')}
        showIcon={true}
        onDateChange={value => locals.onChange(value)}
        onSubmitEditing={locals.onSubmitEditing}
      />
      {help}
      {error}
    </View>
  );
};

export default datepicker;
