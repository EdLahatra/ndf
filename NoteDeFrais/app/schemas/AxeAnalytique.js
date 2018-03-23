import { TYPE } from './Depense';

const Schema = {
  name: 'AxeAnalytique',
  primaryKey: 'id',
  properties: {
    description: { type: 'string' },
    valeurAnalytiques: { type: 'list', objectType: 'Identifiant' },
    derniereModification: { type: 'date', optional: true },
    idCompte: { type: 'string' },
    id: { type: 'string' }
  }
};

class AxeAnalytique {
  static schema = Schema;
}

export default AxeAnalytique;
