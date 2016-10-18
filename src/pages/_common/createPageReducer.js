import { fromJS } from 'immutable';

export default ({ DATA_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX }) => (state = fromJS({
  isSelected: { ALL: false },
  pageCount: 0,
  totalResultCount: 0
}), action) => {
  switch (action.type) {
    case DATA_FETCH_SUCCESS:
      const arrayOfObjects = action.data.data;
      const initIsSelected = { ALL: false };
      for (const obj of arrayOfObjects) {
        initIsSelected[obj.id] = false;
      }
      return state.set('isSelected', fromJS(initIsSelected))
            .set('pageCount', action.data.pageCount).set('totalResultCount', action.data.totalResultCount);
    case SELECT_ALL_CHECKBOXES: {
      const editIsSelected = state.get('isSelected').toJS();
      const checked = !editIsSelected.ALL;
      editIsSelected.ALL = checked;
      for (const key in editIsSelected) {
        editIsSelected[key] = checked;
      }
      return state.set('isSelected', fromJS(editIsSelected));
    }
    case SELECT_CHECKBOX: {
      return state.setIn([ 'isSelected', action.id ], !state.getIn([ 'isSelected', action.id ]));
    }
    // Uninteresting actions
    default:
      return state;

  }
};
