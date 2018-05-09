export default class IndemniteKilometrique {
  static schema = {
    name: 'IndemniteKilometrique',
    primaryKey: 'id',
    properties: {
      _depart: { type: 'string', optional: true },
      lieu: { type: 'string' },
      idVehicule: { type: 'string' },
      date: { type: 'date' },
      distance: { type: 'float', default: 0 },
      montantARembourser: { type: 'float', default: 0 },
      derniereModification: { type: 'date', default: new Date(), optional: true },
      idCategorieDepense: { type: 'string', optional: true },
      idNoteDeFrais: { type: 'string', },
      valeursAnalytiques: { type: 'list', objectType: 'Identifiant' },
      id: { type: 'string' },
      _isSynchronized: { type: 'bool', default: true },
      _depreciation: { type: 'date', optional: true }
    },
    _form: {
      secure: {
        _depart: { icon: 'place', api: 'places' },
        lieu: { icon: 'place', api: 'places' },
        idVehicule: { icon: 'directions-car', optionType: 'idVehicule' },
        date: { icon: 'date-range', iconEnd: 'arrow-drop-down' },
        distance: { icon: 'keyboard-tab', api: 'distance-matrix' },
        valeursAnalytiques: { icon: 'label', api: 'axesAnalytiques', optional: true }
      },
      autonome: {
        _depart: { icon: 'place', api: 'places' },
        lieu: { icon: 'place', api: 'places' },
        idVehicule: { icon: 'directions-car', optionType: 'idVehicule' },
        date: { icon: 'date-range', iconEnd: 'arrow-drop-down' },
        distance: { icon: 'keyboard-tab', api: 'distance-matrix' }
      }
    }
  }
}
