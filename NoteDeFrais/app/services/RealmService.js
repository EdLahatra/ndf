import Realm from 'realm';

import AxeAnalytique from '../schemas/AxeAnalytique';
import BaremeKilometrique from '../schemas/BaremeKilometrique';
import CategorieDepense from '../schemas/CategorieDepense';
import { Compte } from '../schemas/Compte';
import CompteSecure from '../schemas/CompteSecure';
import Configuration from '../schemas/Configuration';
import Depense from '../schemas/Depense';
import FichePersonnelle from '../schemas/FichePersonnelle';
import Identifiant from '../schemas/Identifiant';
import IndemniteKilometrique from '../schemas/IndemniteKilometrique';
import Justificatif from '../schemas/Justificatif';
import KilometreAnnuel from '../schemas/KilometreAnnuel';
import NoteDeFrais from '../schemas/NoteDeFrais';
import Regulation from '../schemas/Regulation';
import Seuil from '../schemas/Seuil';
import ValeurAnalytique from '../schemas/ValeurAnalytique';
import Vehicule from '../schemas/Vehicule';

const schema = [
  AxeAnalytique,
  BaremeKilometrique,
  CategorieDepense,
  Compte,
  CompteSecure,
  Configuration,
  Depense,
  FichePersonnelle,
  Identifiant,
  IndemniteKilometrique,
  Justificatif,
  KilometreAnnuel,
  NoteDeFrais,
  Regulation,
  Seuil,
  ValeurAnalytique,
  Vehicule
];

const schemaVersion = 26;
/*eslint-disable */
const migration = (oldRealm, newRealm) => {

  /*
   https://realm.io/docs/react-native/latest/#performing-a-migration
   */

};

/**
 * Service de gestion de la base de données
 */
export default class RealmService {
  static service = new Realm({ schema, schemaVersion, migration });
  // static service = { schema, schemaVersion, migration };
}
