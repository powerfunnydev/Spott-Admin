import { DATALABELTYPES_FETCH_SUCCESS } from '../../../../actions/datalabeltype';
import createPageReducer from '../../../_common/createPageReducer';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';

export default createPageReducer({ DATA_FETCH_SUCCESS: DATALABELTYPES_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
