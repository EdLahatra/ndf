import { Platform, } from 'react-native';

/**
 * Classe utilitaire pour gérer les différences entre les OS
 */
export default {

  isAndroid(){
    return Platform.OS === 'android';
  },

  getSelectMarginRight(){
    return (this.isAndroid() ? -40 : 0);
  }

};
