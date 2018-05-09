import React from 'react';
import { View } from 'react-native';
import { Style } from '../styles/style';
import Select from './select';
import I18n from '../i18n/translations';

const select = (locals) => {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let textboxStyle = stylesheet.select.normal;

  if (locals.hasError) {
    textboxStyle = stylesheet.select.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.select.notEditable;
  }

  const onChange = (index, id) => {
    locals.value = locals.value || [];
    locals.value[index - 1] = { id };
    locals.onChange(locals.value);
  };

  if (locals.options && locals.options.length > 1) {
    if (Array.isArray(locals.options[1])) {
      return (<View ref="input-view">
        {
          locals.options.map((options, index) => {
            if (Array.isArray(options)) {
              return (<Select
                ref={`input-${index}`}
                key={`input-${index}`}
                index={index}
                value={locals.value[index - 1] ? locals.value[index - 1].id : ''}
                options={[locals.options[0]].concat(options)}
                onValuePicked={onChange.bind(this, index)}
                placeholder={locals.placeholder}
                style={[Style.formRow, Style.inline]}
                icon={locals.icon}
                textboxStyle={textboxStyle}
                onSubmitEditing={locals.onSubmitEditing}
                confirmBtnText={I18n.t('datepicker.confirmBtnText')}
                cancelBtnText={I18n.t('datepicker.cancelBtnText')}
              />);
            }
            return null;
          })
        }
      </View>);
    }
  }

  return (
    <Select
      ref="input"
      value={locals.value}
      options={locals.options}
      onValuePicked={locals.onChange}
      placeholder={locals.placeholder}
      style={[Style.formRow, Style.inline]}
      icon={locals.icon}
      textboxStyle={textboxStyle}
      onSubmitEditing={locals.onSubmitEditing}
      confirmBtnText={I18n.t('datepicker.confirmBtnText')}
      cancelBtnText={I18n.t('datepicker.cancelBtnText')}
    />
  );
};

export default select;
