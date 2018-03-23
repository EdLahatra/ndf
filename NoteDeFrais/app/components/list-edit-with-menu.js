'use strict';

import { Actions, } from 'react-native-router-flux';
import ListEdit from './list-edit';

export default class ListEditWithMenu extends ListEdit {

  componentWillMount () {
    Actions.refresh({ key: 'drawer', open: false });
  }

}
