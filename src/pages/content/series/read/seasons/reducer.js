import { SERIES_ENTRY_SEASONS_FETCH_SUCCESS } from '../../../../../actions/series';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: SERIES_ENTRY_SEASONS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
