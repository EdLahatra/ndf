import { TYPE } from './Depense';

const icones = ['glyphicons-cutlery', 'glyphicons-gas-station', 'glyphicons-road', 'glyphicons-gift',
  'glyphicons-bed-alt', 'glyphicons-parking-meter', 'glyphicons-taxi', 'glyphicons-envelope', 'glyphicons-train',
  'glyphicons-shopping-cart', 'glyphicons-car', 'glyphicons-cars', 'glyphicons-bus', 'glyphicons-plane',
  'glyphicons-boat', 'glyphicons-drink', 'glyphicons-pizza', 'glyphicons-home', 'glyphicons-paperclip',
  'glyphicons-message-full', 'glyphicons-iphone', 'glyphicons-sweater', 'glyphicons-celebration',
  'glyphicons-charging-station', 'glyphicons-motorcycle', 'glyphicons-shoes', 'glyphicons-old-man',
  'glyphicons-woman', 'glyphicons-luggage', 'glyphicons-keys', 'glyphicons-t-shirt',
  'glyphicons-coffee-cup', 'glyphicons-earphone', 'glyphicons-disk-open', 'glyphicons-dining-set',
  'glyphicons-podcast'];

export default class CategorieDepense {

  static schema = {
    name: 'CategorieDepense',
    primaryKey: 'id',
    properties: {
      icone: { type: 'string' },
      nom: { type: 'string' },
      tva: { type: 'float', default: 0, optional: true },
      depreciation: { type: 'date', optional: true },
      derniereModification: { type: 'date' },
      idCompte: { type: 'string' },
      id: { type: 'string' }
    },
    _form: {
      idCompte: { hidden: true },
      icone: { enums: icones, type: 'icon' },
      nom: { icon: 'description', autoCorrect: true },
      tva: { icon: 'TVA', iconEnd: '  %  ' }
    }
  };

}

