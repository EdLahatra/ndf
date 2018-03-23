export default class Regulation {

  static schema = {
    name: 'Regulation',
    primaryKey: 'id',
    properties: {
      id: 'string',
      description: 'string',
      date: 'date',
      idNoteDeFrais: 'string',
      idVehicule: 'string',
      montantARembourser: 'float'
    }

  }
}

