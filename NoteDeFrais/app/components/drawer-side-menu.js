import React, { Component, } from 'react';

import {
  Text,
  View,
  ListView,
  TouchableOpacity,
  InteractionManager,
  Alert,
  ScrollView
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';

import I18n from '../i18n/translations';
import Glyphicons from '../Glyphicons';

import { Style, Colors, IconSize } from '../styles/style';

import { TYPES } from '../schemas/Compte';
import { STATUTS } from '../schemas/NoteDeFrais';

import CompteSecureService from '../services/CompteSecureService';
import FichePersonnelleService from '../services/FichePersonnelleService';
import NoteDeFraisService from '../services/NoteDeFraisService';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const compteSecureService = new CompteSecureService();
const fichePersonnelleService = new FichePersonnelleService();
const noteDeFraisService = new NoteDeFraisService();

class SideMenu extends Component {
  /**
   * Initialisation de l'état du composant.
   * Initialisation de l'ensemble des services utiles pour le chargement des données.
   */
  constructor() {
    super();
    /** @type {Object} */
    this.state = {
      selectedAccount: { compte: {} },
      isAccountsDisplayed: false,
      fichePersonnelle: {},
      actions: ds.cloneWithRows({}),
      accounts: ds.cloneWithRows({}),
      report: ds.cloneWithRows({})
    };
  }

  componentWillReceiveProps() {
    this.componentDidMount();
  }

  async _componentDidMount() {
    const accounts = compteSecureService.findAll();
    const selectedAccount = compteSecureService.getSelectedAccount();
    if (selectedAccount) {
      const actions = [
        { name: 'vehiculeListe', icon: 'car' },
        { name: 'categorieDepenseListe', icon: 'tags' },
        { name: 'fichePersonnelleForm', icon: 'user' }
      ];

      if (selectedAccount.typeCompte === TYPES.GESCAB) {
        actions.pop();
      }

      const report = noteDeFraisService.getRapport(selectedAccount ? selectedAccount.compte : {});
      let fichePersonnelle = null;
      if (selectedAccount && selectedAccount.compte) {
        const idFichePersonnelle = selectedAccount.compte.idFichePersonnelle;
        if (idFichePersonnelle) {
          fichePersonnelle = fichePersonnelleService.find(idFichePersonnelle);
        }
      }

      this.setState({
        selectedAccount,
        fichePersonnelle,
        actions: ds.cloneWithRows(actions),
        report: ds.cloneWithRows(report),
        accounts: ds.cloneWithRows(accounts)
      });
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this._componentDidMount());
  }

  _onPressAction(key) {
    Actions[key]();
  }

  _onPressReport(status) {
    if (STATUTS[status] === STATUTS.inProgress) {
      const selectedAccound = compteSecureService.getSelectedAccount();
      const noteDeFrais = noteDeFraisService.find(
        noteDeFraisService.findEnCours(selectedAccound.compte));
      Actions.depenseCommuneListe({ noteDeFrais });
    } else {
      Actions.noteDeFraisListe({ statut: STATUTS[status].key });
    }
  }

  _renderReport(report) {
    const label = STATUTS[report.status].key === STATUTS.inProgress.key ?
      (<View style={[Style.badge, Style.success]}>
        <Text style={[Style.labelSmallText]}>{report.num}</Text>
      </View>) :
      (<View style={[Style.badge, Colors.greyDarker.background()]}>
        <Text style={[Style.labelSmallText]}>{report.num}</Text>
      </View>);

    return (
      <TouchableOpacity
        onPress={this._onPressReport.bind(this, report.status)}
        style={[Style.flexRowCenter, { marginVertical: 2, paddingVertical: 5 }]}
      >
        <Text style={[Style.h3, { flex: 1 }]}> - </Text>
        <Text style={[Style.h3, { flex: 3 }]}>{I18n.t(`states.${report.status}`)}</Text>
        <View style={{ flex: 3, alignItems: 'flex-end', justifyContent: 'flex-end' }}>{label}</View>
      </TouchableOpacity>
    );
  }

  _renderAction(action) {
    return (

      <TouchableOpacity
        onPress={this._onPressAction.bind(this, action.name)}
        style={[Style.flexRowCenter, { marginVertical: 2, paddingVertical: 5 }]}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
          <Glyphicons
            name={action.icon}
            size={IconSize.medium}
            color={Colors.greyDarker.code}
            style={{
              textAlign: 'center',
              width: IconSize.medium * 2
            }}
          />
        </View>

        <Text style={[Style.h3, { flex: 3 }]}>{I18n.t(`sideMenu.${action.name}`)}</Text>
      </TouchableOpacity>
    );
  }

  _deleteAccountAfterConfirm(account) {
    if (account._isCandidateForDeletion) {
      const selectedAccount = compteSecureService.delete(account);
      this.setState({
        selectedAccount: { compte: {} },
        fichePersonnelle: {},
        actions: ds.cloneWithRows({}),
        accounts: ds.cloneWithRows({}),
        report: ds.cloneWithRows({})
      });

      if (selectedAccount === null) {
        Actions.presentation({ type: 'reset' });
        Actions.refresh({ key: 'drawer', open: false });
      } else {
        this.componentDidMount();
      }
    }
  }

  _onPressAccount(account) {
    if (account._isCandidateForDeletion) {
      const title = I18n.t('sideMenu.confirm.title');
      let message = I18n.t('sideMenu.confirm.deletionSimple');
      if (compteSecureService.shouldUseApiServiceWith(account)) {
        message = I18n.t('sideMenu.confirm.deletion', { typeCompte: account.typeCompte });
      }

      Alert.alert(title, message,
        [
          {
            text: I18n.t('Alert.ok'),
            onPress: this._deleteAccountAfterConfirm.bind(this, account)
          },
          { text: I18n.t('Alert.cancel'), style: 'cancel' }
        ]
      );
    } else {
      compteSecureService.setSelected(account);
      this._componentDidMount().then(() => {
        Actions.chargement();
      });
    }
  }

  _onLongPressAccount(account) {
    const accounts = compteSecureService.findAll().map((acc) => {
      if (acc.id === account.id) {
        acc._isCandidateForDeletion = true;
      }
      return acc;
    });
    this.setState({ accounts: ds.cloneWithRows(accounts) });
  }

  _renderAccountIcon(account) {
    const iconName = account.typeCompte === TYPES.AUTONOME ? 'theater' : 'user';
    const color = account._isCandidateForDeletion ? Colors.redGoogle.code : Colors.greyDarker.code;
    return <Glyphicons name={iconName} size={IconSize.medium} color={color} />;
  }

  _getAccountName(fichePersonnelle) {
    if (fichePersonnelle) {
      if (fichePersonnelle.prenom || fichePersonnelle.nom) {
        return `${fichePersonnelle.prenom ? fichePersonnelle.prenom : ''}
          ${fichePersonnelle.nom ? fichePersonnelle.nom : ''}`;
      }
    }
    return I18n.t('FichePersonnelle.anonymous');
  }

  _renderAccount(account) {
    const compte = account.compte;
    const iconStyle = { flex: 1, alignItems: 'center', justifyContent: 'center' };

    let society = null;
    const accountStyle = null;
    let selectedIcon = null;
    let fichePersonnelle = null;

    const buttonStyle = null;

    if (account._isCandidateForDeletion) {
      selectedIcon =
        (<View animation="jello" style={[iconStyle]}>
          <MaterialIcons
            name="remove-circle"
            size={IconSize.medium}
            style={Colors.redGoogle.color()}
          />
        </View>);
      fichePersonnelle = compte.idFichePersonnelle
        ? fichePersonnelleService.find(compte.idFichePersonnelle) : null;
    } else if (account.isSelected) {
      selectedIcon = (<View style={[iconStyle]}>
        <MaterialIcons name="check" size={IconSize.medium} style={Colors.yellowGreen.color()} />
      </View>);
      fichePersonnelle = this.state.fichePersonnelle;
    } else {
      selectedIcon = <View style={iconStyle} />;
      fichePersonnelle = compte.idFichePersonnelle
        ? fichePersonnelleService.find(compte.idFichePersonnelle) : null;
    }

    if (fichePersonnelle && fichePersonnelle.societe) {
      society = <Text style={Style.h3} numberOfLines={1}> {fichePersonnelle.societe}</Text>;
      iconStyle.minHeight = IconSize.medium * 2;
    }

    return (

      <TouchableOpacity
        onPress={this._onPressAccount.bind(this, account)}
        onLongPress={this._onLongPressAccount.bind(this, account)}
        style={[Style.flexRowCenter, { marginVertical: 10 }, buttonStyle]}
      >

        <View style={iconStyle}>
          {this._renderAccountIcon(account)}
        </View>

        <View style={[{ flex: 4 }, accountStyle]}>
          <Text style={[Style.h3]} numberOfLines={1}>
            {this._getAccountName(fichePersonnelle)}
          </Text>
          {society}
        </View>

        {selectedIcon}

      </TouchableOpacity>
    );
  }

  _onPressAddAccount() {
    Actions.connexion({ shouldAddAccount: true });
  }

  _toggleContent() {
    this.setState({ isAccountsDisplayed: !this.state.isAccountsDisplayed });
  }

  _renderContent() {
    if (this.state.isAccountsDisplayed) {
      return (<View style={{ padding: 10, flex: 1 }}>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.accounts}
          renderRow={this._renderAccount.bind(this)}
        />

        <TouchableOpacity
          onPress={this._onPressAddAccount.bind(this)}
          style={[Style.flexRowCenter]}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
            <MaterialIcons name="add" size={IconSize.medium} style={[Colors.greyDarker.color()]} />
          </View>

          <Text style={[Style.h3, { flex: 3 }]}>{I18n.t('sideMenu.addAccount')}</Text>

          <View style={{ flex: 1 }} />

        </TouchableOpacity>

      </View>);
    }

    return (<View>
      <View style={{ padding: 10 }}>

        <Text style={[Style.h3]}>
          {`${I18n.t('account.currentFees')} :`}
        </Text>

        <ListView
          enableEmptySections={true}
          style={{ paddingLeft: 15 }}
          dataSource={this.state.report}
          renderRow={this._renderReport.bind(this)}
        />

      </View>

      <View style={{ height: 1, backgroundColor: '#CCCCCC', }} />

      <ListView
        enableEmptySections={true}
        style={{ paddingVertical: 10 }}
        dataSource={this.state.actions}
        renderRow={this._renderAction.bind(this)}
      />
    </View>);
  }

  _getAccountIcon = () => this.state.isAccountsDisplayed ? 'arrow-drop-up' : 'arrow-drop-down';

  /**
   * Méthode éxécuté lors du rendu du composant.
   *
   * @function render
   * @return react~Component
   */
  render() {
    const compte = this.state.selectedAccount && this.state.selectedAccount.compte
      ? this.state.selectedAccount.compte : {};
    return (
      <View style={Style.sideMenu}>
        <View style={[{ padding: 5, paddingTop: 50 }, Colors.red.background()]}>
          <TouchableOpacity onPress={this._toggleContent.bind(this)} style={{ height: 50 }}>
            <Text style={[Style.h3, Colors.white.color()]}>
              {this._getAccountName(this.state.fichePersonnelle)}
            </Text>
            <View style={[Style.inline, { padding: 5 }]}>
              <Text style={[{ flex: 1 }, Colors.white.color()]}>
                {I18n.t(`account.${compte.typeCompte}`)}
              </Text>
              <MaterialIcons
                name={this._getAccountIcon()}
                size={IconSize.medium}
                style={[Colors.white.color()]}
              />
            </View>
          </TouchableOpacity>

        </View>

        <ScrollView ref="scrollView" keyboardDismissMode="none" showsVerticalScrollIndicator={true}>
          {this._renderContent()}
        </ScrollView>

      </View >);
  }
}

export default class DrawerSideMenu extends Component {
  render() {
    const state = this.props.navigationState;
    const children = state.children;

    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={() => Actions.refresh({ key: state.key, open: true })}
        onClose={() => Actions.refresh({ key: state.key, open: false })}
        onCloseStart={state.onCloseStart}
        type="overlay"
        content={<SideMenu />}
        tapToClose={true}
        openDrawerOffset={0.2}
        closedDrawerOffset={-3}
        panCloseMask={0.2}
        useInteractionManager={true}
        acceptPan={true}
        styles={{
          drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
        }}
        tweenHandler={ratio => ({
          main: { opacity: (2 - ratio) / 2 }
        })
        }
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}
