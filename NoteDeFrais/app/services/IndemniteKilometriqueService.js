import _ from 'underscore';

import EntityService from './EntityService';
import IndemniteKilometrique from '../schemas/IndemniteKilometrique';
import BaremeKilometriqueService from './BaremeKilometriqueService';
import CompteSecureService from './CompteSecureService';
import VehiculeService from './VehiculeService';


/**
 * Service de gestion des indemnités kilométriques
 * @override {EntityService}
 */
export default class IndemniteKilometriqueService extends EntityService {
  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super(IndemniteKilometrique.schema);
    /** @type {BaremeKilometriqueService} */
    this.baremeKilometriqueService = new BaremeKilometriqueService();
    /** @type {VehiculeService} */
    this.vehiculeService = new VehiculeService();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
  }

  parseTaux(value) {
    if (value) {
      value = parseFloat(value).toFixed(3);
    }
    return value;
  }

  _computeMontantARembourser({ idVehicule, distance, date }) {
    const vehicule = this.vehiculeService.find(idVehicule);
    const kilometrage = this.vehiculeService.findKilometrage(vehicule, date);
    const bareme = this.baremeKilometriqueService.findByTypeVehicule(vehicule.typeVehicule, date);
    const seuil = this.baremeKilometriqueService
      .findSeuil(bareme, vehicule.puissanceFiscale, this.parseTaux(kilometrage));
    if (seuil) {
      return this.parseFloat(distance * seuil.variable);
    }

    throw new Error('No seuil found');
  }

  deleteAll(idList, ndf) {
    idList.forEach((id) => {
      const object = this.find(id);
      if (object) {
        this.delete(object, ndf);
      }
    });
  }

  delete(body, ndf) {
    const ikList = _.toArray(ndf.indemnitesKilometriques).filter(ik => ik.id !== body.id);
    const id = super.delete(body);

    this.service.write(() => {
      ndf.indemnitesKilometriques = null;
      if (ikList) {
        ikList.forEach((ik) => {
          ndf.indemnitesKilometriques.push({ id: ik.id });
        });
      }
    });
    return id;
  }

  update(body) {
    body.montantARembourser = this._computeMontantARembourser(body);
    return super.update(body);
  }

  create(body, ndf) {
    body.idNoteDeFrais = ndf.id;
    body.idCompte = ndf.idCompte;
    body.montantARembourser = this._computeMontantARembourser(body);

    const id = super.create(body);
    this.service.write(() => {
      ndf.indemnitesKilometriques.push({ id });
    });
    return id;
  }
}
