import { PUSH_NOTIFICATIONS_FETCH_SUCCESS } from '../../../../actions/pushNotification';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: PUSH_NOTIFICATIONS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
