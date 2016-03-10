import React from 'react';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import createStore from './createStore';
import { authenticate } from './actions/global';
import { setBaseUrls } from './api/_request';
import { getConfig } from './api/config';

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

  // Retrieve the base url's from the server.
  await getConfig()
    .then((config) => {
      setBaseUrls(config.urls);

      // TODO: use authentication token of the CMS itself... (important!)
      switch (config.environment.toLowerCase()) {
        case 'testing':
          store.dispatch(authenticate('Admin', '66913386-34f5-4785-8eb0-6b4268614a51'));
          break;
        case 'acceptance':
          store.dispatch(authenticate('Admin', '2cc14d46-5388-4384-b0ff-24f3f406704e'));
          break;
        case 'production':
          store.dispatch(authenticate('Admin', '781c2a15-f616-4df5-9ebb-9a9e772497ff'));
          break;
        default:
          throw new Error('Unknown backend URL. Check configuration file config.json.');
      }

      // Render application
      ReactDOM.render(
        <Provider key='provider' store={store}>
          <Router history={browserHistory}>
            {routes}
          </Router>
        </Provider>,
        document.getElementById('root'));
    });
}

boot();
