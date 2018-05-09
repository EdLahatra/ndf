import _ from 'underscore';

import ImageField from './image-field';

const t = require('tcomb-form-native');

const Component = t.form.Component;

export default class ImageFieldFactory extends Component {
  getTemplate() {
    return ImageField;
  }
}

// as example of transformer: this is the default transformer for textboxes
ImageFieldFactory.transformer = {
  format: value => value ? _.toArray(value) : [],
  parse: value => value
};
