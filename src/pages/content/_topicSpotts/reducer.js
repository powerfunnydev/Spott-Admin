import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX, SELECT_ENTITY } from './actions';
import { SPOTTS_FETCH_SUCCESS } from '../../../actions/topic';
import { fromJS } from 'immutable';

export default (state = fromJS({}), action) => {
  switch (action.type) {
    case SPOTTS_FETCH_SUCCESS:
      const arrayOfObjects = action.data.data;
      const initIsSelected = { ALL: false };
      for (const obj of arrayOfObjects) {
        initIsSelected[obj.id] = false;
      }
      return state.setIn([ action.topicId, 'isSelected' ], fromJS(initIsSelected))
            .setIn([ action.topicId, 'pageCount' ], action.data.pageCount).setIn([ action.topicId, 'totalResultCount' ], action.data.totalResultCount);
    case SELECT_ALL_CHECKBOXES: {
      const editIsSelected = state.getIn([ action.topicId, 'isSelected' ]).toJS();
      const checked = !editIsSelected.ALL;
      editIsSelected.ALL = checked;
      for (const key in editIsSelected) {
        editIsSelected[key] = checked;
      }
      return state.setIn([ action.topicId, 'isSelected' ], fromJS(editIsSelected));
    }
    case SELECT_CHECKBOX: {
      return state.setIn([ action.topicId, 'isSelected', action.id ], !state.getIn([ action.topicId, 'isSelected', action.id ]));
    }
    case SELECT_ENTITY: {
      return state.setIn([ action.topicId, 'selectedEntity' ], action.id);
    }
    // Uninteresting actions
    default:
      return state;

  }
};
