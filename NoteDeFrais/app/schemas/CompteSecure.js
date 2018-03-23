import { TYPES } from '../schemas/Compte';

export default class CompteSecure {

  static schema = {
    name: 'CompteSecure',
    primaryKey: 'id',
    properties: {
      id: 'string',
      access_token: { type: 'string', optional: true },
      expirationDate: { type: 'date', optional: true },
      compte: { type: 'Compte', optional: true },
      isSelected: { type: 'bool', default: false },
      typeCompte: { type: 'string', default: TYPES.AUTONOME },
      lastFetchAll: { type: 'date', optional: true },
      lastFetchAllAxeAnalytique: { type: 'date', optional: true },
      lastFetchAllBaremeKilometrique: { type: 'date', optional: true },
      lastFetchAllCategorieDepense: { type: 'date', optional: true },
      lastFetchAllCompte: { type: 'date', optional: true },
      lastFetchAllDepense: { type: 'date', optional: true },
      lastFetchAllFichePersonnelle: { type: 'date', optional: true },
      lastFetchAllIndemniteKilometrique: { type: 'date', optional: true },
      lastFetchAllJustificatif: { type: 'date', optional: true },
      lastFetchAllNoteDeFrais: { type: 'date', optional: true },
      lastFetchAllValeurAnalytique: { type: 'date', optional: true },
      lastFetchAllVehicule: { type: 'date', optional: true }
    }
  }

}
