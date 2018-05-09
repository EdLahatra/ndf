export const TYPES = {
  AUTONOME: 'Autonome',
  GOOGLE: 'Google',
  COMPTACOM: 'ComptaCom',
  GESCAB: 'Gescab'
};

export class Compte {
  static schema = {
    name: 'Compte',
    primaryKey: 'id',
    properties: {
      id: 'string',
      typeCompte: { type: 'string', default: TYPES.AUTONOME },
      derniereModification: { type: 'date', optional: true },
      noteDeFrais: { type: 'list', objectType: 'Identifiant' },
      idFichePersonnelle: { type: 'string', optional: true },
      vehicules: { type: 'list', objectType: 'Identifiant' }
    }
  };
}
