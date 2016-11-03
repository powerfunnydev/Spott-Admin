import { BROADCAST_CHANNEL_ENTRIES_FETCH_SUCCESS } from '../../../../actions/broadcastChannel';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';
import createPageReducer from '../../../_common/createPageReducer';

export default createPageReducer({ DATA_FETCH_SUCCESS: BROADCAST_CHANNEL_ENTRIES_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
