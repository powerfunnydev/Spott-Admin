import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX, SELECT_ENTITY } from './actions';
import { CROPS_FETCH_SUCCESS } from '../../../actions/media';
import { fromJS } from 'immutable';

export default (state = fromJS({}), action) => {
  switch (action.type) {
    case CROPS_FETCH_SUCCESS:
      const arrayOfObjects = action.data.data;
      const initIsSelected = { ALL: false };
      for (const obj of arrayOfObjects) {
        initIsSelected[obj.id] = false;
      }
      return state.setIn([ action.mediumId, 'isSelected' ], fromJS(initIsSelected))
            .setIn([ action.mediumId, 'pageCount' ], action.data.pageCount).setIn([ action.mediumId, 'totalResultCount' ], action.data.totalResultCount);
    case SELECT_ALL_CHECKBOXES: {
      const editIsSelected = state.getIn([ action.mediumId, 'isSelected' ]).toJS();
      const checked = !editIsSelected.ALL;
      editIsSelected.ALL = checked;
      for (const key in editIsSelected) {
        editIsSelected[key] = checked;
      }
      return state.setIn([ action.mediumId, 'isSelected' ], fromJS(editIsSelected));
    }
    case SELECT_CHECKBOX: {
      return state.setIn([ action.mediumId, 'isSelected', action.id ], !state.getIn([ action.mediumId, 'isSelected', action.id ]));
    }
    case SELECT_ENTITY: {
      return state.setIn([ action.mediumId, 'selectedEntity' ], action.id);
    }
    // Uninteresting actions
    default:
      return state;

  }
};
