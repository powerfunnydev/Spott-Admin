import { BROADCASTER_USERS_FETCH_SUCCESS } from '../../../../../actions/broadcaster';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: BROADCASTER_USERS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
