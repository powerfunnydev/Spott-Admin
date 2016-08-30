import React from 'react';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import createStore from './createStore';
import { authenticate, init } from './actions/global';

import Wrapper from './components/wrapper';
import Error404 from './components/error404/main';
import MediaSinglePage from './components/media/singlePage';
import MediaHome from './components/media/home';
import MediaUpload from './components/media/upload';
import MediaWelcome from './components/media/welcome';

import reducer from './reducers';

/**
 * The application routes
 */
const routes = (
  <Route component={Wrapper}>
    <Route component={MediaWelcome} path='/' />
    <Route component={MediaSinglePage} path='media'>
      <IndexRoute component={MediaHome}/>
      <Route component={MediaUpload} path='upload' />
    </Route>
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

  // TODO: Remove this...
  store.dispatch(authenticate('Admin', '781c2a15-f616-4df5-9ebb-9a9e772497ff'));

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
