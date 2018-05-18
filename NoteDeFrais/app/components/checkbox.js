import React from 'react';
import { View, Text, Switch } from 'react-native';

import { Style } from '../styles/style';

const checkbox = (locals) => {
  let checkbox = null;
  if (!locals.hidden) {
    checkbox = (
      <View style={[Style.formRow, Style.inline]}>
        <Text style={Style.input}>{locals.label}</Text>
        <Switch
          accessibilityLabel={locals.label}
          ref="input"
          disabled={locals.disabled}
          onTintColor={locals.onTintColor}
          thumbTintColor={locals.thumbTintColor}
          tintColor={locals.tintColor}
          onValueChange={value => locals.onChange(value)}
          value={locals.value}
        />
      </View>
    );
  }
  return checkbox;
};

export default checkbox;
