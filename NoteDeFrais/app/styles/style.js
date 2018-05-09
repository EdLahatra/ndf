import { StyleSheet, PixelRatio } from 'react-native';
import PlatformHelper from '../lib/platform-helper';

const NAVBAR_HEIGHT = 54;

export class Color {
  constructor(code) {
    this.code = code;
  }

  background() {
    return { backgroundColor: this.code };
  }

  color() {
    return { color: this.code };
  }

  toString() {
    return this.code;
  }
}

export const Colors = {
  red: new Color('#f44336'),
  redGoogle: new Color('#db3236'),
  white: new Color('#ffffff'),
  yellowGreen: new Color('yellowgreen'),
  blue: new Color('#03A9F4'), // 00bfff
  blueFacebook: new Color('#3b5998'),
  black: new Color('black'),
  greyLighter: new Color('#eee'),
  grey: new Color('#a9a9a9'),
  greyDarker: new Color('#616161'),
  gold: new Color('#FDD835'),
  orange: new Color('#FFA726')
};

export const IconSize = {
  small: 20,
  medium: 30,
  large: 42,
  xxlarge: 120
};

export const Style = StyleSheet.create({
  flex: {
    flex: 1,
  },

  flexRowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  flexRowCenterEnd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  textLeft: {
    textAlign: 'left',
  },

  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    backgroundColor: Colors.red.code,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxHeight: NAVBAR_HEIGHT
  },

  modalNavBar: {
    height: NAVBAR_HEIGHT,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.red.code,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxHeight: NAVBAR_HEIGHT
  },

  loginContainer: {},

  navBarIcon: {
    color: Colors.white,
    marginHorizontal: 6
  },

  sideMenu: {
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: Colors.white.code
  },

  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: NAVBAR_HEIGHT,
    paddingLeft: 20,
    paddingRight: 20,
  },

  containerWithHeader: {
    flex: 1,
    paddingBottom: 20
  },

  containerWithNavBar: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'column',
    paddingTop: NAVBAR_HEIGHT,
  },

  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5
  },

  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 5
  },

  h3: {
    alignItems: 'center',
    fontSize: 16,
    margin: 5
  },

  h4: {
    fontSize: 14,
    margin: 2
  },

  navBarTitle: {
    color: Colors.white,
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5
  },

  link: {
    color: Colors.blue,
  },

  button: {
    backgroundColor: Colors.blue.code,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowColor: Colors.grey.code,
    shadowOpacity: 0.8,
  },

  inline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },

  buttonSecondary: {
    backgroundColor: Colors.grey.code,
    margin: 10,
    padding: 10
  },

  buttonTextSecondary: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
  },

  buttonTopRight: {
    position: 'absolute',
    right: 0,
    top: 0
  },

  buttonAbovePrevious: {
    position: 'absolute',
    right: 15,
    bottom: IconSize.medium / 2 - 10 // eslint-disable-line
  },

  buttonAction2: {
    backgroundColor: Colors.blue.code,
    color: 'white',
    width: IconSize.medium + 20,
    maxHeight: IconSize.medium + 20,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center'
  },

  buttonActionContainer: {
    position: 'absolute',
    bottom: 30,
    right: 12,
    maxHeight: IconSize.medium + 20,
    minHeight: IconSize.medium + 20
  },

  buttonAction: {
    borderRadius: 50,
    backgroundColor: Colors.blue.code,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    padding: 10,
    shadowColor: Colors.grey.code,
    shadowOpacity: 0.8,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },

  formRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  rowListView: {
    alignItems: 'center',
    height: 75
  },

  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  columnCenter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  label: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5
  },

  badge: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 7
  },

  labelSmall: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5
  },

  labelSmallText: {
    color: Colors.white,
    fontSize: 14,
  },

  labelText: {
    color: Colors.white,
    fontSize: 16,
  },

  success: {
    backgroundColor: Colors.yellowGreen.code,
  },

  header: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'space-around',
    padding: 10
  },

  content: {
    flex: 2,
    justifyContent: 'space-between'
  },

  input: {
    flex: 1,
    maxWidth: 350,
    padding: 5,
    borderWidth: 0,
    fontSize: 16,
    marginVertical: 10
  },

  checkboxLabel: {
    flex: 1,
    minWidth: 300,
    maxWidth: 300,
    borderWidth: 0,
    fontSize: 16,
    marginVertical: 5
  },

  select: {
    flex: 1,
    maxWidth: 400,
    padding: 5,
    marginRight: PlatformHelper.getSelectMarginRight(),
    borderWidth: 0
  },

  imagePreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: Colors.black.code
  },

  imagePreviewActions: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    top: 0,
    left: 0,
    right: 0,
    height: IconSize.medium + 10,
    position: 'absolute'
  },

  iconPreviewActions: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    height: IconSize.medium + 10,
  },

  imageListPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: IconSize.small * 2,
    height: IconSize.small * 2,
    marginRight: 10,
    marginLeft: -5,
    backgroundColor: Colors.greyLighter.code,
    borderRadius: 20
  },

  imagePreviewIcon: {
    margin: 5,
    color: Colors.white
  },

  placeholder: {
    color: '#c9c9c9'
  },

  autoCompleteTextInputContainer: {
    backgroundColor: '#C9C9CE',
    maxHeight: 45,
    height: 45,
    minHeight: 45,
    borderTopColor: '#7e7e7e',
    borderBottomColor: '#b5b5b5',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
  },

  autoCompleteTextInput: {
    backgroundColor: '#FFFFFF',
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
  },

  autoCompleteListRow: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },

  autoCompleteListSeparator: {
    height: 1,
    backgroundColor: '#c8c7cc',
  },

});
