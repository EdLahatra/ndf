/*
 a bootstrap like style
 */
'use strict';

const LABEL_COLOR = '#000000';
const INPUT_COLOR = '#000000';
const ERROR_COLOR = '#FFEBEE';
const HELP_COLOR = '#999999';
const BORDER_COLOR = '#cccccc';
const DISABLED_COLOR = '#777777';
const DISABLED_BACKGROUND_COLOR = '#eeeeee';
const FONT_SIZE = 17;
const FONT_WEIGHT = '500';

const stylesheet = Object.freeze({
  fieldset: {},
  // the style applied to the container of all inputs
  formGroup: {
    normal: {
    },
    error: {
    }
  },
  controlLabel: {
    normal: {
      color: LABEL_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT
    },
    // the style applied when a validation error occours
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 2
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 2
    }
  },
  errorBlock: {
    fontSize: FONT_SIZE,
    marginBottom: 2,
    color: ERROR_COLOR
  },
  textbox: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      height: 36,
    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      height: 36,
      backgroundColor: ERROR_COLOR,
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: FONT_SIZE,
      height: 36,
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR,
    }
  },
  checkbox: {
    normal: {
    },
    // the style applied when a validation error occours
    error: {
    }
  },
  select: {
    normal: {
      height: 36
    },
    // the style applied when a validation error occours
    error: {
      height: 36,
      backgroundColor: ERROR_COLOR,
    },
  },
  pickerTouchable: {
    normal: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center'
    },
    error: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  pickerValue: {
    normal: {
      fontSize: FONT_SIZE,
      paddingLeft: 7
    },
    error: {
      fontSize: FONT_SIZE,
      paddingLeft: 7
    }
  },
  datepicker: {
    normal: {
    },
    // the style applied when a validation error occours
    error: {
    }
  },
  dateTouchable: {
    normal: {},
    error: {}
  },
  dateValue: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
    },
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
    }
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

module.exports = stylesheet;