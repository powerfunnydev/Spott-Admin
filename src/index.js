import React from 'react';
import { IndexRedirect, IndexRoute, Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import createStore from './createStore';
import { init } from './actions/global';
import { LOGIN_SUCCESS } from './actions/users';
import { ADMIN, BROADCASTER, CONTENT_MANAGER } from './constants/userRoles';

import App from './pages/app';
import BroadcastersList from './pages/content/broadcasters/list';
import BroadcastersCreateEntry from './pages/content/broadcasters/create';
import BroadcastersEditEntry from './pages/content/broadcasters/edit';
import BroadcastersReadEntry from './pages/content/broadcasters/read';
import BroadcastChannelCreateEntry from './pages/content/broadcastChannels/create';
import BroadcastChannelEditEntry from './pages/content/broadcastChannels/edit';
import ContentProducersList from './pages/content/contentProducers/list';
import ContentProducersCreateEntry from './pages/content/contentProducers/create';
import ContentProducersEditEntry from './pages/content/contentProducers/edit';
import Error404 from './pages/error404/main';
import MediaSinglePage from './pages/media/singlePage';
import MediaHome from './pages/media/home';
import MediaUpload from './pages/media/upload';
import MediaWelcome from './pages/media/welcome';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';
import Reporting from './pages/reporting';
import ReportingActivity from './pages/reporting/activity';
import ReportingRankings from './pages/reporting/rankings';
import TvGuideCreateEntry from './pages/tvGuide/create';
import TvGuideEditEntry from './pages/tvGuide/edit';
import TvGuideList from './pages/tvGuide/list';
import { authenticationTokenSelector, userRolesSelector } from './selectors/global';
import reducer from './reducers';

/**
 * The application routes
 */
 /* eslint-disable react/prop-types */
function getRoutes ({ getState }) {
  function requireOneRole (roles) {
    return (nextState, replace) => {
      const state = getState();
      if (!authenticationTokenSelector(state)) {
        return replace({ pathname: '/login', state: { returnTo: nextState.location } });
      }
      const currentRoles = userRolesSelector(state).toJS();
      let hasCorrectRoles = false;
      for (const role of currentRoles) {
        // If I have one of the roles, I'm authorized!
        hasCorrectRoles = hasCorrectRoles || roles.indexOf(role) > -1;
      }
      if (!hasCorrectRoles) {
        return replace({ pathname: '/', state: { returnTo: nextState.location } });
      }
    };
  }

  return (
    <Route component={App}>
      <Route component={MediaWelcome} path='/'>
        <Route component={Login} path='login' />
        <Route component={ForgotPassword} path='forgotpassword' />
        <Route component={ResetPassword} path='resetPassword' />
      </Route>
      <Route component={MediaSinglePage} path='media' onEnter={requireOneRole([ CONTENT_MANAGER, ADMIN ])}>
        <IndexRoute component={MediaHome}/>
        <Route component={MediaUpload} path='upload' />
      </Route>
      <Route component={Reporting} path='reporting' onEnter={requireOneRole([ BROADCASTER, CONTENT_MANAGER, ADMIN ])}>
        <IndexRedirect to='activity' />
        <Route component={ReportingActivity} path='activity' />
        <Route component={ReportingRankings} path='rankings' />
      </Route>
      <Route path='content' onEnter={requireOneRole([ CONTENT_MANAGER, ADMIN ])}>
        <IndexRedirect to='content-producers' />
        <Route component={ContentProducersList} path='content-producers'>
          <Route component={ContentProducersCreateEntry} path='create'/>
        </Route>
        <Route path='content-producers'>
          <Route component={ContentProducersEditEntry} path='edit/:id'/>
        </Route>
        <Route component={BroadcastersList} path='broadcasters'>
          <Route component={BroadcastersCreateEntry} path='create'/>
        </Route>
        <Route path='broadcasters'>
          <Route component={BroadcastersEditEntry} path='edit/:id'/>
          <Route component={BroadcastersReadEntry} path='read/:id'>
            <Route component={BroadcastChannelCreateEntry} path='create/broadcast-channel'/>
          </Route>
        </Route>
        <Route path='broadcast-channels'>
          <Route component={BroadcastChannelEditEntry} path='edit/:id' />
        </Route>
      </Route>
      <Route component={TvGuideList} path='tv-guide' onEnter={requireOneRole([ CONTENT_MANAGER, ADMIN ])}>
        <Route component={TvGuideCreateEntry} path='create' />
      </Route>
      <Route path='tv-guide' onEnter={requireOneRole([ CONTENT_MANAGER, ADMIN ])}>
        <Route component={TvGuideEditEntry} path='edit/:id' />
      </Route>
      <Route component={Error404} path='*' />
    </Route>
  );
}
/* eslint-eanble react/prop-types */

/**
 * Bootstrap the application. Performs all necessary initializations.
 */
async function boot () {
  // Enable some stuff during development to ease debugging
  if (process.env.NODE_ENV !== 'production') {
    // For dev tool support, attach to window...
    window.React = React;
  }

  // Create redux store
  const store = createStore(hashHistory, reducer);

  // Create an enhanced history that syncs navigation events with the store.
  const browserHistory = syncHistoryWithStore(hashHistory, store, { selectLocationState: (state) => state.get('router') });

  // Initialize configuration: save base urls in state, etc.
  await store.dispatch(init());

  // Load session from local storage.
  if (localStorage) {
    const session = localStorage.getItem('session');
    if (session) {
      store.dispatch({ data: JSON.parse(session), type: LOGIN_SUCCESS });
    }
  }

  // Render application
  ReactDOM.render(
    <Provider key='provider' store={store}>
      <Router history={browserHistory}>
        {getRoutes(store)}
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}

boot();
