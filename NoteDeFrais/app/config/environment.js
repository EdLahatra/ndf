const environment = {

  DistanceMatrix: {
    url: 'httpss://maps.googleapis.com/maps/api/distancematrix/json?',
    key: 'AIzaSyDL4X0q_crHnm2_8ECdOJVyrwdGCPUpFTw'
  },

  Places: {
    key: 'AIzaSyDL4X0q_crHnm2_8ECdOJVyrwdGCPUpFTw'
  },

  Analytics: {
    trackerId: 'UA-1221917-9'
  },

  GoogleSignin: {
    iosClientId: '307360444785-tstscmkaktt7a408jk0lbv2csjh3pgf8.apps.googleusercontent.com',
    webClientId: '307360444785-lk9ialac31h0bvc4kl3ftec1p0vd0a71.apps.googleusercontent.com'
  },

  Autonome: {
    oauth: {},
    api: [
      {
        url: 'https://www.www.compta.com.com/ComptaWeb/rest/notesDeFrais/v1',
        pathUnsecured: ['baremesKilometriques']
      }, {
        url: 'httpss://www.www.compta.com.com/Gestemps/rest/notesDeFrais/v1',
        pathUnsecured: ['envoiNoteDeFrais']
      }
    ]
  },

  ComptaCom: {
    oauth: {
      url: 'https://www.compta.com/ComptaWeb/rest/token',
      grant_type: 'password',
      client_id: 'oauth2clientid',
      client_secret: 'oauth2clientsecret'
    },
    api: [
      {
        url: 'https://www.compta.com/ComptaWeb/rest/notesDeFrais/v1',
        pathUnsecured: ['baremesKilometriques']
      }
    ]
  },

  Gescab: {
    oauth: {
      url: 'httpss://www.gescab.fr/Gestemps/rest/token',
      grant_type: 'password',
      client_id: 'oauth2clientid',
      client_secret: 'oauth2clientsecret'
    },

    api: [
      {
        url: 'https://www.www.compta.com.com/Gestemps/rest/notesDeFrais/v1',
        pathUnsecured: ['baremesKilometriques']
      }
    ]
  },

  config: {
    urlSite: 'http://www.compta.com/',
    urlCGU: 'https://www.compta.com/ComptaWeb/cg/cgs/cgs.html'
  },

  cameraConfig: {
    path: 'ComptaCom',
    maxWidth: 720,
    maxHeight: 1280,
    quality: 0.9
  }

};

module.exports = environment;

