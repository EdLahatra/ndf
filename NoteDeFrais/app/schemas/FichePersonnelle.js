const Schema = {
  name: 'FichePersonnelle',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    idCompte: { type: 'string' },
    idComTiers: { type: 'string', optional: true },
    nom: { type: 'string' },
    prenom: { type: 'string', optional: true },
    societe: { type: 'string', optional: true },
    email: { type: 'string' },
    emailPdf: { type: 'string', optional: true },
    portable: { type: 'string', optional: true },
    adresse1: { type: 'string', optional: true },
    adresse2: { type: 'string', optional: true },
    codePostal: { type: 'string', optional: true },
    ville: { type: 'string', optional: true },
    pays: { type: 'string', optional: true },
    derniereModification: { type: 'date', optional: true },
    _isSynchronized: { type: 'bool', default: true }
  },
  _form: {
    secure: {
      nom: {},
      prenom: { optional: true },
      societe: { optional: true },
      email: { email: true },
      portable: { optional: true, phone: true },
      adresse1: { optional: true, autoCorrect: true },
      adresse2: { optional: true, autoCorrect: true },
      codePostal: { optional: true },
      ville: { optional: true, autoCorrect: true },
      pays: { optional: true, autoCorrect: true },
      idCompte: { hidden: true }
    },
    autonome: {
      nom: {},
      prenom: { optional: true },
      societe: { optional: true },
      email: { email: true },
      emailPdf: { email: true, optional: true },
      portable: { optional: true, phone: true },
      adresse1: { optional: true, autoCorrect: true },
      adresse2: { optional: true, autoCorrect: true },
      codePostal: { optional: true },
      ville: { optional: true, autoCorrect: true },
      pays: { optional: true, autoCorrect: true },
      idCompte: { hidden: true }
    }
  }

};

class FichePersonnelle {
  static schema = Schema;
}

export default FichePersonnelle;

