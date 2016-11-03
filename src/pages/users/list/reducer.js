import { USERS_FETCH_SUCCESS } from '../../../actions/user';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: USERS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
