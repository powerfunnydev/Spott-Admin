import { COMMERCIALS_FETCH_SUCCESS } from '../../../../actions/commercial';
import { BRANDS_SEARCH_START, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../_common/createPageReducer';

const commercialListPageReducer = createPageReducer({ DATA_FETCH_SUCCESS: COMMERCIALS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });

export default (state, action) => {
  const newState = commercialListPageReducer(state, action);

  switch (action.type) {
    case BRANDS_SEARCH_START:
      return newState.set('currentBrandsSearchString', action.searchString);
    default:
      return newState;
  }
};
