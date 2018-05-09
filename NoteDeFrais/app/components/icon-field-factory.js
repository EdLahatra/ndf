import IconField from './icon-field';

const t = require('tcomb-form-native');

const Component = t.form.Component;

export default class IconFieldFactory extends Component {
  getTemplate() {
    return IconField;
  }

  getOptions() {
    const options = this.props.options;
    const items = options.options.slice();
    return items;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.options = this.getOptions();
    [
      'help',
      'enabled',
      'mode',
      'prompt',
      'itemStyle'
    ].forEach(name => locals[name] = this.props.options[name]);

    return locals;
  }
}

// as example of transformer: this is the default transformer for textboxes
IconFieldFactory.transformer = {
  format: value => value || '',
  parse: value => value
};
