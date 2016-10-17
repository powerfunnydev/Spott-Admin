import { fromJS } from 'immutable';
import { CONTENT_PRODUCERS_FETCH_SUCCESS, CONTENT_PRODUCERS_SORTED_FETCH_SUCCESS } from '../../../actions/contentProducers';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX, SORT_COLUMN, NONE } from './actions';

export default (state = fromJS({
  contentProducers: [],
  isSelected: { ALL: false },
  sortDirections: {}
}), action) => {
  switch (action.type) {
    case CONTENT_PRODUCERS_FETCH_SUCCESS:
      const arrayOfContentProducers = action.data;
      const initIsSelected = state.get('isSelected').toJS();
      for (const obj of arrayOfContentProducers) {
        initIsSelected[obj.uuid] = false;
      }
      return state.set('isSelected', fromJS(initIsSelected)).set('contentProducers', fromJS(arrayOfContentProducers));
    case CONTENT_PRODUCERS_SORTED_FETCH_SUCCESS:
      return state.set('contentProducers', fromJS(action.data));
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
      const editIsSelected = state.get('isSelected').toJS();
      return state.set('isSelected', fromJS({ ...editIsSelected, ...{ [action.id]: !editIsSelected[action.id] } }));
    }
    case SORT_COLUMN: {
      const currentSortDirection = state.getIn([ 'sortDirections', action.sortField ]) || NONE;
      return state.setIn([ 'sortDirections', action.sortField ], (currentSortDirection + 1) % 3);
    }
    // Uninteresting actions
    default:
      return state;

  }
};
