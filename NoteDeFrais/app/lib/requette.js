const key = 'AIzaSyDPlgW3AxwsuqkrgjqPS67W9UHIjLGnW5g';
const distance = 'AIzaSyDAgGOd9hzao9QSwRiEitPOSApzWC_oxto';
const keyGeo = 'AIzaSyAw7AarXHjSjJx_z7lgcgG4tKNE9ogqI-4';
const query1 = 'AIzaSyDPlgW3AxwsuqkrgjqPS67W9UHIjLGnW5g';
const googleUrl = 'https://maps.googleapis.com/maps/api/';
const place_id = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
const origins = 'Vancouver+BC|Seattle';
const destinations = 'San+Francisco|Victoria+BC';
const e = `https://www.googleapis.com/geolocation/v1/geolocate?key=${distance}`;

export const query = query => `${googleUrl}place/autocomplete/json?input=${query}&types=geocode&key=${key}`;

export default {
  geoUrl: `${googleUrl}geocode/json?latlng=40.714224,-73.961452&key=${keyGeo}`,
  e,
  autocomplete: `${googleUrl}place/autocomplete/json?input=${query}&types=geocode&key=${key}`,
  details: `${googleUrl}place/details/json?placeid=${place_id}&key=${key}`,
  distance:
  `${googleUrl}place/distancematrix/json?origins=${origins}&destinations${destinations}=&key=${distance}`,
};
