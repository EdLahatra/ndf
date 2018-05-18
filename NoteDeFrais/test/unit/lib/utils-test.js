import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import utils, {
    FloatTransformer,
    TextboxFieldFactory,
    IconFieldFactory,
    SelectFieldFactory,
    ImageFieldFactory,
    DatepickerFieldFactory
}  from '../../../app/lib/utils';
import Depense from '../../../app/schemas/Depense';

describe('Utils', () => {

  describe('FloatTransformer', () => {

    it('should format float', ()=> {
      assert.equal('2.76', FloatTransformer.format(2.76));
      assert.equal('2.77', FloatTransformer.format(2.76786754324536476));
      assert.equal('2', FloatTransformer.format(2.00));
      assert.equal('2', FloatTransformer.format(2));
      assert.equal('2.12', FloatTransformer.format('2,12'));
      assert.equal('', FloatTransformer.format(null));
      assert.equal('', FloatTransformer.format(' '));
      assert.equal('', FloatTransformer.format(undefined));
    });

    it('should parse float', ()=> {
      assert.equal(2.76, FloatTransformer.parse('2.76'));
      assert.equal(2, FloatTransformer.parse('2'));
      assert.equal(2.12, FloatTransformer.parse('2,12'));
      assert.equal(2.77, FloatTransformer.parse('2.76786754324536476'));
      assert.equal(null, FloatTransformer.parse(null));
      assert.equal(null, FloatTransformer.parse(' '));
      assert.equal(null, FloatTransformer.parse(undefined));
    });

  });

  it('should generate uuid', ()=> {
    const uuid = utils.uuid();
    assert.isNotNull(uuid)
  });

  it('should verify email', ()=> {
    assert.isNotOk(utils.verifyEmail('foobar@foo'));
    assert.isNotOk(utils.verifyEmail('foobar$foo.bar'));
    assert.isNotOk(utils.verifyEmail('@foo.bar'));
    assert.isOk(utils.verifyEmail('foobar@foo.bar'));
  });

  it('should generate simple fields form option', ()=> {
    const config = { schema: Depense.schema };
    const fieldsOptions = utils.toFieldsOptions(config, {});
    assert.deepEqual(fieldsOptions, { id: { hidden: true } });
  });

  it('should generate formType fields form option', ()=> {
    const config = { schema: Depense.schema, formType: 'secure' };
    const fieldsOptions = utils.toFieldsOptions(config, {});

    const result = {
      justificatifs: {
        placeholder: 'Depense.placeholder.justificatifs',
        autoCapitalize: 'sentences',
        autoCorrect: false,
        factory: ImageFieldFactory,
      },
      description: {
        placeholder: 'Depense.placeholder.description',
        icon: 'description',
        autoCapitalize: 'sentences',
        autoCorrect: true,
        factory: TextboxFieldFactory
      },
      date: {
        placeholder: 'Depense.placeholder.date',
        format: 'dateFormat',
        autoCapitalize: 'sentences',
        autoCorrect: false,
        factory: DatepickerFieldFactory
      },
      montantARembourser: {
        placeholder: 'Depense.placeholder.montantARembourser',
        icon: 'ttc',
        iconEnd: 'devise',
        factory: TextboxFieldFactory,
        transformer: FloatTransformer,
        autoCapitalize: 'sentences',
        autoCorrect: false
      },
      tva: {
        placeholder: 'Depense.placeholder.tva',
        icon: 'tva',
        iconEnd: 'devise',
        transformer: FloatTransformer,
        autoCapitalize: 'sentences',
        autoCorrect: false,
        factory: TextboxFieldFactory
      },
      valeursAnalytiques: {
        api: 'axesAnalytiques',
        placeholder: 'Depense.placeholder.valeursAnalytiques',
        icon: 'label',
        autoCapitalize: 'sentences',
        autoCorrect: false,
      },
      id: { hidden: true }
    };

    assert.isNotNull(fieldsOptions.valeursAnalytiques.onCallApi);
    delete fieldsOptions.valeursAnalytiques.onCallApi;
    assert.deepEqual(fieldsOptions, result);
  });

});