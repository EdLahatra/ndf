const TYPES = [
  'Voiture',
  'Cyclomoteur',
  'Motocyclette'
];

export default class Vehicule {
  static schema = {
    name: 'Vehicule',
    primaryKey: 'id',
    properties: {
      nom: { type: 'string' },
      immatriculation: { type: 'string' },
      kilometreAnnuel: { type: 'list', objectType: 'KilometreAnnuel' },
      typeVehicule: { type: 'string' },
      puissanceFiscale: { type: 'int' },
      favori: { type: 'bool', default: false },
      derniereModification: { type: 'date', optional: true },
      depreciation: { type: 'date', optional: true },
      id: { type: 'string' },
      idCompte: { type: 'string', optional: true },
      _isSynchronized: { type: 'bool', default: true }
    },
    _form: {
      nom: {},
      immatriculation: { autoCapitalize: 'characters' },
      typeVehicule: { enums: TYPES },
      puissanceFiscale: {},
      favori: {},
      idCompte: { hidden: true },
    }
  };
}
