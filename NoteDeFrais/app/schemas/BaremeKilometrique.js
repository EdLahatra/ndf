export default class BaremeKilometrique {
  static schema = {
    name: 'BaremeKilometrique',
    primaryKey: 'id',
    properties: {
      id: { type: 'string' },
      debut: { type: 'date' },
      fin: { type: 'date' },
      typeVehicule: { type: 'string', indexed: true },
      derniereModification: { type: 'date', default: new Date() },
      nom: { type: 'string', optional: true },
      seuils: { type: 'list', objectType: 'Seuil' }
    }
  }
}
