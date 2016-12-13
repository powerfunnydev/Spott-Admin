import { combineReducers } from 'redux-immutablejs';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';
import globalReducer from './global';
import app from './app';
import data from './data';
import marker from './marker';
import modal from './modal';
import organizer from './organizer';
import quickies from './quickies';
import similarFrames from './similarFrames';
import toast from './toast';

/**
 * The application's main reducer.
 */
export default combineReducers({
  global: globalReducer,
  form,
  router,
  tagger: combineReducers({
    app,
    data,
    marker,
    modal,
    organizer,
    quickies,
    similarFrames,
    toast
  })
});
