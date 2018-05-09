import moment from 'moment';
import Realm from 'realm';

export const STATUTS = {
  inProgress: {
    key: 'EnCours',
    totalKey: 'totalEnCours'
  },
  validation: {
    key: 'Validation',
    totalKey: 'totalValidation'
  },
  validated: {
    key: 'Validee',
    totalKey: 'totalValide'
  },
  refused: {
    key: 'Refusee',
    totalKey: 'totalRefuse'
  }
};

export default class NoteDeFrais extends Realm.Object {
  static schema = {
    name: 'NoteDeFrais',
    primaryKey: 'id',
    properties: {
      id: 'string',
      idCompte: 'string',
      description: { type: 'string', optional: true },
      statut: { type: 'string', default: STATUTS.inProgress.key },
      dateEnvoi: { type: 'date', optional: true },
      totalDepenses: { type: 'float', default: 0 },
      totalDistance: { type: 'float', default: 0 },
      totalIndemnitesKilometriques: { type: 'float', default: 0 },
      derniereModification: { type: 'date', optional: true },
      depenses: { type: 'list', objectType: 'Identifiant' },
      indemnitesKilometriques: { type: 'list', objectType: 'Identifiant' },
      _depreciation: { type: 'date', optional: true },
      _isSynchronized: { type: 'bool', default: true },
      _anneeCreation: { type: 'int', default: parseInt(moment(new Date()).format('YYYY'), 10) }
    }
  };
}

