import Utils from '../lib/utils';

import CompteSecure  from '../schemas/CompteSecure';
import CategorieDepense  from '../schemas/CategorieDepense';
import Vehicule  from '../schemas/Vehicule';
import AxeAnalytique  from '../schemas/AxeAnalytique';
import NoteDeFrais  from '../schemas/NoteDeFrais';
import ValeurAnalytique  from '../schemas/ValeurAnalytique';
import IndemniteKilometrique  from '../schemas/IndemniteKilometrique';
import Justificatif  from '../schemas/Justificatif';
import Depense  from '../schemas/Depense';
import moment from 'moment';
import I18n from '../i18n/translations';
import RealmService  from './RealmService';

import { TYPES } from '../schemas/Compte';
import _ from 'underscore';

/**
 * Service de gestion des comptes sécurisés
 */
export default class CompteSecureService {

  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    /** @type {RealmService.service} */
    this.db = RealmService.service;
  }

  find (id) {
    return this.findAll().filter((compteSecure) => compteSecure.id === id)[0];
  }

  findAll () {
    return _.toArray(this.db.objects(CompteSecure.schema.name));
  }

  _unsetSelectedAccounts () {
    const allSelected = this.db.objects(CompteSecure.schema.name).filtered('isSelected = true');
    _.toArray(allSelected).forEach((s) => {
      s.isSelected = false;
    });
  }

  setSelected (compteSecure) {
    this.db.write(() => {
      this._unsetSelectedAccounts();
      compteSecure.isSelected = true;
    });

  }

  attachCompte (compteSecureId, compte) {
    const compteSecure = this.find(compteSecureId);
    this.db.write(() => {
      compteSecure.compte = compte;
    });
  }

  update ({ id }, { access_token, expires_in }) {
    const expirationDate = moment().add(expires_in, 's').toDate();
    const data = { id, access_token, expirationDate, isSelected: true };
    this.db.write(() => {
      this._unsetSelectedAccounts();
      this.db.create(CompteSecure.schema.name, data, true);
    });

    return id;
  }

  create ({ access_token, expires_in }, typeCompte = TYPES.AUTONOME, compteSecureId = null) {

    if (compteSecureId) {
      const exist = this.find(compteSecureId);
      if (exist) {
        if (access_token && expires_in) {
          const expirationDate = moment().add(expires_in, 's').toDate();
          const data = { id: compteSecureId, access_token, expirationDate, isSelected: true };
          this.db.write(() => {
            this._unsetSelectedAccounts();
            this.db.create(CompteSecure.schema.name, data, true);
          });
        }
        return compteSecureId;
      }
    }

    if (access_token && expires_in) {

      const generatedId = compteSecureId || Utils.uuid();
      const expirationDate = moment().add(expires_in, 's').toDate();
      const data = { id: generatedId, access_token, expirationDate, isSelected: true, typeCompte };
      this.db.write(() => {
        this._unsetSelectedAccounts();
        this.db.create(CompteSecure.schema.name, data);
      });
      return generatedId;
    }
    else {

      let compteAutonome = this.db.objects('Compte').filtered(`typeCompte = "${TYPES.AUTONOME}"`)[0];
      let idCompte = null;
      if (compteAutonome) {
        idCompte = compteAutonome.id;
      }
      else {
        idCompte = Utils.uuid();
        this.db.write(() => {
          this.db.create('Compte', { id: idCompte });
        });
        compteAutonome = this.db.objects('Compte').filtered(`id = "${idCompte}"`)[0];
      }

      const filtered = this.findAll().filter((secure) => secure.compte.id === idCompte);

      if (filtered && filtered[0]) {
        return filtered[0].id;
      }

      const generatedId = Utils.uuid();

      const defaultCategories = this._getDefaultCategories();

      this.db.write(() => {
        defaultCategories.forEach((categorie) => {
          categorie.idCompte = idCompte;
          this.db.create(CategorieDepense.schema.name, categorie, true);
        });
      });

      const compteSecure = { id: generatedId, isSelected: true, compte: compteAutonome, typeCompte };
      this.db.write(() => {
        this._unsetSelectedAccounts();
        this.db.create(CompteSecure.schema.name, compteSecure);
      });

      return generatedId;
    }

  }

  shouldManageCategories () {
    const compteSecure = this.getSelectedAccount();
    return compteSecure ? compteSecure.typeCompte === TYPES.AUTONOME : false;
  }

  shouldSkipAuthentication () {
    const compteSecure = this.getSelectedAccount();
    if (compteSecure) {
      return this.shouldUseApiServiceWith(compteSecure) || compteSecure.compte !== null && !!compteSecure.compte.idFichePersonnelle;
    }
    return false;
  }

  shouldUseApiService () {
    const compteSecure = this.getSelectedAccount();
    return this.shouldUseApiServiceWith(compteSecure);
  }

  shouldUseApiServiceWith (compteSecure) {
    if (compteSecure) {
      return compteSecure.compte === null || (compteSecure.typeCompte === TYPES.COMPTACOM || compteSecure.typeCompte === TYPES.GESCAB)
          && !!compteSecure.access_token;
    }
    return false;
  }

  getSelectedAccount () {
    return this.db.objects(CompteSecure.schema.name).filtered('isSelected = true')[0];
  }

  shouldFetchAll () {
    if (this.shouldUseApiService()) {
      const compteSecure = this.getSelectedAccount();
      const lastFetchAll = compteSecure.lastFetchAll;
      if (lastFetchAll) {
        const previousWeek = moment().subtract(7, 'days');
        return moment(lastFetchAll).isBefore(previousWeek);
      }
      else {
        return true;
      }
    }
    return false;
  }

  delete (compteSecure) {

    let filterByIdCompte = null;
    if (compteSecure.compte) {
      const idCompte = compteSecure.compte.id;
      filterByIdCompte = `idCompte = "${idCompte}"`;
    }

    this.db.write(() => {

      if (filterByIdCompte) {
        // Suppression des catégories
        this.db.delete(this.db.objects(CategorieDepense.schema.name).filtered(filterByIdCompte));

        // Suppression des véhicules
        const vehicules = this.db.objects(Vehicule.schema.name).filtered(filterByIdCompte);
        vehicules.forEach((vehicule) => {
          this.db.delete(vehicule.kilometreAnnuel);
        });
        this.db.delete(vehicules);

        // Suppression des véhicules
        const axes = this.db.objects(AxeAnalytique.schema.name).filtered(filterByIdCompte);
        axes.forEach((axe) => {
          this.db.delete(this.db.objects(ValeurAnalytique.schema.name).filtered(`idAxeAnalytique = "${axe.id}"`));
          this.db.delete(axe.valeurAnalytiques);
        });
        this.db.delete(axes);

        // Suppression des ndf
        const ndfs = this.db.objects(NoteDeFrais.schema.name).filtered(filterByIdCompte);
        ndfs.forEach((ndf) => {
          const filterByIdNdf = `idNoteDeFrais = "${ndf.id}"`;
          // Suppression des ik
          this.db.delete(this.db.objects(IndemniteKilometrique.schema.name).filtered(filterByIdNdf));
          this.db.delete(ndf.indemnitesKilometriques);
          // Suppression des depenses
          const depenses = this.db.objects(Depense.schema.name).filtered(filterByIdNdf);
          depenses.forEach((depense) => {
            this.db.delete(this.db.objects(Justificatif.schema.name).filtered(`idDepense = "${depense.id}"`));
          });
          this.db.delete(depenses);
          this.db.delete(ndf.depenses);
        });
        this.db.delete(ndfs);

        // Suppression des comptes
        this.db.delete(compteSecure.compte);
      }
      this.db.delete(compteSecure);
    });
    const all = this.findAll();
    if (all && all[0]) {
      this.setSelected(all[0]);
      return all[0];
    }
    return null;
  }

  setFetchAll (date) {
    const compteSecure = this.getSelectedAccount();
    this.db.write(() => {
      compteSecure.lastFetchAll = date;
    });
  }

  getAccessToken () {
    const compteSecure = this.getSelectedAccount();
    if (compteSecure && compteSecure.access_token) {
      return compteSecure.access_token;
    }
    throw new Error(['[CompteSecureService]', 'No access token found for', compteSecure.id].join(' '));
  }

  hasExpiredToken () {
    const compteSecure = this.getSelectedAccount();
    if (compteSecure && compteSecure.expirationDate) {
      return moment(compteSecure.expirationDate).isBefore(moment());
    }
    return true;
  }

  _lastFetchAllKey (name) {
    return `lastFetchAll${name}`;
  }

  getLastFetchAll (name) {
    return this.getSelectedAccount()[this._lastFetchAllKey(name)];
  }

  setLastFetchAll (name, date) {
    this.db.write(() => {
      this.getSelectedAccount()[this._lastFetchAllKey(name)] = date;
    });
  }

  _getDefaultCategories () {

    return [
      {
        id: 'categories.addRestaurant',
        nom: I18n.t('categories.addRestaurant'),
        derniereModification: new Date(),
        icone: 'glyphicons-cutlery',
        tva: 10
      }, {
        id: 'categories.gasFees',
        nom: I18n.t('categories.gasFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-gas-station',
        tva: 20
      }, {
        id: 'categories.roadFees',
        nom: I18n.t('categories.roadFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-road',
        tva: 20
      }, {
        id: 'categories.giftFees',
        nom: I18n.t('categories.giftFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-gift',
        tva: 20
      }, {
        id: 'categories.bedFees',
        nom: I18n.t('categories.bedFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-bed-alt',
        tva: 10
      }, {
        id: 'categories.parkingFees',
        nom: I18n.t('categories.parkingFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-parking-meter',
        tva: 20
      }, {
        id: 'categories.taxiFees',
        nom: I18n.t('categories.taxiFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-taxi',
        tva: 0
      }, {
        id: 'categories.postFees',
        nom: I18n.t('categories.postFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-envelope',
        tva: 0
      }, {
        id: 'categories.trainFees',
        nom: I18n.t('categories.trainFees'),
        derniereModification: new Date(),
        icone: 'glyphicons-train',
        tva: 0
      }];
  }

}