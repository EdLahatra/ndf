import React from 'react';

const t = require('tcomb-form-native');
const Component = t.form.Component;

import IconField from './icon-field';

export default class IconFieldFactory extends Component {

  getTemplate () {
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
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

// as example of transformer: this is the default transformer for textboxes
IconFieldFactory.transformer = {
  format: (value) => {
    return value ? value : '';
  },
  parse: (value) => {
    return value;
  }
};
