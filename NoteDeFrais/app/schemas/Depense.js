import I18n from '../i18n/translations';

export default class Depense {
  static schema = {
    name: 'Depense',
    primaryKey: 'id',
    properties: {
      justificatifs: { type: 'list', objectType: 'Identifiant' },
      description: { type: 'string' },
      date: { type: 'date' },
      montantARembourser: { type: 'float', default: 0 },
      codeTva: { type: 'string', default: 'ok' },
      tva: { type: 'float', default: 0, optional: true },
      ht: { type: 'float', default: 0, optional: true },
      derniereModification: { type: 'date', default: new Date(), optional: true },
      idCategorieDepense: { type: 'string', },
      idNoteDeFrais: { type: 'string', },
      valeursAnalytiques: { type: 'list', objectType: 'Identifiant' },
      id: { type: 'string' },
      _isSynchronized: { type: 'bool', default: true },
      _depreciation: { type: 'date', optional: true }
    },
    _form: {
      secure: {
        justificatifs: {},
        description: { icon: 'description', autoCorrect: true },
        date: {},
        montantARembourser: { icon: 'ttc', iconEnd: `${I18n.t('devise')}` },
        tva: { icon: 'tva', iconEnd: `${I18n.t('devise')}` },
        valeursAnalytiques: {
          icon: 'label', type: 'string', api: 'axesAnalytiques', optional: true
        }
      },
      autonome: {
        justificatifs: {},
        description: { icon: 'description', autoCorrect: true },
        date: {},
        montantARembourser: { icon: 'ttc', iconEnd: `${I18n.t('devise')}` },
        tva: { icon: 'tva', iconEnd: `${I18n.t('devise')}` }
      }

    }
  };
}
