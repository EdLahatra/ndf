/**
 * Exception spécifique à {ApiService}
 * @param message
 * @constructor
 */
export default function ApiServiceAccess(message) {
  this.message = message;
  this.name = 'ApiServiceAccess';
}
