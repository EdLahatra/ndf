import ImageFieldFactory from '../components/image-field-factory';
import TextboxFieldFactory from '../components/textbox-field-factory';
import DatepickerFieldFactory from '../components/datepicker-field-factory';
import IconFieldFactory from '../components/icon-field-factory';
import SelectFieldFactory from '../components/select-field-factory';
import AutoComplete from '../components/autoComplete-field-factory';
import I18n from '../i18n/translations';
import Checkbox from '../components/checkbox';

const t = require('tcomb-form-native');

const Nil = t.Nil;

const toNull = value => (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value;

/**
 * Function qui permet de parser un nombre
 * @param value
 * @returns {number}
 */
const parseNumber = (value) => {
  if (value && value.replace) {
    value = value.replace(',', '.');
  }
  const n = Math.round(parseFloat(value) * 100) / 100;
  const isNumeric = ((value - n) + 1) >= 0;
  return isNumeric ? n : toNull(value);
};

/**
 * Tranformer 'tcomb-form-native' permet de mieux gérer les float
 * @type {{format: fn, parse: fn}}
 */
const FloatTransformer = {
  format: (value) => {
    if (value && value.replace) {
      value = value.replace(',', '.');
    }
    if (value == null || value === '') {
      return undefined;
    }

    if (Nil.is(value) || isNaN(value)) {
      return '';
    }
    const tmp = Math.round(parseFloat(value) * 100) / 100;
    if (tmp !== value) {
      return String(tmp);
    }
    return String(value);
  },
  parse: parseNumber
};

/**
 * Classe utilitaire pour manipuler les objets en realm.
 */
export default {

  /**
   * Construit un uuid
   * @returns {string}
   */
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const d = new Date().getTime();
      const r = (d + Math.random() * 16) % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
      return v.toString(16);
    });
  },

  /**
   * Méthode qui vérifie la syntaxe d'un email
   * @param email
   * @returns {boolean}
   */
  verifyEmail(email) {
    return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email); // eslint-disable-line
  },

  _toFormFieldType(propertyValue, propertyConfig) {
    const propertyType = typeof propertyValue === 'string' ? propertyValue : propertyValue.type;

    if (propertyConfig) {
      if (propertyConfig && propertyConfig.optional) {
        return t.maybe(this._toFormFieldType(propertyType, {
          enums: propertyConfig.enums,
          email: propertyConfig.email,
          optionType: propertyConfig.optionType
        }));
      }

      if (propertyConfig.enums) {
        return t.enums.of(propertyConfig.enums, propertyType);
      }

      if (propertyConfig.optionType) {
        return propertyType === 'list' ? t.list(t.Object) : t.String;
      }

      if (propertyConfig.email && propertyType === 'string') {
        return t.refinement(t.String, this.verifyEmail);
      }
    }

    if (propertyValue.optional) {
      return t.maybe(this._toFormFieldType(propertyType));
    }

    if (propertyType === 'list') {
      return t.list(
        propertyValue.objectType ? this._toFormFieldType(propertyValue.objectType) : t.Object);
    }

    if (propertyType === 'string') {
      return t.String;
    }
    if (propertyType === 'date') {
      return t.Date;
    }
    if (propertyType === 'bool') {
      return t.Boolean;
    }
    if (propertyType === 'int' || propertyType === 'float' || propertyType === 'double') {
      return t.Number;
    }

    return t.Object;
  },

  _toFieldType(propertyValue, propertyConfig) {
    return this._toFormFieldType(propertyValue, propertyConfig);
  },

  /**
   * Méthode qui va retourne la bonne configuration du formulaire à partir du schema realm
   * @param schema
   * @param formType
   * @returns {Object}
   * @private
   */
  _getForm(schema, formType) {
    if (schema._form) {
      const _form = schema._form[formType];
      return _form || schema._form;
    }
    throw new Error('No form configured in Schema');
  },

  /**
   * Méthode qui construit un formulaire compatible 'tcomb-form-native' à partir d'un schema realm.
   * @param schema
   * @param formType
   * @returns {*}
   */
  toForm({ schema, formType }) {
    const _form = this._getForm(schema, formType);

    const properties = schema.properties;
    const primaryKey = schema.primaryKey;
    const form = {};

    for (const property in properties) {
      if (property === primaryKey) {
        form[property] = t.maybe(t.String);
      } else {
        const propertyConfig = _form[property];
        if (propertyConfig) {
          form[property] = this._toFieldType(properties[property], propertyConfig);
        }
      }
    }

    return t.struct(form);
  },

  /**
   * Méthodes qui construit la liste des options d'un formulaire 'tcomb-form-native'
   * en fonction d'un schema realm.
   * @param config
   * @param onSubmitEditing
   * @param onFocus
   * @param onCallApi
   * @returns {{}}
   */
  toFieldsOptions(config, { onSubmitEditing, onFocus, onCallApi }) {
    const schema = config.schema;
    const properties = schema.properties;
    const primaryKey = schema.primaryKey;
    const _form = this._getForm(schema, config.formType);

    const propertiesKeys = Object.keys(properties);

    const fieldsOptions = {};

    for (let i = 0; i < propertiesKeys.length; i++) {
      const property = propertiesKeys[i];

      if (primaryKey === property) {
        fieldsOptions[property] = { hidden: true };
      } else {
        const propertyValue = properties[property];
        const _formConfig = _form[property];

        if (_formConfig) {
          fieldsOptions[property] = {
            placeholder: I18n.t(`${schema.name}.placeholder.${property}`)
          };

          if (onSubmitEditing) {
            fieldsOptions[property].onSubmitEditing = () => {
              onSubmitEditing(property);
            };
          }

          if (onFocus) {
            fieldsOptions[property].onFocus = () => {
              onFocus(property);
            };
          }

          if (property === 'justificatifs') {
            fieldsOptions[property].factory = ImageFieldFactory;
          }

          if (_formConfig.optionType) {
            const options = config[_formConfig.optionType];

            fieldsOptions[property].options = options;

            fieldsOptions[property].nullOption = {
              value: '',
              text: I18n.t(`${schema.name}.placeholder.${_formConfig.optionType}`)
            };
          }

          if (_formConfig.hidden) {
            fieldsOptions[property].hidden = true;
          }

          if (_formConfig.enums) {
            const options = _formConfig.enums.slice(0, 150)
              .map(key => ({ value: key, text: I18n.t(`${schema.name}.${key}`) }));

            fieldsOptions[property].options = options;
            fieldsOptions[property].nullOption = {
              value: '',
              text: I18n.t(`${schema.name}.placeholder.${property}`)
            };
          }

          if (_formConfig.email) {
            fieldsOptions[property].keyboardType = 'email-address';
          }

          if (_formConfig.phone) {
            fieldsOptions[property].keyboardType = 'phone-pad';
          }

          if (_formConfig.editable === false) {
            fieldsOptions[property].editable = false;
          }

          if (_formConfig.api) {
            fieldsOptions[property].api = _formConfig.api;

            fieldsOptions[property].onCallApi = (params) => {
              onCallApi(property, _formConfig.api, params);
            };
            const options = config[_formConfig.api];
            if (options) {
              fieldsOptions[property].options = options;
              fieldsOptions[property].factory = TextboxFieldFactory;
            }
          }

          if (_formConfig.icon) {
            fieldsOptions[property].icon = _formConfig.icon;
          }

          if (_formConfig.iconEnd) {
            fieldsOptions[property].iconEnd = _formConfig.iconEnd;
          }

          if (propertyValue === 'bool' || propertyValue.type === 'bool') {
            fieldsOptions[property].template = Checkbox;
          }

          if (propertyValue === 'date' || propertyValue.type === 'date') {
            fieldsOptions[property].factory = DatepickerFieldFactory;
            fieldsOptions[property].format = I18n.t('dateFormat');
          }

          if (propertyValue === 'float' || propertyValue.type === 'float') {
            fieldsOptions[property].transformer = FloatTransformer;
          }

          if (
            !_formConfig.enums
            && (
              propertyValue === 'string' || propertyValue.type === 'string'
              || propertyValue === 'float' ||
              propertyValue.type === 'float' || propertyValue === 'int'
              || propertyValue.type === 'int'
            )
          ) {
            if (
              (property === 'pays' || property === '_depart'
              || property === 'lieu' || property === 'ville') && 7 < 4
            ) {
              fieldsOptions[property].factory = AutoComplete;
            } else {
              fieldsOptions[property].factory = TextboxFieldFactory;
            }
          }

          if (_formConfig.enums || _formConfig.optionType) {
            fieldsOptions[property].factory = _formConfig.type === 'icon'
              ? IconFieldFactory : SelectFieldFactory;
          }

          if (_formConfig.isSecured) {
            fieldsOptions[property].secureTextEntry = true;
          }

          if (_formConfig.autoCorrect) {
            fieldsOptions[property].autoCorrect = _formConfig.autoCorrect;
          } else {
            fieldsOptions[property].autoCorrect = false;
          }

          if (_formConfig.autoCapitalize) {
            fieldsOptions[property].autoCapitalize = _formConfig.autoCapitalize;
          } else {
            fieldsOptions[property].autoCapitalize = 'sentences';
          }
        }
      }
    }

    return fieldsOptions;
  }

};

/*
module.exports.FloatTransformer = FloatTransformer;
module.exports.TextboxFieldFactory = TextboxFieldFactory;
module.exports.IconFieldFactory = IconFieldFactory;
module.exports.SelectFieldFactory = SelectFieldFactory;
module.exports.DatepickerFieldFactory = DatepickerFieldFactory;
module.exports.ImageFieldFactory = ImageFieldFactory;
*/
