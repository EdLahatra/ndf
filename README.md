# Compta.com | Application `Note de frais`

## Outils

- [Node.js](https://nodejs.org/en/download/package-manager/)
- [npm](https://www.npmjs.com)
- [react-native]() *[framework mobile]*
- [react](https://facebook.github.io/react) *[framework web]*
- [ES6](https://github.com/lukehoban/es6features) *[nouvelle version de JavaScript]*
- [mocha]() *[Tests]*
- [eslint]() *[Qualité syntaxique]*
- [esdoc](https://github.com/esdoc) *[Documentation]*
Ó
## Getting started

Ce guide se base sur la documentation de [react-native](https://facebook.github.io/react-native/docs/getting-started.html)

### Installation de Nodejs, react-native-cli

* Suivre la procédure d'intallation de Node.js en [fonction de votre distribution](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

*  Installation de react-native-cli en global :

 ```
 ~ npm install -g react-native-cli
 ```
* Installation de Watchman pour améliorer les performances (optionnel) en [fonction de votre OS](https://facebook.github.io/watchman/docs/install.html#build-install)

### Installation du SDK ANDROID

* Téléchargement et installation d'[Android Studio](https://developer.android.com/studio/install.html)
* Configuration du sdk souhaité (6.0) via Appearance and Behavior → System Settings → Android SDK.
* Mise à jour des paths vers le SDK

* Editer le fichier `~/.gradle/gradle.properties`

```
org.gradle.daemon=true
MYAPP_RELEASE_STORE_FILE=debug.keystore
MYAPP_RELEASE_KEY_ALIAS=androiddebugkey
MYAPP_RELEASE_STORE_PASSWORD=android
MYAPP_RELEASE_KEY_PASSWORD=android
```

### Installation de SDK IOs

Pour IOS, il faut installer Xcode via l'Apple Store.

### Installation des dépendances Node

```
NoteDeFrais ~ npm install
NoteDeFrais ~ rnpm link

```
### Installation et configuration des plugins

#### [react-native-fbsdk](https://github.com/facebook/react-native-fbsdk)

Le plugin a besoin du SDK Facebook, suivre les procédures suivantes :
* [Android](https://developers.facebook.com/docs/android/getting-started/)
* [IOS](https://developers.facebook.com/docs/ios/getting-started/)

#### [react-native-image-picker](https://github.com/marcshilling/react-native-image-picker)

Pour IOS seulement :

1. Ouvrir le projet `NoteDeFrais` dans Xcode, dans la vue de navigation du projet à gauche faire un click droit sur le dossier `Libraries` et `Add File to...`
2. Aller dans node_modules ➜ react-native-image-picker ➜ ios ➜ select RNImagePicker.xcodeproj
3. Ajouter RNImagePicker.a to Build Phases -> Link Binary With Libraries
5. Compile and have fun

### Exécution des tests unitaires

La première fois exécuter le script before-unit-test.sh pour résoudre un problème de compatibilité temporaire entre
la librairie Realm (base de donnée) et le la libraire mocha (outil de tests unitaires).

```
NoteDeFrais ~ sudo apt-get install build-essential
NoteDeFrais ~ npm install -g node-gyp
NoteDeFrais ~ ./before-unit-test.sh
```

Puis exécuter les tests avec npm :

```
NoteDeFrais ~ npm run test
```

### Génération du rapport de couverture de tests

```
NoteDeFrais ~ npm run coverage
NoteDeFrais ~ open coverage/lcov-report/index.html
```

### Exécution de l'analyseur syntaxique

```
NoteDeFrais ~ npm run lint
```

### Génération de la documentation

Installer esdoc en global sur la machine la première fois :

```
NoteDeFrais ~ npm install -g esdoc
```

Puis générer la documentation :

```
NoteDeFrais ~ esdoc -c esdoc.json
NoteDeFrais ~ open ../NoteDeFrais-Doc/index.html
```

### Génération des Glyphicons

```
NoteDeFrais ~ npm run
```

### Développement

Dans un premier onglet de terminal
```
NoteDeFrais ~ npm run start
```

Puis dans un second onglet
```
NoteDeFrais ~ react-native run-android
```

## Configuration

La configuration se trouve dans le fichier `app/config/environment.js`

### Liens

Pour modifier les liens externes :

```
  config: {
    urlSite: 'http://www.compta.com/',
    urlCGU: 'http://www.compta.com/'
  }
```

### API (GESCAB, Compta.com & Autonome)

Les valeurs à mettre dans le fichier sont :

```
 Autonome: {
    oauth: {},
    api: [
      {
        url: 'https://test.compta.com/API/rest/notesDeFrais/v1',
        pathUnsecured: ['baremesKilometriques']
      }, {
        url: 'https://test.compta.com/Gestemps/rest/notesDeFrais/v1',
        pathUnsecured: ['envoiNoteDeFrais']
      }
    ]
  },

  ComptaCom: {
    oauth: {
      url: 'https://test.compta.com/API/rest/token',
      grant_type: 'password',
      client_id: 'oauth2clientid',
      client_secret: 'oauth2clientsecret'
    },
    api: [
      {
        url: 'https://test.compta.com/API/rest/notesDeFrais/v1',
        pathUnsecured: ['baremesKilometriques']
      }
    ]
  },

  Gescab: {
    oauth: {
      url: 'https://test.compta.com/Gestemps/rest/token',
      grant_type: 'password',
      client_id: 'oauth2clientid',
      client_secret: 'oauth2clientsecret'
    },

    api: [
      {
        url: 'https://test.compta.com/Gestemps/rest/notesDeFrais/v1',
        pathUnsecured: ['baremesKilometriques']
      }
    ]
  },
```

### Appareil photo

Pour régler la qualité des photos

```
  cameraConfig: {
    path: 'ComptaCom',
    maxWidth: 720,
    maxHeight: 1280,
    quality: 0.9
  }
```

### Google

Pour modifier l'accès à l'api Distance matrix :
```
  DistanceMatrix: {
    url: 'https://maps.googleapis.com/maps/api/distancematrix/json?',
    key: 'AIzaSyDfyBXce-Kwo46jZMcRXFwMatCxlSW8G20'
  }
```

Pour modifier l'accès à l'api Places
```
  Places: {
    key: 'AIzaSyDfyBXce-Kwo46jZMcRXFwMatCxlSW8G20'
  }
```

Pour modifier l'accès à Google Analytics
```
  Analytics: {
    trackerId: 'UA-85613196-1'
  }
```

Pour modifier l'accès à l'api GoogleSignin
```
  GoogleSignin: {
    iosClientId: '{IOS_CLIENT_ID}.apps.googleusercontent.com',
    webClientId: '{WEB_CLIENT_ID}.apps.googleusercontent.com'
  },
```
Spécificité IOS pour GoogleSignin:

> Il faut également modifier le fichier `ios/NoteDeFrais/Info.plist` et ajouter un type d'URL suivant `com.googleusercontent.apps.{IOS_CLIENT_ID}` soit avec un éditeur de texte soit avec XCODE

```xml
...
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>com.googleusercontent.apps.307360444785-tstscmkaktt7a408jk0lbv2csjh3pgf8</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.307360444785-tstscmkaktt7a408jk0lbv2csjh3pgf8</string>
    </array>
  </dict>
...
```
## Déploiement

### En test

#### Android

Pour générer un APK de test dans (./android/app/build/outputs/apk/apk-release.apk)

```
NoteDeFrais ~ cd android && ./gradlew clean  assembleRelease  
```

#### IOs

Pour IOS, il faut modifier la []configuration dans Xcode](https://facebook.github.io/react-native/docs/running-on-device.html#building-your-app-for-production)
puis utiliser la procédure [suivante via Xcode]( https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4)

### En Production

#### Google Play Store

*TODO*

#### Apple Store

*TODO*
