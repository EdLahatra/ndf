import moment from 'moment';
import _ from 'underscore';

import EntityService from './EntityService';
import Vehicule from '../schemas/Vehicule';
import Utils from '../lib/utils';

/**
 * Service de gestion des véhicules
 * @override {EntityService}
 */
export default class VehiculeService extends EntityService {
  /**
   * Initialisation du service
   */
  constructor() {
    super(Vehicule.schema);
  }

  findKilometrage(vehicule, date = new Date()) {
    let kilometeAnnuel = this.findKilometreAnnuel(vehicule, date);
    if (kilometeAnnuel) {
      return kilometeAnnuel.kilometrage;
    }

    this.service.write(() => {
      kilometeAnnuel = this._createKilometrageAnnuel(vehicule, date);
    });

    return kilometeAnnuel.kilometrage;
  }

  findKilometreAnnuel(vehicule, date = new Date()) {
    const annee = this.getAnnee(date);
    return _.toArray(vehicule.kilometreAnnuel).filter(ka => ka.annee === annee)[0];
  }

  findOrCreateKilometreAnnuel(vehicule, date = new Date(), kilometrage = 0) {
    const kilometreAnnuel = this.findKilometreAnnuel(vehicule, date);
    if (kilometreAnnuel) {
      return kilometreAnnuel;
    }

    return this._createKilometrageAnnuel(vehicule, date, kilometrage);
  }

  _createKilometrageAnnuel(vehicule, date, kilometrage = 0) {
    const annee = this.getAnnee(date);
    const ka = { annee, kilometrage };
    vehicule.kilometreAnnuel.push(ka);
    return ka;
  }

  getAnnee = date => parseInt(moment(date).format('YYYY'), 10);

  create(body) {
    const shouldUseApiService = this.compteSecureService.shouldUseApiService();
    const oldFavoris = body.favori ? this.service.objects(this.schema.name).filtered('favori = true') : [];
    this._listen(shouldUseApiService);

    body.id = Utils.uuid();

    this.service.write(() => {
      oldFavoris.forEach((vehicule) => {
        vehicule.favori = false;
        vehicule._isSynchronized = !shouldUseApiService;
        vehicule.derniereModification = new Date();
      });

      body._isSynchronized = !shouldUseApiService;
      body.derniereModification = new Date();
      this.service.create(this.schema.name, body);
    });

    this._removeListen(shouldUseApiService);
    return body.id;
  }

  /**
   * Réécriture pour mettre à jour les favoris
   * @param body
   * @returns {*}
   */
  update(body) {
    const shouldUseApiService = this.compteSecureService.shouldUseApiService();
    const oldFavoris = body.favori ? this.service.objects(this.schema.name).filtered('favori = true') : [];

    this._listen(shouldUseApiService);

    this.service.write(() => {
      oldFavoris.forEach((vehicule) => {
        vehicule.favori = false;
        vehicule._isSynchronized = !shouldUseApiService;
        vehicule.derniereModification = new Date();
      });

      body._isSynchronized = !shouldUseApiService;
      body.derniereModification = new Date();
      this.service.create(this.schema.name, body, true);
    });

    this._removeListen(shouldUseApiService);
    return body.id;
  }
}
