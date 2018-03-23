import GoogleAnalytics from 'react-native-google-analytics-bridge';

/**
 * Logger applicatif qui envoi les informations à la fois dans la console et dans Google Analytics
 */
export default class Logger {

  /**
   * Log d'info
   * @param category
   * @param action
   * @param optionalValues
   */
  static info (category, action, optionalValues = {}) {
    console.log('[INFO] ', category, action, optionalValues);
    GoogleAnalytics.trackEvent(category, action, optionalValues);
  }

  /**
   * Log d'erreur
   * @param error
   */
  static error (error) {
    console.log('[ERROR] ', error);
    GoogleAnalytics.trackException(error.message, false);
  }

}