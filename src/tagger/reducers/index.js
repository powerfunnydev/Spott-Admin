import { combineReducers } from 'redux-immutablejs';
import { routerReducer as router } from 'react-router-redux';
import globalReducer from './global';
import app from './app';
import collections from './collections';
import crops from './crops';
import curator from './curator';
import data from './data';
import marker from './marker';
import modal from './modal';
import mvp from './mvp';
import organizer from './organizer';
import quickies from './quickies';
import similarFrames from './similarFrames';
import toast from './toast';

/**
 * The application's main reducer.
 */
export default combineReducers({
  global: globalReducer,
  router,
  tagger: combineReducers({
    app,
    collections,
    crops,
    curator,
    data,
    marker,
    modal,
    mvp,
    organizer,
    quickies,
    similarFrames,
    toast
  })
});
