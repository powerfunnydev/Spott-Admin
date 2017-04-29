import { Map } from 'immutable';
import {
  BRANDS_SEARCH_START, CLEAR_POP_UP_MESSAGE, FORGOT_PASSWORD_ERROR, FORGOT_PASSWORD_SUCCESS,
  BROADCASTERS_SEARCH_START, CONTENT_PRODUCERS_SEARCH_START,
  BROADCASTERS_SEARCH_ERROR, CONTENT_PRODUCERS_SEARCH_ERROR, USER_FETCH_ENTRY_ERROR
} from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentBrandsSearchString', action.searchString);
    case BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case FORGOT_PASSWORD_SUCCESS:
      return state.set('popUpMessage', { message: 'Password is successful reset!', type: 'hint' });
    case (FORGOT_PASSWORD_ERROR || BROADCASTERS_SEARCH_ERROR || CONTENT_PRODUCERS_SEARCH_ERROR || USER_FETCH_ENTRY_ERROR):
      console.log('error', action);
      let stackTrace;
      if (typeof action.error === 'string') {
        stackTrace = action.error;
      } else {
        stackTrace = action.error.message;
      }
      return state.set('popUpMessage', { message: 'Error occured by resetting password!', stackTrace, type: 'error' });
    case CLEAR_POP_UP_MESSAGE:
      return state.set('popUpMessage', {});
    // Uninteresting actions
    default:
      return state;

  }
};
