
import _ from 'underscore';
import { Actions, } from 'react-native-router-flux';

import RealmForm from '../components/realm-form';
import Vehicule from '../schemas/Vehicule';
import I18n from '../i18n/translations';

import VehiculeService from '../services/VehiculeService';

/**
 * Page du formulaire de véhicule
 *
 * @module app/routes/VehiculeForm.js
 * @override app/components/RealmForm
 */
export default class VehiculeForm extends RealmForm {
  getStateValue() {
    const car = _.clone(this.props.car);
    return car || { puissanceFiscale: '', idCompte: this.props.account.id };
  }

  getConfig() {
    return { schema: Vehicule.schema };
  }

  static vehiculeService = new VehiculeService();

  static getTitle(props) {
    return props.vehicule ? props.vehicule.nom : I18n.t('account.addCar');
  }

  static shouldDelete(props) {
    if (props.car) {
      return true;
    }
    return false;
  }

  static delete(formValues, props) {
    this.vehiculeService.delete(formValues);
    Actions.pop({ refresh: { account: props.account } });
  }

  static save(props, formValues) {
    if (formValues.id) {
      this.vehiculeService.update(formValues);
      Actions.pop({ refresh: {} });
    } else {
      this.vehiculeService.create(formValues);
      Actions.pop({ refresh: { addCar: true } });
    }
  }
}
