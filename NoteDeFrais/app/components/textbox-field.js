import React, { Component, } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconSize, Style, Colors } from '../styles/style';
import _ from 'underscore';

function textbox (locals) {
  if (locals.hidden) {
    return null;
  }

  let stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let textboxStyle = stylesheet.textbox.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  let errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
  }

  const label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  const error = locals.hasError && locals.error ?
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;

  let icon = null;
  if (locals.icon) {
    if (MaterialIcons.glyphMap[locals.icon]) {
      icon = <MaterialIcons name={locals.icon} size={IconSize.medium}
                            style={[Colors.greyDarker.color(), { marginRight: 5 }]}/>
    }
    else {
      icon = <Text style={[Style.iconText, { marginRight: 5 }]}>{locals.icon.toUpperCase()}</Text>;
    }
  }

  let iconEnd = <Text style={[Style.iconText, { marginHorizontal: 15 }]}> </Text>;
  if (locals.iconEnd) {
    if (MaterialIcons.glyphMap[locals.iconEnd]) {
      iconEnd = <TouchableOpacity onPress={locals.openModal}>
        <MaterialIcons name={locals.iconEnd} size={IconSize.medium}
                       style={[Colors.greyDarker.color(), { marginHorizontal: 5 }]}/>
      </TouchableOpacity>

    }
    else {
      iconEnd = <Text
          style={[Style.iconText, {
            marginLeft: 10,
            marginRight: 15
          }]}>{locals.iconEnd.toUpperCase()}</Text>;
    }
  }

  let onFocus = locals.onFocus;

  if (locals.api === 'places') {
    iconEnd = <TouchableOpacity onPress={locals.onCallApi}>
      <MaterialIcons name='my-location' size={IconSize.medium}
                     style={[Colors.greyDarker.color(), { marginHorizontal: 5 }]}/>
    </TouchableOpacity>

  }

  else if (locals.api === 'distance-matrix') {

    const by2 = (distance) => distance * 2;

    iconEnd = <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

      <TouchableOpacity onPress={locals.onCallApi.bind(this, by2)}>
        <Text style={[Style.iconText, { marginRight: 5 }]}>A/R</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={locals.onCallApi}>
        <MaterialIcons name="directions" size={IconSize.medium}
                       style={[Colors.greyDarker.color(), { marginHorizontal: 5 }]}/>
      </TouchableOpacity>
    </View>

  }
  else if (locals.api === 'axesAnalytiques') {

    const _getValue = (axe) => {
      const valeurs = _.findWhere(locals.value, { idAxeAnalytique: axe.id });
      if (valeurs) {
        return valeurs;
      }
      return {};
    };

    return <View ref='input-view'>
      {
        locals.options.map((axe, index)=> {

          onFocus = locals.onCallApi.bind(this, axe);
          return <View key={`input-${index}`} style={[Style.formRow, Style.inline, formGroupStyle]}>
            {label}
            {icon}
            <TextInput
                accessibilityLabel={locals.label}
                ref={`input-${index}`}
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
                onFocus={onFocus}
                onLayout={locals.onLayout}
                onSelectionChange={locals.onSelectionChange}
                onSubmitEditing={locals.onSubmitEditing}
                placeholderTextColor={locals.placeholderTextColor}
                secureTextEntry={locals.secureTextEntry}
                selectTextOnFocus={locals.selectTextOnFocus}
                selectionColor={locals.selectionColor}
                numberOfLines={locals.numberOfLines}
                underlineColorAndroid='transparent'
                clearTextOnFocus={locals.clearTextOnFocus}
                enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
                keyboardAppearance={locals.keyboardAppearance}
                onKeyPress={locals.onKeyPress}
                returnKeyType={locals.returnKeyType}
                selectionState={locals.selectionState}
                onChangeText={(value) => {
                  locals.onChange(value)
                }}
                onChange={locals.onChangeNative}
                placeholder={axe.description}
                style={[Style.input, textboxStyle]}
                value={_getValue(axe).description}
            />
            {iconEnd}
            {locals.renderModal}
            {help}
            {error}
          </View>
        })
      }
    </View>
  }

  return (
      <View style={[Style.formRow, Style.inline, formGroupStyle]}>
        {label}
        {icon}
        <TextInput
            accessibilityLabel={locals.label}
            ref="input"
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
            underlineColorAndroid='transparent'
            clearButtonMode={locals.clearButtonMode}
            clearTextOnFocus={locals.clearTextOnFocus}
            enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
            keyboardAppearance={locals.keyboardAppearance}
            onKeyPress={locals.onKeyPress}
            returnKeyType={locals.returnKeyType}
            selectionState={locals.selectionState}
            onChangeText={(value) => {
              locals.onChange(value)
            }}
            onChange={locals.onChangeNative}
            placeholder={locals.placeholder}
            style={[Style.input, textboxStyle]}
            value={locals.value}
        />
        {iconEnd}
        {locals.renderModal}
        {help}
        {error}
      </View>
  );
}

module.exports = textbox;