import { combineReducers } from 'redux-immutablejs';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form/immutable';
import media from './media';
import globalReducer from './global';
import data from './data';
import reporting from '../pages/reporting/reducer';

/**
 * The application's main reducer
 */
export default combineReducers({
  data,
  form,
  media,
  global: globalReducer,
  reporting,
  router
});
