import React from 'react';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import createStore from './createStore';
import { init } from './actions/global';
import { LOGIN_SUCCESS } from './actions/users';

import Wrapper from './pages/wrapper';
import Error404 from './pages/error404/main';
import MediaSinglePage from './pages/media/singlePage';
import MediaHome from './pages/media/home';
import MediaUpload from './pages/media/upload';
import MediaWelcome from './pages/media/welcome';
import Reporting from './pages/reporting';

import reducer from './reducers';

/**
 * The application routes
 */
const routes = (
  <Route component={Wrapper}>
    <Route component={MediaWelcome} path='/' />
    <Route component={MediaWelcome} path='reset-password' resetPassword />
    <Route component={MediaSinglePage} path='media'>
      <IndexRoute component={MediaHome}/>
      <Route component={MediaUpload} path='upload' />
    </Route>
    <Route component={Reporting} path='reporting' />
    <Route component={Error404} path='*' />
  </Route>
);

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
        {routes}
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}

boot();
