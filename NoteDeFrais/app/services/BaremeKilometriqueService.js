import _ from 'underscore';
import moment from 'moment';
import EntityService from './EntityService';
import BaremeKilometrique from '../schemas/BaremeKilometrique';
/**
 * Service de gestion des barêmes kilométriques
 * @override {EntityService}
 */
export default class BaremeKilometriqueService extends EntityService {
  /**
   * Initialisation du service
   */
  constructor() {
    super(BaremeKilometrique.schema);
  }

  /**
   * Méthode de recherche d'un véhicule en fonction du type
   * @param typeVehicule
   * @param date
   * @returns {*}
   */
  findByTypeVehicule(typeVehicule, date) {
    const all = this.findAll(`typeVehicule=="${typeVehicule}"`);

    if (all.length === 0) {
      throw new Error('Aucun barême kilométrique trouvé avec ces attributs');
    }

    const mDate = moment(date);
    const baremes = _.toArray(all).filter(bk => mDate.isBetween(moment(bk.debut), moment(bk.fin)));

    if (baremes.length === 0) {
      return this.findByTypeVehicule(typeVehicule, mDate.subtract(1, 'year').toDate());
    }
    mDate;

    return baremes[0];
  }

  /**
   * Méthode de recherche d'un seuil
   * @param baremeKilometrique
   * @param puissanceFiscale
   * @param kilometrage
   * @returns {*}
   */
  findSeuil(baremeKilometrique, puissanceFiscale, kilometrage = 0) {
    const seuils = _.filter(_.toArray(baremeKilometrique.seuils),
      seuil => seuil.puissanceFiscale <= puissanceFiscale && seuil.mini <= kilometrage);
    return _.max(seuils, seuil => seuil.puissanceFiscale + seuil.mini);
  }
}
