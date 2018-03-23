export default class Justificatif {

  static schema = {
    name: 'Justificatif',
    primaryKey: 'id',
    properties: {
      id: 'string',
      idDepense: 'string',
      data: 'string',
      derniereModification: { type: 'date', optional: true },
      _isSynchronized: { type: 'bool', default: true },
      _depreciation: { type: 'date', optional: true }
    }
  }

}
