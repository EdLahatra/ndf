'use strict';

import React, { Component, } from 'react';
import { View, Text, Navigator } from 'react-native-deprecated-custom-components';

import { Actions, Scene, Router, ActionConst, Route } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import ENV from './config/environment';
import Presentation from './routes/Presentation';
import Connexion from './routes/Connexion';
import CategorieDepenseSelection from './routes/CategorieDepenseSelection';
import CategorieDepenseListe from './routes/CategorieDepenseListe'
import VehiculeListe from './routes/VehiculeListe'
import VehiculeForm from './routes/VehiculeForm';
import CategorieDepenseForm from './routes/CategorieDepenseForm';
import DepenseCommuneListe from './routes/DepenseCommuneListe';
import DepenseCommuneHistoriqueListe from './routes/DepenseCommuneHistoriqueListe';
import NoteDeFraisListe from './routes/NoteDeFraisListe';
import DepenseForm from './routes/DepenseForm';
import FichePersonnelleForm from './routes/FichePersonnelleForm';
import IndemniteKilometriqueForm from './routes/IndemniteKilometriqueForm';
import Login from './routes/Login';
import Chargement from './routes/Chargement';
import DepenseCommuneNavBar from './components/DepenseCommuneNavBar';
import NavBar from './components/NavBar';
import I18n from './i18n/translations';

import PlaceAutocomplete  from './components/place-autocomplete';
import ValeursAnalytiquesAutocomplete  from './components/valeursAnalytiques-autocomplete';
import { DrawerSideMenu } from './components/drawer-side-menu';

if (!__DEV__) {
  console = {};
  console.log = () => {
  };
  console.error = () => {
  };
}

const scenes = Actions.create(
    <Scene key="root">

      <Scene key="drawer" component={DrawerSideMenu} open={false} useInteractionManager={true}>

        <Scene key="scenes">
          <Scene key="presentation" component={Presentation} type={ActionConst.REPLACE} hideNavBar={true}
                 initial={true}/>
          <Scene key="connexion" component={Connexion} type={ActionConst.REPLACE}/>
          <Scene key="login" component={Login} hideNavBar={true} sceneConfig={Navigator.Sc}/>
          <Scene key="depenseCommuneListe"
                 navBar={DepenseCommuneNavBar}
                 component={DepenseCommuneListe}
                 type={ActionConst.RESET}
                 direction="vertical"/>
          <Scene key="depenseCommuneHistoriqueListe"
                 component={DepenseCommuneHistoriqueListe}
                 navBar={DepenseCommuneNavBar}
                 direction="vertical"/>
          <Scene key="depenseForm" component={DepenseForm}/>
          <Scene key="chargement" component={Chargement} type={ActionConst.REPLACE} hideNavBar={true}/>
          <Scene key="categorieDepenseSelection" component={CategorieDepenseSelection}
                 sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
          <Scene key="categorieDepenseForm" component={CategorieDepenseForm}/>
          <Scene key="categorieDepenseListe" component={CategorieDepenseListe}
                 title={I18n.t('categories.categoryListEdit')}
                 navBar={NavBar}
          />
          <Scene key="noteDeFraisListe" component={NoteDeFraisListe}/>
          <Route key="vehiculeListe"
                 title={I18n.t('account.carListEdit')}
                 component={VehiculeListe}
                 navBar={NavBar}
          />
          <Scene key="vehiculeForm" component={VehiculeForm}/>
          <Scene key="fichePersonnelleForm" component={FichePersonnelleForm}/>
          <Scene key="indemniteKilometriqueForm" component={IndemniteKilometriqueForm}/>
          <Scene key="placeAutocomplete" component={PlaceAutocomplete} direction="vertical" hideNavBar={true}/>
          <Scene key="valeursAnalytiquesAutocomplete" component={ValeursAnalytiquesAutocomplete}
                 direction="vertical" hideNavBar={true}/>
        </Scene>

      </Scene>

    </Scene>
);

/**
 * Index de l'application utilisé pour Android et IOs
 *
 * @module app/index.js
 * @override react/Component
 */
export default class Index extends Component {

  /**
   * Méthode invoquée une fois que le DOM est chargée, on ajoute le trackerId de Google analytics.
   *
   * @function componentDidMount
   */
  componentDidMount () {
    GoogleAnalytics.setTrackerId(ENV.Analytics.trackerId);
  }

  /**
   * Méthode au rendu de l'application, on initialise l'ensemble des routes.
   *
   * @function render
   * @return react~Component
   */
  render () {
    return <Router scenes={scenes}/>
  }

}


