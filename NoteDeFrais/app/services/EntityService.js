import RealmService from '../services/RealmService';
import CompteSecureService from '../services/CompteSecureService';
import ConfigurationService from '../services/ConfigurationService';
import ApiService from '../services/ApiService';
import Utils from '../lib/utils';
import moment from 'moment';
import _ from 'underscore';
import ApiServiceAccess from '../errors/ApiServiceAccess';
import NotFoundException from '../errors/NotFoundException';

const API_PATH_CONFIG = {
  'AxeAnalytique': {
    apiPath: 'axesAnalytiques',
    entity: require('../schemas/AxeAnalytique')
  },
  'BaremeKilometrique': {
    apiPath: 'baremesKilometriques',
    entity: require('../schemas/BaremeKilometrique')
  },
  'CategorieDepense': {
    apiPath: 'categoriesDepenses',
    entity: require('../schemas/CategorieDepense')
  },
  'Compte': {
    apiPath: 'comptes',
    entity: require('../schemas/Compte')
  },
  'Depense': {
    apiPath: 'depenses',
    entity: require('../schemas/Depense')
  },
  'FichePersonnelle': {
    apiPath: 'fichesPersonnelles',
    entity: require('../schemas/FichePersonnelle')
  },
  'IndemniteKilometrique': {
    apiPath: 'indemnitesKilometriques',
    entity: require('../schemas/IndemniteKilometrique')
  },
  'Justificatif': {
    apiPath: 'justificatifs',
    entity: require('../schemas/Justificatif')
  },
  'KilometreAnnuel': {
    entity: require('../schemas/KilometreAnnuel')
  },
  'NoteDeFrais': {
    apiPath: 'notesDeFrais',
    entity: require('../schemas/NoteDeFrais')
  },
  'Seuil': {
    entity: require('../schemas/Seuil')
  },
  'ValeurAnalytique': {
    apiPath: 'valeursAnalytiques',
    entity: require('../schemas/ValeurAnalytique')
  },
  'Vehicule': {
    apiPath: 'vehicules',
    entity: require('../schemas/Vehicule')
  }
};

/**
 * Service de gestion des entités
 */
export default class EntityService {

  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor (schema) {
    /** @type {Object} */
    this.schema = schema;
    /** @type {RealmService.service} */
    this.service = RealmService.service;
    /** @type {Object} */
    this.apiPath = API_PATH_CONFIG[this.schema.name].apiPath;
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    /** @type {ApiService} */
    this.apiService = new ApiService();
    /** @type {ConfigurationService} */
    this.configurationService = new ConfigurationService();
  }

  /**
   * Supprime l'ensemble des éléments de la liste des identifiants
   * @param {array} idList
   */
  deleteAll (idList) {
    idList.forEach((id) => {
      const object = this.find(id);
      if (object) {
        this.delete(object);
      }
    });
  }

  /**
   * Ajoute un listener sur la base de données pour la synchronisation
   * @param shouldUseApiService
   * @private
   */
  _listen (shouldUseApiService) {
    if (shouldUseApiService) {
      this.service.addListener('change', this._synchronise.bind(this));
    }
  }

  /**
   * Supprime les listeners sur la base de données
   * @param shouldUseApiService
   * @private
   */
  _removeListen (shouldUseApiService) {
    if (shouldUseApiService) {
      this.service.removeAllListeners();
    }
  }

  /**
   * Méthode de création d'une entité en local et de synchonisation  avec le serveur si le compte peut utiliser l'api.
   * @param body
   * @returns {string} identifiant
   */
  create (body) {
    const shouldUseApiService = this.compteSecureService.shouldUseApiService();
    this._listen(shouldUseApiService);

    body.id = Utils.uuid();

    this.service.write(() => {
      body._isSynchronized = !shouldUseApiService;
      body.derniereModification = new Date();
      this.service.create(this.schema.name, body);
    });

    this._removeListen(shouldUseApiService);
    return body.id;
  }

  /**
   * Méthode de mise à jour d'une entité en local et de synchonisation avec le serveur si le compte peut utiliser l'api.
   * @param body
   * @returns {string} identifiant
   */
  update (body) {
    const shouldUseApiService = this.compteSecureService.shouldUseApiService();
    this._listen(shouldUseApiService);

    this.service.write(() => {
      body._isSynchronized = !shouldUseApiService;
      body.derniereModification = new Date();
      this.service.create(this.schema.name, body, true);
    });

    this._removeListen(shouldUseApiService);
    return body.id;
  }

  /**
   * Méthode permettant de mettre à jour la date de depréciation sur une entitée
   * Deux dates sont mise à jour, car pour certaines entités le serveur ne définit pas de date de dépriciation,
   * ici le fonctionnement est toujours le mêmes
   * @param data
   * @returns {Object}
   */
  setDepreciation (data) {
    data.depreciation = new Date();
    data._depreciation = new Date();
    return data;
  }

  /**
   * Méthode de suppression d'une entité et de synchonisation avec le serveur.
   * Les élements ne sont pas réellement supprimés, ils sont dépréciés
   * @param body
   * @returns {string}
   */
  delete (body) {
    const shouldUseApiService = this.compteSecureService.shouldUseApiService();
    this._listen(shouldUseApiService);

    let data = _.clone(body);
    data = this.setDepreciation(data);
    data._isSynchronized = !shouldUseApiService;
    data.derniereModification = new Date();
    this.service.write(() => {
      this.service.create(this.schema.name, data, true);
    });

    this._removeListen(shouldUseApiService);
    return body.id;
  }

  /**
   * Filtre permettant de ne pas prendre en compte les éléments "supprimés"
   * @param object
   * @returns {*}
   * @private
   */
  _depreciationFilter (object) {
    if (object.depreciation || object._depreciation) {
      return moment(object.depreciation || object._depreciation).isAfter(moment());
    }
    return true;
  }

  /**
   * Méthode de recherche par identifiant en base de données
   * @param id
   * @returns {Object}
   */
  find (id) {
    const object = this.service.objects(this.schema.name).filtered(`id = "${id}"`)[0];
    if (object && this._depreciationFilter(object)) {
      return object;
    }
    return null;
  }

  /**
   * Méthode de recherche par identifiant en base de données et de mise au format pour l'api
   * @param id
   * @returns {Object}
   */
  findAndFormat (id) {
    return this.format(this.find(id));
  }

  /**
   * Méthode qui retourne l'ensemble des entités
   * @param filtered
   * @returns {Array}
   */
  findAll (filtered = null) {
    let all = this.service.objects(this.schema.name);
    if (filtered) {
      all = all.filtered(filtered);
    }

    return _.toArray(all)
            .filter((object) => {
              return this._depreciationFilter(object)
            });
  }

  /**
   * Méthode qui retourne l'ensemble des entités lié à un compte
   * @param idCompte
   * @returns {Array}
   */
  findAllForAccount (idCompte) {
    return this.findAll(`idCompte = "${idCompte}"`);
  }

  _apiErrorCatcher (object, error) {
    if (error instanceof NotFoundException) {
      // Si l'api ne trouve pas l'objet à synchroniser on la supprime localement..
      console.log('delete object....');
      this.service.write(() => this.service.delete(object));
    }
    else if (error instanceof ApiServiceAccess) {
      throw error;
    }
    else if (error instanceof SyntaxError) {
      //TODO: show error
      //Server response 500/503
      //throw error;`
      return new Promise.resolve(this.find(object.id));
    }
    else if (error instanceof TypeError) {
      // No network...
      return new Promise.resolve(this.find(object.id));
    }

  }

  /**
   * Méthode de synchronisation des données avec l'api
   * @returns Promise
   * @private
   */
  async _synchronise () {
    if (this.schema.properties._isSynchronized) {
      const objectsToSync = RealmService.service.objects(this.schema.name).filtered('_isSynchronized = false');

      if (objectsToSync && objectsToSync.length > 0) {
        const _syncDatabase = (id) => {
          const object = this.find(id);
          if (object) {
            this.service.write(() => object._isSynchronized = true);
          }
        };

        console.log(`--- Service synchronise ${objectsToSync.length} ${this.schema.name}(s)`);
        const promises = objectsToSync.map((object) => {
          const data = this.format(object);

          if (object.depreciation || object._depreciation) {
            return this.apiService.delete(this.apiPath, data, [object.id]).then(() => _syncDatabase(object.id))
                       .catch(this._apiErrorCatcher.bind(this, object));
          }
          console.log('---- update ', this.schema.name);
          return this.apiService.put(this.apiPath, data).then(() => _syncDatabase(object.id))
                     .catch(this._apiErrorCatcher.bind(this, object));

        });
        return await Promise.all(promises);
      }

    }
    return Promise.resolve(true);
  }

  /**
   * Méthode de merge des données.
   * Le merge consiste à synchroniser les données avec le serveur puis à les récupérer.
   * Pour chaque entités, une date de dernière mise à jour est stocké dans le compte pour optimiser les échanges avec le serveur.
   * @returns Promise
   */
  async mergeAll () {
    await this._synchronise();

    let collection = null;
    let lastFecthAll = this.compteSecureService.getLastFetchAll(this.schema.name);
    const nextLastFetchAll = new Date();
    if (lastFecthAll) {
      collection = await this.fetchAll({ derniereMiseAJour: moment(lastFecthAll).subtract(5, 'minutes').format() });
    }
    else {
      collection = await this.fetchAll();
    }

    if (collection && collection.length > 0) {
      console.log(`--- Service mergeAll ${collection.length} ${this.schema.name}(s)`);
      return await Promise.all(collection).then((elements) => {
        this.service.write(() => {
          elements.forEach((element) => {
            try {
              element._isSynchronized = true;
              this.service.create(this.schema.name, element, true);
            } catch (e) {
              console.log('error', e, element);
            }
          });
          console.log('-------------------------------------------------------');
        });
        this.compteSecureService.setLastFetchAll(this.schema.name, nextLastFetchAll);
        return elements;
      });

    }
    return Promise.resolve([]);
  }

  /**
   * Méthode permettant de merger un objet en partculier.
   * Le système est identique au merge des list d'entités
   * @param id
   * @returns {Promise}
   */
  async merge (id) {
    const object = await this.fetch(id);
    if (object) {
      return Promise.resolve(object).then((element) => {
        this.service.write(() => {
          element._isSynchronized = true;
          this.service.create(this.schema.name, element, true);
        });
        return element;
      });
    }
    return Promise.resolve(false);
  };

  /**
   * Méthode qui permet de récupérer l'ensemble des éléments pour une entité
   * @param queryParams
   * @returns {Promise}
   */
  async fetchAll (queryParams = { derniereMiseAJour: moment([1970, 0, 1]).format() }) {
    try {
      return await this.apiService.get(this.apiPath, [], queryParams).then((objects) => {
        return _.map(objects, (object) => {
          return this.parse(object);

        });
      })
    } catch (error) {
      if (error instanceof ApiServiceAccess) {
        throw error;
      }
      console.log('--- FetchAll - Find in local db :', this.apiPath, error);
      return new Promise.resolve(this.findAll);
    }

  }

  /**
   * Méthode qui permet de récupérer un élément d'une entité par son identifiant
   * @param id
   * @param queryParams
   * @returns {Promise}
   */
  async fetch (id, queryParams = { derniereMiseAJour: moment([1970, 0, 1]).format() }) {
    return await this.apiService.get(this.apiPath, [id], queryParams)
                     .then((object) => this.parse(object))
                     .catch(this._apiErrorCatcher.bind(this, { id }));
  }

  /**
   * Méthode qui parse les élements en retour du serveur en fonction de la définition des objets realm.
   * @param object
   * @param schema
   * @returns {Object}
   */
  parse (object, schema = this.schema) {
    if (schema.name) {
      const properties = schema.properties;
      const keys = Object.keys(properties);

      for (let key of keys) {

        if (object && object.hasOwnProperty(key)) {
          const value = properties[key];

          const type = typeof value === 'object' ? value.type : value;

          const objectValue = object[key];

          if (type === 'date' && objectValue) {
            object[key] = moment.utc(objectValue).toDate();
          }
          else if (type === 'int') {
            object[key] = objectValue ? parseInt(objectValue, 10) : 0;
          }
          else if (type === 'float') {
            object[key] = objectValue ? this.parseFloat(objectValue) : 0;
          }
          else if (type === 'bool') {
            object[key] = objectValue === 'true';
          }
          else if (type === 'list') {
            if (value.objectType === 'Identifiant') {
              const identifiants = [];
              for (let id of objectValue) {
                identifiants.push({ id });
              }
              object[key] = identifiants;
            }
            else if (value.objectType) {

              const objectType = API_PATH_CONFIG[value.objectType];
              if (objectType && objectType.entity) {
                const childSchema = objectType.entity.default.schema;
                object[key] = _.toArray(objectValue).map((value) => {
                  return this.parse(value, childSchema);
                });
              }

            }

          }
          else if (type === 'string' && typeof objectValue === 'object') {
            object[key] = JSON.stringify(objectValue);
          }

        }

      }

    }

    return object;
  }

  /**
   * Méthode qui formatte les élements à destination du serveur en fonction de la définition des objets realm.
   * @param object
   * @param schema
   * @returns {Object}
   */
  format (object, schema = this.schema) {

    const properties = schema.properties;
    const keys = Object.keys(properties);
    const format = {};
    for (let key of keys) {
      if (!key.startsWith('_') && object && object.hasOwnProperty(key)) {
        const value = properties[key];

        const type = typeof value === 'object' ? value.type : value;

        const objectValue = object[key];

        if (type === 'date') {
          format[key] = objectValue ? moment.utc(objectValue).format() : objectValue;
        }
        else if (type === 'list') {
          if (value.objectType === 'Identifiant') {
            format[key] = objectValue.map((obj) => obj.id);
          }
          else {
            format[key] = _.toArray(objectValue);
          }
        }
        else if (type === 'bool') {
          format[key] = objectValue === true ? 'true' : 'false';
        }
        else if (type === 'float') {
          format[key] = objectValue ? this.parseFloat(objectValue) : 0;
        }
        else {
          format[key] = objectValue;
        }

      }
    }
    return format
  }

  /**
   * Méthode qui permet de parser un float
   * @param value
   * @returns {number}
   */
  parseFloat (value) {
    if (value) {
      value = (Math.round(parseFloat(value) * 1000) / 1000);
    }
    return value;
  }

};