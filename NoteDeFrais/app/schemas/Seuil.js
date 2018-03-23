export default class Seuil {

  static schema = {
    name: 'Seuil',
    properties: {
      mini: { type: 'int' },
      variable: { type: 'float' },
      fixe: { type: 'float' },
      puissanceFiscale: { type: 'int' },
    }

  }
}

