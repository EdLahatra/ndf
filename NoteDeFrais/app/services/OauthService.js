import _ from 'underscore';

import CompteSecureService from './CompteSecureService';
import Logger from '../lib/Logger';
import fetch from '../lib/fetch';
import ENV from '../config/environment';

const Keychain = require('react-native-keychain');

/**
 * Service de gestion de l'authentification
 */
class OauthService {
  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor(typeCompte) {
    this.typeCompte = typeCompte;
    /** @type {Object} */
    this.configuration = ENV[typeCompte].oauth;
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
    this._task = null;
  }

  buildAuthUrl({ username, password }) {
    const params = {
      grant_type: this.configuration.grant_type,
      client_id: this.configuration.client_id,
      client_secret: this.configuration.client_secret,
      username,
      password
    };

    const queryParams = _.map(params, (v, k) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

    Logger.info(`${this.configuration.url}?${queryParams}`);

    return `${this.configuration.url}?${queryParams}`;
  }

  async reAuthenticate() {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    const token = await this._authenticate(selectedAccount.id);
    return await this.compteSecureService.update(selectedAccount, token);
  }

  async _authenticate(compteSecureId) {
    const credentials = await Keychain.getInternetCredentials(compteSecureId);
    Logger.info('Authentification for', credentials.username, { date: new Date() });

    if (this._task === null) {
      const url = this.buildAuthUrl(credentials);

      this._task = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }

    if (this._task.status === 200) {
      return await this._task.json().then((res) => {
        this._task = null;
        return res;
      });
    }
    const text = await this._task.text();
    const message = ['[', this._task.status, ']', credentials, '-', text].join(' ');
    this._task = null;
    Logger.error(message);
    const error = JSON.parse(text).error_description;
    throw new Error(error || text);
  }

  async authenticate({ username, password }) {
    const compteSecureId = `${this.configuration.url}#${username}`;
    await Keychain.setInternetCredentials(compteSecureId, username, password);
    const token = await this._authenticate(compteSecureId);
    return this.compteSecureService.create(token, this.typeCompte, compteSecureId);
  }
}

const OauthServiceFactory = () => {
  const _services = {};

  return {
    getInstance(typeCompte) {
      if (typeof _services[typeCompte] === 'undefined') {
        _services[typeCompte] = new OauthService(typeCompte);
      }
      return _services[typeCompte];
    }
  };
};

export default OauthServiceFactory;
// exports.OauthServiceFactory = OauthServiceFactory();
