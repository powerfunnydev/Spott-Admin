import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX, SELECT_ENTITY, TV_GUIDE_ENTRIES_FETCH_SUCCESS } from './actions';
import createPageReducer from '../../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: TV_GUIDE_ENTRIES_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX, SELECT_ENTITY });
