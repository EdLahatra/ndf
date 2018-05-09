import TextboxField from './textbox-field';

const t = require('tcomb-form-native');

const Component = t.form.Component;
const Nil = t.Nil;

const toNull = value => (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value;

const parseNumber = value => ((value - parseFloat(value)) + 1) >= 0
  ? parseFloat(value) : toNull(value);

export default class Textbox extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const should = (
      nextState.value !== this.state.value ||
        nextState.hasError !== this.state.hasError ||
        nextProps.options !== this.props.options ||
        nextProps.type !== this.props.type
    );
    return should;
  }

  getTransformer() {
    const options = this.props.options;
    return options.transformer ? options.transformer :
      this.typeInfo.innerType === t.Number ? Textbox.numberTransformer :
        Textbox.transformer;
  }

  getTemplate() {
    return TextboxField;
  }

  getPlaceholder() {
    let placeholder = this.props.options.placeholder;
    if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  }

  getKeyboardType() {
    const keyboardType = this.props.options.keyboardType;
    if (t.Nil.is(keyboardType) && this.typeInfo.innerType === t.Number) {
      return 'numeric';
    }
    return keyboardType;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.placeholder = this.getPlaceholder();
    locals.onChangeNative = this.props.options.onChange;
    locals.keyboardType = this.getKeyboardType();

    [
      'help',
      'autoCapitalize',
      'autoCorrect',
      'autoFocus',
      'blurOnSubmit',
      'editable',
      'maxLength',
      'multiline',
      'onBlur',
      'onEndEditing',
      'onFocus',
      'onLayout',
      'onSelectionChange',
      'onSubmitEditing',
      'placeholderTextColor',
      'secureTextEntry',
      'selectTextOnFocus',
      'selectionColor',
      'numberOfLines',
      'underlineColorAndroid',
      'clearButtonMode',
      'clearTextOnFocus',
      'enablesReturnKeyAutomatically',
      'keyboardAppearance',
      'onKeyPress',
      'returnKeyType',
      'selectionState',
      'icon',
      'iconEnd',
      'api',
      'onCallApi',
      'options'
    ].forEach(name => locals[name] = this.props.options[name]);

    return locals;
  }
}

Textbox.transformer = {
  format: value => Nil.is(value) || value === 'null' ? '' : value,
  parse: toNull
};

Textbox.numberTransformer = {
  format: value => Nil.is(value) || value === 'null' ? '0' : String(value),
  parse: parseNumber
};
