import { SEASONS_FETCH_SUCCESS } from '../../../../actions/season';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: SEASONS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
