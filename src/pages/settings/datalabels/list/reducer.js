import { DATALABELS_FETCH_SUCCESS } from '../../../../actions/datalabel';
import createPageReducer from '../../../_common/createPageReducer';
import { SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX } from './actions';

export default createPageReducer({ DATA_FETCH_SUCCESS: DATALABELS_FETCH_SUCCESS, SELECT_ALL_CHECKBOXES, SELECT_CHECKBOX });
