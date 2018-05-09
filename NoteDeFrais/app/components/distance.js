import _ from 'underscore';

import ENV from '../config/environment';
import I18n from '../i18n/translations';

const conversionKey = {
  m: {
    km: 0.001,
    m: 1
  },
  km: {
    km: 1,
    m: 1000
  }
};

export default class Distance {
  static convert(distance, from = 'm', to = 'km') {
    return distance * conversionKey[from][to];
  }

  static compute(origins, destinations) {
    const params = {
      key: ENV.DistanceMatrix.key,
      origins,
      destinations,
      language: I18n.locale,
      units: I18n.t('distanceMatrix.units')
    };

    const queryParams = _.map(params, (v, k) =>
      `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const self = this;

    return fetch(ENV.DistanceMatrix.url + queryParams, {
      method: 'GET'
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong on api server!');
    }).then(({ rows }) => {
      const element = rows[0].elements[0];
      if (element.status === 'NOT_FOUND') {
        throw new Error(element.status);
      }
      return self.convert(element.distance.value);
    });
  }
}
