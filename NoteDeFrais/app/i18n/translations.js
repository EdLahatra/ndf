import I18n, {/* getLanguages */ } from 'react-native-i18n';

I18n.fallbacks = true;

const moment = require('moment');
require('moment/locale/fr');

moment.locale(I18n.locale);

I18n.translations = {
  fr: {
    devise: '€',
    distanceUnit: 'km',
    distanceMatrix: {
      units: 'metric' // en km, imperial pour les miles
    },
    help: {
      emptyList: 'Actuellement, il n\'y aucun élément dans la liste mais vous pouvez en ajouter avec le bouton + ci-dessous',
      emptySyncList: 'La liste est vide, veuillez vérifier votre connexion à internet et synchroniser vos données'
    },
    dateFormat: 'LL',
    home: {
      title: 'Bienvenue dans Compta.com',
      name: 'Note de frais',
      termsOfUse: 'En utilisant cette application, vous acceptez les',
      termsOfUseLink: 'Conditions d’utilisation',
      termsOfUseButton: 'ACCEPTER ET CONTINUER',
      about: 'En savoir plus à propos de',
      aboutLink: 'Compta.com'
    },
    authenticate: {
      ignore: 'IGNORER',
      title: 'Profitez d\'une comptabilisation automatique',
      description: 'Connectez-vous à Compta.com pour envoyer vos notes de frais directement en comptabilité ou dans un circuit d’approbation.',
      connectWith: ' Connectez-vous avec votre compte :',
      connectWithFacebook: 'Connectez-vous avec Facebook',
      connectWithGoogle: 'Connectez-vous avec Google'
    },
    categories: {
      title: 'Ajout d\'une dépense',
      carFees: 'Indémnités kilométriques',
      addRestaurant: 'Restaurant',
      gasFees: 'Carburant',
      roadFees: 'Péage',
      giftFees: 'Cadeau client',
      bedFees: 'Hébergement',
      parkingFees: 'Parking',
      taxiFees: 'Taxi',
      postFees: 'Poste',
      trainFees: 'Train',
      categoryListEdit: 'Édition des catégories',
      add: 'Ajout d\'une catégorie'
    },
    login: {
      title: 'Connexion à ComptaCom',
      next: 'Suivant'
    },
    sideMenu: {
      fichePersonnelleForm: 'Fiche personnelle',
      vehiculeListe: 'Véhicules',
      categorieDepenseListe: 'Catégories',
      confirm: {
        title: 'Voulez-vous confirmer la suppression de ce compte ?',
        deletion: 'Votre note de frais actuelle et votre historique seront préservés sur l’application {{typeCompte}}',
        deletionSimple: 'Votre note de frais actuelle, votre historique et vos paramétrages seront définitivement perdus.'
      },
      addAccount: 'Ajouter un compte'
    },
    iconFieldPicker: {
      title: 'Choix d\'un icône',
    },
    filters: {
      findAllDepenses: 'Tout voir',
      findAllIndemnitesKilometriques: 'Indémnités Km',
      findAllIndemnitesKilometriquesWithRegulation: 'Indémnités Km',
      findAllAutresDepenses: 'Autres'
    },
    states: {
      inProgress: 'En cours',
      validated: 'Validées',
      validation: 'En validation',
      refused: 'Refusées'
    },
    state: {
      EnCours: 'En cours',
      Validee: 'Validée',
      Validation: 'En validation',
      Refusee: 'Refusée'
    },
    identity: {
      title: 'Fiche personnelle',
    },
    account: {
      Autonome: 'Dossier autonome',
      ComptaCom: 'Dossier Compta.com',
      Gescab: 'Dossier Gescab',
      currentFees: 'Vos notes de frais en cours',
      carListEdit: 'Édition des véhicules',
      addCar: 'Ajout d\'un véhicule'
    },

    Depense: {
      placeholder: {
        description: 'Description',
        montantARembourser: 'Total TTC',
        tva: 'Dont TVA',
        valeursAnalytiques: 'Axe'
      }
    },

    Alert: {
      cancel: 'Annuler',
      warning: 'Oups',
      network: 'Echec de la connexion au serveur. Vérifiez votre connexion internet ou réessayez plus tard.',
      shouldAddVehicule: 'Vous devez d\'abord ajouter un véhicule',
      notFoundPlaces: 'Impossible de mesurer de distance, l\'un des lieux n\'a pas été trouvé...',
      changeOrigins: 'Modifier le départ ({{origins}})',
      changeDestinations: 'Modifier l\'arrivée ({{destinations}})',
      addOriginPlace: 'Veuillez ajouter le lieu de départ',
      addMyAddress: 'Ajouter mon adresse',
      addDestinationPlace: 'Veuillez ajouter le lieu de destination',
      useGooglePlaceApi: 'Utiliser la recherche'
    },

    NoteDeFrais: {
      emptyDepenseError: 'Impossible de valider une note de frais sans déclaration de frais.',
      regulationIndemniteKilometrique: 'Régulation véhicule: {{vehicule}}',
      history: 'Historique',
      period: 'Du {{first}} au {{last}}',
      fees: {
        one: '1 dépense',
        other: '{{count}} dépenses'
      }

    },

    DepenseCommuneListe: {

      confirm: {
        title: 'Etes-vous sûr de valider définitivement votre note de frais ?',
        validationSimple: 'Elle ne sera plus modifiable. Vous pourrez la retrouver dans votre historique.',
        validation: 'Elle sera envoyée pour approbation.'
      }

    },

    IndemniteKilometrique: {
      placeholder: {
        description: 'Description',
        valeursAnalytiques: 'Axe',
        idVehicule: 'Choisir un véhicule',
        _depart: 'Lieu de départ',
        lieu: 'Lieu d\'arrivée',
        distance: 'Distance'
      }
    },

    FichePersonnelle: {
      anonymous: 'Anonyme',
      address: 'Adresse de la fiche personnelle',
      placeholder: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'Email',
        emailPdf: 'Email pour l\'envoi pdf',
        societe: 'Société',
        portable: 'Portable',
        adresse1: 'Rue',
        adresse2: 'Appartement',
        codePostal: 'Code postal',
        ville: 'Ville',
        pays: 'Pays'
      }
    },

    CategorieDepense: {
      placeholder: {
        icone: 'Icône',
        nom: 'Nom',
        tva: 'Pourcentage de TVA par défaut'
      }
    },

    CompteSecure: {
      placeholder: {
        username: 'Identifiant',
        password: 'Mot de passe'
      }
    },

    Vehicule: {
      placeholder: {
        nom: 'Nom',
        immatriculation: 'Immatriculation',
        typeVehicule: 'Type de véhicule',
        puissanceFiscale: 'Puissance fiscale',
        favori: 'Favori'
      },
      Voiture: 'Voiture',
      Cyclomoteur: 'Cyclomoteur',
      Motocyclette: 'Motocyclette'
    },
    imagePicker: {
      title: 'Ajouter un justificatif',
      cancelButtonTitle: 'Annuler',
      takePhotoButtonTitle: 'depuis l\'appareil photo',
      chooseFromLibraryButtonTitle: 'depuis la galerie'
    },

    datepicker: {
      confirmBtnText: 'OK',
      cancelBtnText: 'Annuler'
    },
    googleplaces: {
      search: 'Recherche',
      currentLocationLabel: 'Ma position'
    }

  },

  en: {
    devise: '€',
    distanceUnit: 'km',
    distanceMatrix: {
      units: 'metric' // en km, imperial pour les miles
    },
    help: {
      emptyList: 'Actuellement, il n\'y aucun élément dans la liste mais vous pouvez en ajouter avec le bouton + ci-dessous',
      emptySyncList: 'La liste est vide, veuillez vérifier votre connexion à internet et synchroniser vos données'
    },
    dateFormat: 'LL',
    home: {
      title: 'Bienvenue dans Compta.com',
      name: 'Note de frais',
      termsOfUse: 'En utilisant cette application, vous acceptez les',
      termsOfUseLink: 'Conditions d’utilisation',
      termsOfUseButton: 'ACCEPTER ET CONTINUER',
      about: 'En savoir plus à propos de',
      aboutLink: 'Compta.com'
    },
    authenticate: {
      ignore: 'IGNORER',
      title: 'Profitez d\'une comptabilisation automatique',
      description: 'Connectez-vous à Compta.com pour envoyer vos notes de frais directement en comptabilité ou dans un circuit d’approbation.',
      connectWith: ' Connectez-vous avec votre compte :',
      connectWithFacebook: 'Connectez-vous avec Facebook',
      connectWithGoogle: 'Connectez-vous avec Google'
    },
    categories: {
      title: 'Ajout d\'une dépense',
      carFees: 'Indémnités kilométriques',
      addRestaurant: 'Restaurant',
      gasFees: 'Carburant',
      roadFees: 'Péage',
      giftFees: 'Cadeau client',
      bedFees: 'Hébergement',
      parkingFees: 'Parking',
      taxiFees: 'Taxi',
      postFees: 'Poste',
      trainFees: 'Train',
      categoryListEdit: 'Édition des catégories',
      add: 'Ajout d\'une catégorie'
    },
    login: {
      title: 'Connexion à ComptaCom',
      next: 'Suivant'
    },
    sideMenu: {
      fichePersonnelleForm: 'Fiche personnelle',
      vehiculeListe: 'Véhicules',
      categorieDepenseListe: 'Catégories',
      confirm: {
        title: 'Voulez-vous confirmer la suppression de ce compte ?',
        deletion: 'Votre note de frais actuelle et votre historique seront préservés sur l’application {{typeCompte}}',
        deletionSimple: 'Votre note de frais actuelle, votre historique et vos paramétrages seront définitivement perdus.'
      },
      addAccount: 'Ajouter un compte'
    },
    iconFieldPicker: {
      title: 'Choix d\'un icône',
    },
    filters: {
      findAllDepenses: 'Tout voir',
      findAllIndemnitesKilometriques: 'Indémnités Km',
      findAllIndemnitesKilometriquesWithRegulation: 'Indémnités Km',
      findAllAutresDepenses: 'Autres'
    },
    states: {
      inProgress: 'En cours',
      validated: 'Validées',
      validation: 'En validation',
      refused: 'Refusées'
    },
    state: {
      EnCours: 'En cours',
      Validee: 'Validée',
      Validation: 'En validation',
      Refusee: 'Refusée'
    },
    identity: {
      title: 'Fiche personnelle',
    },
    account: {
      Autonome: 'Dossier autonome',
      ComptaCom: 'Dossier Compta.com',
      Gescab: 'Dossier Gescab',
      currentFees: 'Vos notes de frais en cours',
      carListEdit: 'Édition des véhicules',
      addCar: 'Ajout d\'un véhicule'
    },

    Depense: {
      placeholder: {
        description: 'Description',
        montantARembourser: 'Total TTC',
        tva: 'Dont TVA',
        valeursAnalytiques: 'Axe'
      }
    },

    Alert: {
      ok: 'Ok',
      cancel: 'Annuler',
      warning: 'Oups',
      network: 'Echec de la connexion au serveur. Vérifiez votre connexion internet ou réessayez plus tard.',
      shouldAddVehicule: 'Vous devez d\'abord ajouter un véhicule',
      notFoundPlaces: 'Impossible de mesurer de distance, l\'un des lieux n\'a pas été trouvé...',
      changeOrigins: 'Modifier le départ ({{origins}})',
      changeDestinations: 'Modifier l\'arrivée ({{destinations}})',
      addOriginPlace: 'Veuillez ajouter le lieu de départ',
      addMyAddress: 'Ajouter mon adresse',
      addDestinationPlace: 'Veuillez ajouter le lieu de destination',
      useGooglePlaceApi: 'Utiliser la recherche'
    },

    NoteDeFrais: {
      emptyDepenseError: 'Impossible de valider une note de frais sans déclaration de frais.',
      emptyFichePersonnelleError: 'Pour valider une note de frais, votre fiche personnelle doit être complétée.',
      regulationIndemniteKilometrique: 'Régulation véhicule: {{vehicule}}',
      history: 'Historique',
      period: 'Du {{first}} au {{last}}',
      fees: {
        one: '1 dépense',
        other: '{{count}} dépenses'
      }

    },

    DepenseCommuneListe: {

      confirm: {
        title: 'Etes-vous sûr de valider définitivement votre note de frais ?',
        validationSimple: 'Elle ne sera plus modifiable. Vous pourrez la retrouver dans votre historique.',
        validation: 'Elle sera envoyée pour approbation.'
      },
      afterValidate: {
        title: 'La note de frais a bien été validée',
        message: 'Une nouvelle note de frais est disponible'
      }

    },

    IndemniteKilometrique: {
      placeholder: {
        description: 'Description',
        valeursAnalytiques: 'Axe',
        idVehicule: 'Choisir un véhicule',
        _depart: 'Lieu de départ',
        lieu: 'Lieu d\'arrivée',
        distance: 'Distance'
      }
    },

    FichePersonnelle: {
      anonymous: 'Anonyme',
      address: 'Adresse de la fiche personnelle',
      placeholder: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'Email',
        emailPdf: 'Email pour l\'envoi pdf',
        societe: 'Société',
        portable: 'Portable',
        adresse1: 'Rue',
        adresse2: 'Appartement',
        codePostal: 'Code postal',
        ville: 'Ville',
        pays: 'Pays'
      }
    },

    CategorieDepense: {
      placeholder: {
        icone: 'Icône',
        nom: 'Nom',
        tva: 'Pourcentage de TVA par défaut'
      }
    },

    CompteSecure: {
      placeholder: {
        username: 'Identifiant',
        password: 'Mot de passe'
      }
    },

    Vehicule: {
      placeholder: {
        nom: 'Nom',
        immatriculation: 'Immatriculation',
        typeVehicule: 'Type de véhicule',
        puissanceFiscale: 'Puissance fiscale',
        favori: 'Favori'
      },
      Voiture: 'Voiture',
      Cyclomoteur: 'Cyclomoteur',
      Motocyclette: 'Motocyclette'
    },
    imagePicker: {
      title: 'Ajouter un justificatif',
      cancelButtonTitle: 'Annuler',
      takePhotoButtonTitle: 'depuis l\'appareil photo',
      chooseFromLibraryButtonTitle: 'depuis la galerie'
    },

    datepicker: {
      confirmBtnText: 'OK',
      cancelBtnText: 'Annuler'
    },
    googleplaces: {
      search: 'Recherche',
      currentLocationLabel: 'Ma position'
    }

  }
};

I18n.toCurrency = function (value) {
  return `${this.toNumber(value, {
    strip_insignificant_zeros: true,
    separator: ',',
    delimiter: ' ',
    precision: 2
  })} ${I18n.t('devise')}`;
};

export default I18n;
