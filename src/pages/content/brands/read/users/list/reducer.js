import { BRAND_USERS_FETCH_SUCCESS } from '../../../../../../actions/brand';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: BRAND_USERS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
