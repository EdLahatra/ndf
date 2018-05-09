import _ from 'underscore';
import SelectField from './select-field';

const t = require('tcomb-form-native');

const Component = t.form.Component;
const Nil = t.Nil;

const sortByText = (a, b) => a.text < b.text ? -1 : a.text > b.text ? 1 : 0;

const getComparator = order => ({
  asc: sortByText,
  desc: (a, b) => -sortByText(a, b)
}[order]);

export default class SelectFieldFactory extends Component {
  getTransformer() {
    const options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return SelectFieldFactory.transformer(this.getNullOption());
  }

  getTemplate() {
    return SelectField;
  }

  getNullOption() {
    return this.props.options.nullOption || { value: '', text: '-' };
  }

  getEnum() {
    return this.typeInfo.innerType;
  }

  getPlaceholder() {
    let placeholder = this.props.options.placeholder;
    if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  }

  onChange(value) {
    this.setState({ value }, () => {
      this.props.onChange(value, this.props.ctx.path);
    });
  }

  getOptions() {
    const options = this.props.options;
    const items = options.options ? options.options.slice() : getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    const nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.options = this.getOptions();
    locals.placeholder = this.getPlaceholder();
    locals.onChange = this.onChange.bind(this);

    [
      'help',
      'enabled',
      'mode',
      'prompt',
      'itemStyle',
      'onSubmitEditing',
      'icon'
    ].forEach(name => locals[name] = this.props.options[name]);

    return locals;
  }
}

SelectFieldFactory.transformer = nullOption => ({
  format: (value) => {
    if (typeof value === 'object') {
      return _.toArray(value);
    }

    return Nil.is(value) && nullOption ? nullOption.value : String(value);
  },
  parse: (value) => {
    if (typeof value === 'object') {
      return value;
    }
    return nullOption && nullOption.value === value ? null : value;
  }
});
