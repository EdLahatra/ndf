import _ from 'underscore';
import moment from 'moment';
import EntityService from './EntityService';
import NoteDeFrais, { STATUTS } from '../schemas/NoteDeFrais';
import DepenseService from './DepenseService';
import IndemniteKilometriqueService from './IndemniteKilometriqueService';
import FichePersonnelleService from './FichePersonnelleService';
import BaremeKilometriqueService from './BaremeKilometriqueService';
import CategorieDepenseService from './CategorieDepenseService';
import JustificatifService from './JustificatifService';
import VehiculeService from './VehiculeService';
import { TYPES, Compte } from '../schemas/Compte';
import utils from '../lib/utils';
import I18n from '../i18n/translations';
import Logger from '../lib/Logger';

/**
 * Service de gestion des notes de frais
 * @override {EntityService}
 */
export default class NoteDeFraisService extends EntityService {
  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super(NoteDeFrais.schema);
    /** @type {DepenseService} */
    this.depenseService = new DepenseService();
    /** @type {BaremeKilometriqueService} */
    this.baremeKilometriqueService = new BaremeKilometriqueService();
    /** @type {IndemniteKilometriqueService} */
    this.indemniteKilometriqueService = new IndemniteKilometriqueService();
    /** @type {VehiculeService} */
    this.vehiculeService = new VehiculeService();
    /** @type {FichePersonnelleService} */
    this.fichePersonnelleService = new FichePersonnelleService();
    /** @type {CategorieDepenseService} */
    this.categorieDepenseService = new CategorieDepenseService();
    /** @type {JustificatifService} */
    this.justificatifService = new JustificatifService();
  }

  delete() {
    throw new Error('Delete is not possible on ', this.schema.name);
  }

  findAllDepenses(noteDeFrais) {
    return this.findAllAutresDepenses(noteDeFrais)
      .concat(this.findAllIndemnitesKilometriques(noteDeFrais))
      .concat(this.findAllRegulation(noteDeFrais))
      .sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? 1 : -1);
  }

  findAllIndemnitesKilometriquesWithRegulation(noteDeFrais) {
    return this.findAllIndemnitesKilometriques(noteDeFrais)
      .concat(this.findAllRegulation(noteDeFrais))
      .sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? 1 : -1);
  }

  _findAllDepenses(noteDeFrais, type, service) {
    if (noteDeFrais) {
      return _.toArray(noteDeFrais[type]).map(({ id }) => service.find(id)).filter(value => value !== null);
    }
    return [];
  }

  async envoiNoteDeFrais(ndf, compte) {
    const body = this.format(ndf);
    body.compte = this.format(compte, Compte.schema);
    body.compte.fichePersonnelle = this.fichePersonnelleService.findAndFormat(compte.idFichePersonnelle);
    delete body.idCompte;
    delete body.compte.idFichePersonnelle;

    body.depenses = this.findAllAutresDepenses(ndf).map((depense) => {
      const formatted = this.depenseService.format(depense);

      formatted.categorieDepense = this.categorieDepenseService.findAndFormat(depense.idCategorieDepense);
      formatted.justificatifs = _.toArray(depense.justificatifs)
        .map(justificatif => this.justificatifService.findAndFormat(justificatif.id));

      delete formatted.idNoteDeFrais;
      delete formatted.idCategorieDepense;
      delete formatted.valeursAnalytiques;
      return formatted;
    });
    body.indemnitesKilometriques = this.findAllIndemnitesKilometriques(ndf).map((ik) => {
      const formatted = this.indemniteKilometriqueService.format(ik);

      formatted.vehicule = this.vehiculeService.findAndFormat(formatted.idVehicule);
      formatted.categorieDepense = this.categorieDepenseService.findAndFormat(ik.idCategorieDepense) || {};

      delete formatted.valeursAnalytiques;
      delete formatted.idVehicule;
      delete formatted.idCategorieDepense;
      delete formatted.idNoteDeFrais;

      return formatted;
    });

    try {
      await this.apiService.post('envoiNoteDeFrais', body);
    } catch (e) {
      Logger.error(e);
    }
  }

  updateTotal(ndf) {
    const id = ndf.id;
    const totalDepenses = this.getSum(this.findAllAutresDepenses(ndf));
    const allIndemnitesKilometriques = this.findAllIndemnitesKilometriquesWithRegulation(ndf);
    const totalIndemnitesKilometriques = this.getSum(allIndemnitesKilometriques);
    const totalDistance = this.getTotalDistance(allIndemnitesKilometriques);
    return this.update({ id, totalDepenses, totalIndemnitesKilometriques, totalDistance });
  }

  async mergeAll() {
    const elements = await super.mergeAll();
    const currentElements = elements.filter(element => element.statut === STATUTS.inProgress.key);
    if (currentElements && currentElements.length > 0) {
      const currentNdf = currentElements[0];
      const filter = `id != "${currentNdf.id}" AND statut="${STATUTS.inProgress.key}" AND idCompte="${currentNdf.idCompte}"`;
      const ndfToMerge = this.service.objects(this.schema.name).filtered(filter);

      _.toArray(ndfToMerge).forEach((ndf) => {
        _.toArray(ndf.depenses).forEach((depense) => {
          this.depenseService.update(depense, currentNdf);
        });

        _.toArray(ndf.indemnitesKilometriques).forEach((ik) => {
          this.indemniteKilometriqueService.update(ik, currentNdf);
        });
      });

      this.service.write(() => {
        this.service.delete(ndfToMerge);
      });
    }
    return elements;
  }

  findAllIndemnitesKilometriques(noteDeFrais) {
    return this._findAllDepenses(noteDeFrais, 'indemnitesKilometriques', this.indemniteKilometriqueService);
  }

  findAllAutresDepenses(noteDeFrais) {
    return this._findAllDepenses(noteDeFrais, 'depenses', this.depenseService);
  }

  findAllRegulation(noteDeFrais) {
    if (noteDeFrais) {
      return _.toArray(this.service.objects('Regulation').filtered(`idNoteDeFrais = "${noteDeFrais.id}"`));
    }
    return [];
  }

  findEnCours(compte) {
    const _idsToRemove = compte.noteDeFrais.map(ndf => `id != "${ndf.id}"`);
    const filterIdsToRemove = _idsToRemove && _idsToRemove.length > 0 ? `AND (${_idsToRemove.join(' AND ')})` : '';
    const ndfToRemove = this.service.objects(this.schema.name).filtered(`idCompte = "${compte.id}" ${filterIdsToRemove}`);
    this.service.write(() => {
      this.service.delete(ndfToRemove);
    });

    const _ids = compte.noteDeFrais.map(ndf => `id = "${ndf.id}"`);
    const filterIds = _ids && _ids.length > 0 ? `AND (${_ids.join(' OR ')})` : '';

    const filter = `idCompte = "${compte.id}" AND statut = "${STATUTS.inProgress.key}" ${filterIds}`;
    const ndfEnCours = this.service.objects(this.schema.name).filtered(filter);

    if (ndfEnCours.length > 1) {
      Logger.error(`Plusieurs note de frais en cours pour pour le compte ${compte.id}`);
    }

    if (ndfEnCours[0]) {
      return ndfEnCours[0].id;
    }

    const id = this.create({ idCompte: compte.id });
    this.service.write(() => {
      compte.noteDeFrais.push({ id });
    });
    return id;
  }

  getTotalDistance(ikList) {
    return this.getSum(ikList, 'distance');
  }

  getTotalDepenses(depenseCommuneList) {
    return this.getSum(depenseCommuneList);
  }

  getSum(depenseCommuneList, property = 'montantARembourser') {
    return this.parseFloat(_.reduce(depenseCommuneList, (memo, num) => memo + this.parseFloat(num[property]), 0));
  }

  validate(compte, ndfEnCours) {
    const fichePersonnelle = this.fichePersonnelleService.findAndFormat(compte.idFichePersonnelle);

    if (Boolean(fichePersonnelle.email) === false || Boolean(fichePersonnelle.nom) === false) {
      throw new Error(I18n.t('NoteDeFrais.emptyFichePersonnelleError'));
    }

    if (_.isEmpty(ndfEnCours.indemnitesKilometriques) && _.isEmpty(ndfEnCours.depenses)) {
      throw new Error(I18n.t('NoteDeFrais.emptyDepenseError'));
    }

    const allIndemnitesKilometriques = this.findAllIndemnitesKilometriques(ndfEnCours);

    const totalDepenses = this.getTotalDepenses(this.findAllAutresDepenses(ndfEnCours));
    const totalIndemnitesKilometriques = this.getTotalDepenses(allIndemnitesKilometriques);
    const totalDistance = this.getTotalDistance(allIndemnitesKilometriques);

    let statut = STATUTS.validated.key;
    if (this.compteSecureService.shouldUseApiService()) {
      statut = STATUTS.validation.key;
    }
    const ndf = {
      id: ndfEnCours.id,
      statut,
      totalDepenses,
      totalIndemnitesKilometriques,
      totalDistance,
      dateEnvoi: new Date(),
      derniereModification: new Date(),
      _isSynchronized: !this.compteSecureService.shouldUseApiService()
    };

    this.service.write(() => {
      this.service.create(this.schema.name, ndf, true);
    });

    if (compte.typeCompte !== TYPES.AUTONOME) {
      return this.find(this.findEnCours(compte));
    }

    // Récupérer l'ensemble des iks
    // Trier par véhicule
    // Total par véhicule
    // Si le total par véhicule + total annuel ne donne pas le même bareme que le total annuel.
    // Alors Créer une régulation en calculant la différence entre le total annuel +
    // le total ndf de l'ancien bareme avec le nouveau bareme

    const ikByVehicule = _.groupBy(allIndemnitesKilometriques, ik => ik.idVehicule);

    _.keys(ikByVehicule).forEach((idVehicule) => {
      const ikList = ikByVehicule[idVehicule];
      const totalDistance = this.getTotalDistance(ikList);
      const totalBeforeValidation = this.getTotalDepenses(ikList);
      const vehicule = this.vehiculeService.find(idVehicule);
      const kilometreAnnuel = this.vehiculeService.findOrCreateKilometreAnnuel(vehicule, new Date());
      const kilometrage = kilometreAnnuel.kilometrage;

      const kilometrageAfterValidation = this.parseFloat(kilometrage + totalDistance);

      const computedIkList = _.map(ikList, (ik) => {
        const bareme = this.baremeKilometriqueService.findByTypeVehicule(vehicule.typeVehicule, ik.date);
        const seuil = this.baremeKilometriqueService.findSeuil(bareme, vehicule.puissanceFiscale, kilometrageAfterValidation);
        return { montantARembourser: this.parseFloat(ik.distance * seuil.variable) };
      });

      const totalAfterValidation = this.getSum(computedIkList);

      if (totalAfterValidation !== totalBeforeValidation) {
        const previousBareme = this.baremeKilometriqueService.findByTypeVehicule(vehicule.typeVehicule, new Date());
        const previousSeuil = this.baremeKilometriqueService.findSeuil(previousBareme, vehicule.puissanceFiscale, kilometrage);
        const nextSeuil = this.baremeKilometriqueService.findSeuil(
          previousBareme, vehicule.puissanceFiscale, kilometrageAfterValidation);

        const previousTotal = this.parseFloat(kilometrage * previousSeuil.variable) + previousSeuil.fixe;
        const nextTotal = this.parseFloat(kilometrage * nextSeuil.variable) + nextSeuil.fixe;
        // eslint-disable-next-line
        const montantARembourser = this.parseFloat(totalAfterValidation - totalBeforeValidation + nextTotal - previousTotal);

        const regulation = {
          id: utils.uuid(),
          description: I18n.t('NoteDeFrais.regulationIndemniteKilometrique', { vehicule: vehicule.nom }),
          date: new Date(),
          idNoteDeFrais: ndf.id,
          idVehicule,
          montantARembourser
        };

        this.service.write(() => {
          this.service.create('Regulation', regulation);
          // Mise à jour du vehicule
          kilometreAnnuel.kilometrage = kilometrageAfterValidation;
          vehicule.derniereModification = new Date();
          const totalIndemnitesKilometriquesApresRegulation = this.parseFloat(totalIndemnitesKilometriques + montantARembourser);
          this.service.create(this.schema.name, {
            id: ndf.id,
            totalIndemnitesKilometriques: totalIndemnitesKilometriquesApresRegulation
          }, true);
        });
      } else {
        this.service.write(() => {
          // Mise à jour du vehicule
          kilometreAnnuel.kilometrage = kilometrageAfterValidation;
          vehicule.derniereModification = new Date();
        });
      }
    });

    this.envoiNoteDeFrais(this.find(ndf.id), compte);

    return this.find(this.findEnCours(compte));
  }

  getRapport(compte) {
    const rapport = _.keys(STATUTS)
      .filter((status) => {
        if (compte.typeCompte === TYPES.AUTONOME) {
          const statusKey = STATUTS[status].key;
          return statusKey === STATUTS.inProgress.key || statusKey === STATUTS.validated.key;
        }
        return true;
      })
      .map((status) => {
        let num = 0;
        if (STATUTS[status].key === STATUTS.inProgress.key) {
          const ndf = this.find(this.findEnCours(compte));
          num = I18n.toCurrency(ndf.totalDepenses + ndf.totalIndemnitesKilometriques);
        } else {
          const all = this.service.objects(this.schema.name);
          const ndf = all.filtered(`idCompte = "${compte.id}" AND statut = "${STATUTS[status].key}"`);
          num = ndf.length;
        }

        return { status, num };
      });
    return rapport;
  }

  findAllForAccountAndStatus(idCompte, statut) {
    return this.service.objects(this.schema.name).filtered(`statut="${statut}" AND idCompte="${idCompte}"`);
  }

  getFirstDepenseCommuneDate(depenseCommuneList) {
    if (depenseCommuneList && depenseCommuneList.length) {
      const sortedList = _.sortBy(depenseCommuneList, 'date');
      return sortedList[0].date;
    }
    return null;
  }

  getLastDepenseCommuneDate(depenseCommuneList) {
    if (depenseCommuneList && depenseCommuneList[0]) {
      const sortedList = _.sortBy(depenseCommuneList, 'date');
      const index = sortedList.length > 0 ? sortedList.length - 1 : 0;
      return sortedList[index].date;
    }
    return null;
  }
}
