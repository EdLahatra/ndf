import React, { Component } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Actions } from 'react-native-router-flux';
import I18n from '../i18n/translations';
import FichePersonnelleService from '../services/FichePersonnelleService';
import CompteSecureService from '../services/CompteSecureService';
// import ENV from '../config/environment';

export default class PlaceAutocomplete extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super();
    this.fichePersonnelleService = new FichePersonnelleService();
    this.compteSecureService = new CompteSecureService();
    this.state = { predefinedPlaces: null };
  }

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render() {
    const predefinedPlaces = [];
    const idFichePersonnelle = this.compteSecureService
      .getSelectedAccount().compte.idFichePersonnelle;
    if (idFichePersonnelle) {
      const fiche = this.fichePersonnelleService.find(idFichePersonnelle);
      if (fiche) {
        const description = [
          fiche.adresse1,
          fiche.ville,
          fiche.codePostal,
          fiche.pays
        ].filter(text => text !== null && text !== 'null').join(', ');
        predefinedPlaces.push({ description });
      }
    }

    return (<GooglePlacesAutocomplete
      placeholder={I18n.t('googleplaces.search')}
      minLength={2} // minimum length of text to search
      autoFocus={true}
      fetchDetails={true}
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        Actions.pop({ refresh: { place: { input: this.props.input, data } } });
        // eslint-disable-next-line no-console
        console.log(details);
      }}
      getDefaultValue={() =>
        this.props.value // text input default value
      }
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        // key: ENV.Places.key,
        key: 'AIzaSyAE6DA2yAQ2UotQuyn5jqStiKwYo6at_mY',
        language: I18n.locale,
        types: 'geocode',
      }}
      styles={{
        description: {
          fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        }
      }}
      // currentLocation={true}
      // Will add a 'Current location' button at the top of the predefined places list
      // currentLocationLabel={I18n.t('googleplaces.currentLocationLabel')}
      // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      nearbyPlacesAPI="GoogleReverseGeocoding"
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding
        // API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch
        // API : https://developers.google.com/places/web-service/search
        rankby: 'distance'
      }}
      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
      // filter the reverse geocoding results by types
      // - ['locality', 'administrative_area_level_3'] if you want to display only cities
      enablePoweredByContainer={false}
      predefinedPlaces={predefinedPlaces}
    />);
  }
}
