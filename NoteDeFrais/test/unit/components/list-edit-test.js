import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

import RealmService from '../../../app/services/RealmService';
import ListEdit from '../../../app/components/list-edit';

describe('Components: ListEdit', () => {

  let db;

  beforeEach(function () {

  });

  afterEach(function () {
  });

  it('should instantiate component', () => {
    const listEdit = new ListEdit();
    assert.isNotNull(listEdit);
    assert.equal(true, listEdit.shouldAdd());
    assert.equal(true, listEdit.shouldComponentUpdate());
    assert.deepEqual([], listEdit.getElements());
    assert.deepEqual({}, listEdit.state.selected);
    assert.isNull(listEdit._renderRowContent());
  });

  it('should load datasource', () => {
    const listEdit = new ListEdit();
    assert.isNotNull(listEdit._loadDatasource());
  });

  it('should will update component', () => {
    const listEdit = new ListEdit();
    const selected = [1, 2, 3];
    const state = {};
    listEdit.componentWillUpdate({ selected }, state);
    assert.deepEqual(selected, state.selected);
    assert.isNotNull(state.dataSource);
  });

  it('should long press element', () => {
    const listEdit = new ListEdit();
    const element = { id: 'foobar' };
    listEdit.onLongPress(element, false);
    assert.deepEqual({ foobar: true }, listEdit.state.selected);
    listEdit.onLongPress(element, true);
    assert.deepEqual({}, listEdit.state.selected);
    listEdit.onLongPress(element, false);
  });

  it('should press element', () => {
    const listEdit = new ListEdit();
    const element = { id: 'foobar' };
    listEdit.onLongPress(element, false);
    assert.equal(true, listEdit._isSelectedElement(element));
    listEdit.onPress(element, true);
    assert.equal(false, listEdit._isSelectedElement(element));
  });

  it('should render selected icon', () => {
    const listEdit = new ListEdit();
    assert.isNotNull(listEdit._renderSelectedIcon(true));
    assert.isNull(listEdit._renderSelectedIcon(false));
  });

  it('should render separator', () => {
    const listEdit = new ListEdit();
    assert.isNotNull(listEdit._renderSeparator());
  });

});
