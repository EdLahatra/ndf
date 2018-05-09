import React from 'react';

import AutoComplete from './autoComplete';

const textbox = (locals) => {
  if (locals.hidden) {
    return null;
  }

  return (
    <AutoComplete
      locals={locals}
      accessibilityLabel={locals.label}
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
      clearButtonMode={locals.clearButtonMode}
      clearTextOnFocus={locals.clearTextOnFocus}
      enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
      keyboardAppearance={locals.keyboardAppearance}
      onKeyPress={locals.onKeyPress}
      returnKeyType={locals.returnKeyType}
      selectionState={locals.selectionState}
      onChange={locals.onChangeNative}
      placeholder={locals.placeholder}
      onChangeText={(value) => {
        locals.onChange(value);
      }}
    />
  );
};

export default textbox;
