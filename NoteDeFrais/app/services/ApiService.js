import _ from 'underscore';

import ENV from '../config/environment';
import fetch from '../lib/fetch';
import OauthServiceFactory from './OauthService';
import CompteSecureService from './CompteSecureService';
import ApiServiceAccess from '../errors/ApiServiceAccess';
import NotFoundException from '../errors/NotFoundException';
import Logger from '../lib/Logger';

/**
 * Service de communication avec l'API ComptaCom
 */
export default class ApiService {
  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
  }

  /**
   * Retourne la configuration en fonction du compte sélectionné
   */
  getConfiguration() {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    return ENV[selectedAccount.typeCompte];
  }

  /**
   * Retourne la configuration de l'api
   * @returns {Array|string|string|string|*}
   */
  getApiConfiguration() {
    return this.getConfiguration().api;
  }

  /**
   * Retourne une instance du service d'authentification
   * @returns {OauthService}
   */
  getOauthService() {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    return OauthServiceFactory.getInstance(selectedAccount.typeCompte);
  }

  /**
   * Retourne la partie de l'url avec les paramètres
   * @param params
   * @returns {string}
   */
  toQueryParams(params = {}) {
    return _.map(params, (v, k) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  }

  /**
   * Retourne le basePath de l'api à utiliser
   * @param path
   * @returns {string|string|string|string|string|string|*}
   */
  getBasePath(path) {
    const apiConfiguration = this.getApiConfiguration();
    const filtered = this.getApiConfiguration().filter(api => api.pathUnsecured.includes(path));
    if (filtered.length > 0) {
      return filtered[0].url;
    }
    return apiConfiguration[0].url;
  }

  /**
   * Construit une url au bon format
   * @param path
   * @param pathParams
   * @param queryParams
   * @returns {string}
   */
  buildUrl(path, pathParams = [], queryParams = {}) {
    return (
      `${this.getBasePath(path)}/${path}/${pathParams.join('/')}?${this.toQueryParams(queryParams)}`
    );
  }

  _needAuthorization(path) {
    const filtered = this.getApiConfiguration().filter(api => api.pathUnsecured.includes(path));
    return filtered.length === 0;
  }

  async _getHeaders(apiPath) {
    const headers = { 'Content-Type': 'application/json' };

    if (!this._needAuthorization(apiPath)) {
      return headers;
    } else if (!this.compteSecureService.shouldUseApiService()) {
      throw new ApiServiceAccess('Should not use with selectedAccount');
    } else {
      if (this.compteSecureService.hasExpiredToken()) {
        await this.getOauthService().reAuthenticate();
      }

      const accessToken = this.compteSecureService.getAccessToken();

      headers.Authorization = `Bearer ${accessToken}`;
      return headers;
    }
  }

  async _fetch(url, options) {
    const cancelPromise = new Promise((resolve, reject) => setTimeout(reject, 15000));
    const promise = fetch(url, options);
    return Promise.race([cancelPromise, promise]);
  }

  /**
   * Méthode permettant d'invoquer une requête de type GET
   * @param apiPath
   * @param pathParams
   * @param queryParams
   * @returns {*}
   */
  async get(apiPath, pathParams = [], queryParams = {}) {
    const headers = await this._getHeaders(apiPath);
    const url = this.buildUrl(apiPath, pathParams, queryParams);
    const response = await this._fetch(url, { method: 'GET', headers });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else if (response.status === 401) {
      await this.getOauthService().reAuthenticate();
      return this.get(...arguments);
    }

    const json = await response.json();
    const message = [
      '[', response.status, ']', response.statusText, 'for', url, json.error
    ].join(' ');
    Logger.error(message);
    if (response.status === 403) {
      throw new ApiServiceAccess(json.error);
    } else if (response.status === 404) {
      throw new NotFoundException(text);
    }
    throw new Error(json.error);
  }

  /**
   * Méthode permettant d'invoquer une requête de type DELETE
   * @param apiPath
   * @param object
   * @param pathParams
   * @param queryParams
   * @returns {*}
   */
  async delete(apiPath, object, pathParams = [], queryParams = {}) {
    const headers = await this._getHeaders(apiPath);
    const url = this.buildUrl(apiPath, pathParams, queryParams);
    const body = JSON.stringify(object);
    const response = await this._fetch(url, { method: 'DELETE', headers, body });
    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      await this.getOauthService().reAuthenticate();
      return await this.delete(...arguments);
    }
    const text = await response.text();
    const message = ['[', response.status, ']', response.statusText, '-', url, '-', text].join(' ');
    Logger.error(message);
    if (response.status === 403) {
      throw new ApiServiceAccess(text);
    } else if (response.status === 404) {
      throw new NotFoundException(text, object);
    }
    throw new Error(text);
  }

  /**
   * Méthode permettant d'invoquer une requête de type PUT
   * @param apiPath
   * @param object
   * @param pathParams
   * @param queryParams
   * @returns {*}
   */
  async put(apiPath, object, pathParams = [], queryParams = {}) {
    const headers = await this._getHeaders(apiPath);
    const url = this.buildUrl(apiPath, pathParams, queryParams);
    const body = JSON.stringify(object);
    const response = await this._fetch(url, { method: 'PUT', headers, body });
    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      await this.getOauthService().reAuthenticate();
      return await this.put(...arguments);
    }
    const text = await response.text();
    const message = ['[', response.status, ']', response.statusText, '-', url, '-', text].join(' ');
    Logger.error(message);
    if (response.status === 403) {
      throw new ApiServiceAccess(text);
    } else if (response.status === 404) {
      throw new NotFoundException(text, object);
    }
    throw new Error(text);
  }

  /**
   * Méthode permettant d'invoquer une requête de type POST
   * @param apiPath
   * @param object
   * @param pathParams
   * @param queryParams
   * @returns {*}
   */
  async post(apiPath, object, pathParams = [], queryParams = {}) {
    const headers = await this._getHeaders(apiPath);
    const url = this.buildUrl(apiPath, pathParams, queryParams);
    const body = JSON.stringify(object);
    const response = await this._fetch(url, { method: 'POST', headers, body });
    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      await this.getOauthService().reAuthenticate();
      return await this.post(...arguments);
    }
    const text = await response.text();
    const message = ['[', response.status, ']', response.statusText, '-', url, '-', text].join(' ');
    Logger.error(message);
    if (response.status === 403) {
      throw new ApiServiceAccess(text);
    }
    throw new Error(text);
  }
}
