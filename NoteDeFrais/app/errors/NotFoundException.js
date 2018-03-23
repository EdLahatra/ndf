/**
 * Exception spécifique à {ApiService}
 * @param message
 * @constructor
 */
export default function NotFoundException (message) {

  this.message = message;
  this.name = 'NotFoundException';

}