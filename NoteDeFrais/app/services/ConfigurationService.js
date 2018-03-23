import Realm from './RealmService'
import Configuration from '../schemas/Configuration';

/**
 * Service de gestion de la configuration
 * @override {EntityService}
 */
export default class ConfigurationService {

  constructor () {
    this.realm = Realm.service;
    this.id = 'Configuration';
  }

  getConfiguration () {
    return this.realm.objects(Configuration.schema.name).filtered(`id="${this.id}"`)[0];
  }

  hasAcceptedTermsOfUse () {
    const Configuration = this.getConfiguration();
    return Configuration ? Configuration.isAcceptedTerms : false;
  }

  acceptTermsOfUse () {
    this.realm.write(() => {
      this.realm.create(Configuration.schema.name, { id: this.id, isAcceptedTerms: true });
    });
  }

}