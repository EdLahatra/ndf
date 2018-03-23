import React from 'react';

const t = require('tcomb-form-native');
const Component = t.form.Component;

import ImageField from './image-field';

import _ from 'underscore';

export default class ImageFieldFactory extends Component {

  getTemplate () {
    return ImageField;
  }

}

// as example of transformer: this is the default transformer for textboxes
ImageFieldFactory.transformer = {
  format: (value) => {
    return value ? _.toArray(value) : [];
  },
  parse: (value) => {
    return value;
  }
};
