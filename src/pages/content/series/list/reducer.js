import { SERIES_ENTRIES_FETCH_SUCCESS } from '../../../../actions/series';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: SERIES_ENTRIES_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
