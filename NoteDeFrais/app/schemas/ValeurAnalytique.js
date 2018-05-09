const Schema = {
  name: 'ValeurAnalytique',
  primaryKey: 'id',
  properties: {
    code: { type: 'string' },
    description: { type: 'string' },
    derniereModification: { type: 'date', optional: true },
    id: { type: 'string' },
    idAxeAnalytique: { type: 'string' },
    idGescabDossier: { type: 'string', optional: true }
  }
};

class ValeurAnalytique {
  static schema = Schema;
}

export default ValeurAnalytique;
