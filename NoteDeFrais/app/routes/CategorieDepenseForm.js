'use strict';

import React, {Component} from "react";
import _ from "underscore";
import {Actions} from "react-native-router-flux";
import RealmForm from "../components/realm-form";
import CategorieDepense from "../schemas/CategorieDepense";
import I18n from "../i18n/translations";
import CategorieDepenseService from "../services/CategorieDepenseService";
import CompteSecureService from "../services/CompteSecureService";
import {TYPE} from "../schemas/Depense";

/**
 * Page de création d'une catégorie
 *
 * @module app/routes/CategorieDepenseForm.js
 * @override react/Component
 */
export default class CategorieDepenseForm extends RealmForm {

  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor () {
    super();
    /** @type {CompteSecureService} */
    this.compteSecureService = new CompteSecureService();
  }

  /**
   * Retourne la catégorie en cours en fonction du contexte
   * @param props
   * @returns {Object}
   */
  getStateValue (props) {
    const selectedAccount = this.compteSecureService.getSelectedAccount();
    let category = _.clone(this.props.category) || { idCompte: selectedAccount.compte.id };
    return category;
  }

  /**
   * Retourne la configuration du formulaire
   * @returns {Object}
   */
  getConfig () {
    return { schema: CategorieDepense.schema };
  }

  /**
   * Retourne le titre du formulaire à afficher dans la NavBar
   * @param props
   * @returns {*}
   */
  static getTitle (props) {
    if (props) {
      return props.category ? props.category.nom : I18n.t('categories.add');
    }
  }

  /**
   * Méthode qui vérifie la possibilité de supprimer un instance en fonction du contexte
   * @param props
   * @returns {boolean}
   */
  static shouldDelete (props) {
    if (props.category) {
      return true;
    }
    return false;
  }

  static categorieDepenseService = new CategorieDepenseService();
  static compteSecureService = new CompteSecureService();

  /**
   * Méthode de suppression d'une catégorie
   * @param category
   * @param props
   */
  static delete (category, props) {
    this.categorieDepenseService.delete(props.category, this.compteSecureService.getSelectedAccount());
    Actions.pop({ refresh: { refresh: props.categories } });
  }

  /**
   * Méthode de sauvegarde d'une catégorie
   * @param props
   * @param formValues
   */
  static save (props, formValues) {
    if (formValues.id) {
      this.categorieDepenseService.update(formValues)
    }
    else {
      this.categorieDepenseService.create(formValues, this.compteSecureService.getSelectedAccount());
    }
    Actions.pop({ refresh: {} });
  }

}
