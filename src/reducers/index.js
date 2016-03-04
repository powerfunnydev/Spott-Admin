import { combineReducers } from 'redux-immutablejs';
import media from './media';
import globalReducer from './global';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';

/**
 * The application's main reducer
 */
export default combineReducers({
  form,
  media,
  global: globalReducer,
  router
});
