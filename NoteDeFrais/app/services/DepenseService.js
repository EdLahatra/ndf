import _ from 'underscore';

import EntityService from './EntityService';
import Depense from '../schemas/Depense';
import JustificatifService from './JustificatifService';
import Utils from '../lib/utils';


/**
 * Service de gestion des depenses
 * @override {EntityService}
 */
export default class DepenseService extends EntityService {
  /**
   * Initialisation du service
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super(Depense.schema);
    /** @type {JustificatifService} */
    this.justificatifService = new JustificatifService();
  }

  _computeHT = ({ montantARembourser, tva }) => montantARembourser && tva
    ? this.parseFloat(montantARembourser - tva) : 0

  setDepreciation(data) {
    data._depreciation = new Date();
    return data;
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
    const depensesList = _.toArray(ndf.depenses).filter(ik => ik.id !== body.id);

    const justificatifsId = _.toArray(body.justificatifs).map(jus => jus.id);
    this.justificatifService.deleteAll(justificatifsId);

    this.service.write(() => {
      ndf.depenses = [];
      if (depensesList) {
        depensesList.forEach((ik) => {
          ndf.depenses.push({ id: ik.id });
        });
      }
    });
    super.delete(body);
  }

  update(body) {
    const data = _.clone(body);

    data.ht = this._computeHT(body);
    data.justificatifs = _.toArray(body.justificatifs).map((j) => {
      const justificatif = _.clone(j);
      justificatif.idDepense = body.id;
      let id = justificatif.id;
      if (id) {
        this.justificatifService.update(justificatif);
      } else {
        id = this.justificatifService.create(justificatif);
      }
      return { id };
    });
    return super.update(data);
  }

  create(body, ndf) {
    body.id = Utils.uuid();
    body.idNoteDeFrais = ndf.id;
    body.idCompte = ndf.idCompte;
    body.ht = this._computeHT(body);

    if (body.justificatifs) {
      body.justificatifs = body.justificatifs.map((justificatif) => {
        justificatif.idDepense = body.id;
        const id = this.justificatifService.create(justificatif);
        return { id };
      });
    }

    const shouldUseApiService = this.compteSecureService.shouldUseApiService();
    this._listen(shouldUseApiService);

    this.service.write(() => {
      body._isSynchronized = !shouldUseApiService;
      body.derniereModification = new Date();
      this.service.create(this.schema.name, body);
      ndf.depenses.push({ id: body.id });
    });

    this._removeListen(shouldUseApiService);
    return body.id;
  }

  computeTVA(categorieDepense, value) {
    if (categorieDepense && categorieDepense.tva) {
      const taux = 1 + (this.parseFloat(categorieDepense.tva) / 100);
      const ttc = this.parseFloat(value);
      if (ttc || categorieDepense.tva === 0) {
        const tva = ttc - (ttc / taux);
        return this.parseFloat(tva);
      }
      return 0;
    }
    return null;
  }
}
