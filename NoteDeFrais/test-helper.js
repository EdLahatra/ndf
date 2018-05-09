require('babel-polyfill');
require('react-native-mock/mock');
const mockery = require('mockery');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const modulesToCompile = [
  'react-native-vector-icons',
  'react-native-mock',
  'react-native-image-picker',
  'react-native-router-flux',
  'react-native-tabs',
  'tcomb-form-native',
  'react-native-experimental-navigation',
  'react-native-loading-spinner-overlay',
  'react-native-animatable'
].map(moduleName => new RegExp(`/node_modules/${moduleName}`));

function getBabelRC() {
  const rcpath = path.join(__dirname, '.babelrc');
  const source = fs.readFileSync(rcpath).toString();
  return JSON.parse(source);
}

const config = getBabelRC();

config.ignore = function (filename) {
  if (!(/\/node_modules\//).test(filename)) {
    // console.log(filename, 'FALSE');
    return false; // if not in node_modules, we want to compile it
  }

  const matches = modulesToCompile.filter(regex => regex.test(filename));
  const shouldIgnore = matches.length === 0;
  return shouldIgnore;
};

require('babel-register')(config);

global.__DEV__ = true;

// var chai = require('chai');
// var dirtyChai = require('dirty-chai');
// chai.use(dirtyChai);

// import chai from 'chai';
// import dirtyChai from 'dirty-chai';
// import chaiImmutable from 'chai-immutable';

// chai.use(dirtyChai);
// chai.use(chaiImmutable);

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

mockery.registerMock('react-native-i18n', { t: key => key, toNumber: value => value });
mockery.registerMock('react-native-google-analytics-bridge', {});
mockery.registerMock('react-native-keychain', {});

mockery.registerMock('react-native-router-flux', {
  Actions: {
    refresh: () => {
    }
  }
});
mockery.registerMock('./select', {});
mockery.registerMock('./datepicker', {});
mockery.registerMock('./menu_burger.png', {});
mockery.registerMock('./back_chevron.png', {});

global.window = { fetch };
