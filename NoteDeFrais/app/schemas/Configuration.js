export default class Configuration {
  static schema = {
    name: 'Configuration',
    primaryKey: 'id',
    properties: {
      id: { type: 'string' },
      isAcceptedTerms: { type: 'bool', default: false },
      dateOfTerms: { type: 'date', default: new Date() }
    }
  }
}
