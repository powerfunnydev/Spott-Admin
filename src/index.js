import React from 'react';
import { IndexRedirect, IndexRoute, Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import createStore from './createStore';
import { getAuthorizedConfig, init } from './actions/global';
import { LOGIN_SUCCESS } from './actions/user';
import { ADMIN, BROADCASTER, CONTENT_MANAGER } from './constants/userRoles';

import App from './pages/app';
import BroadcastersList from './pages/content/broadcasters/list';
import BroadcastersCreate from './pages/content/broadcasters/create';
import BroadcastersEdit from './pages/content/broadcasters/edit';
import BroadcastersRead from './pages/content/broadcasters/read';
import LinkUserToBroadcaster from './pages/content/broadcasters/read/users/linkUser';
import BroadcastChannelCreate from './pages/content/broadcastChannels/create';
import BroadcastChannelEdit from './pages/content/broadcastChannels/edit';
import BroadcastChannelList from './pages/content/broadcastChannels/list';
import ContentProducersList from './pages/content/contentProducers/list';
import ContentProducersCreate from './pages/content/contentProducers/create';
import ContentProducersEdit from './pages/content/contentProducers/edit';
import ContentProducersRead from './pages/content/contentProducers/read';
import EpisodeList from './pages/content/episodes/list';
import EpisodeRead from './pages/content/episodes/read';
import EpisodeEdit from './pages/content/episodes/edit';
import EpisodeCreate from './pages/content/episodes/create';
import LinkUserToContentProducer from './pages/content/contentProducers/read/users/linkUser';
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
import SeasonList from './pages/content/seasons/list';
import SeasonRead from './pages/content/seasons/read';
import SeasonCreate from './pages/content/seasons/create';
import SeriesList from './pages/content/series/list';
import SeriesRead from './pages/content/series/read';
import SeriesCreate from './pages/content/series/create';
import SeriesEdit from './pages/content/series/edit';
import TvGuideCreateEntry from './pages/tvGuide/create';
import TvGuideEditEntry from './pages/tvGuide/edit';
import TvGuideList from './pages/tvGuide/list';
import UsersCreate from './pages/users/create';
import UsersEdit from './pages/users/edit';
import UsersList from './pages/users/list';
import UsersRead from './pages/users/read';
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
          <Route component={ContentProducersCreate} path='create'/>
        </Route>
        <Route path='content-producers'>
          <Route component={ContentProducersEdit} path='edit/:id'/>
          <Route component={ContentProducersRead} path='read/:id'>
            <Route component={LinkUserToContentProducer} path='link/user'/>
            <Route component={UsersCreate} path='create/user'/>
          </Route>
        </Route>
        <Route component={BroadcastersList} path='broadcasters'>
          <Route component={BroadcastersCreate} path='create'/>
        </Route>
        <Route path='broadcasters'>
          <Route component={BroadcastersEdit} path='edit/:id'/>
          <Route component={BroadcastersRead} path='read/:id'>
            <Route component={BroadcastChannelCreate} path='create/broadcast-channel'/>
            <Route component={LinkUserToBroadcaster} path='link/user'/>
            <Route component={UsersCreate} path='create/user'/>
          </Route>
        </Route>
        <Route component={BroadcastChannelList} path='broadcast-channels'>
          <Route component={BroadcastChannelCreate} path='create'/>
        </Route>
        <Route path='broadcast-channels'>
          <Route component={BroadcastChannelEdit} path='edit/:id' />
        </Route>
        <Route component={SeriesList} path='series'>
          <Route component={SeriesCreate} path='create'/>
        </Route>
        <Route path='series'>
          <Route component={SeriesRead} path='read/:seriesEntryId'>
            <Route component={SeasonCreate} path='create/season'/>
          </Route>
          <Route component={SeriesEdit} path='edit/:seriesEntryId' />
          <Route path='read/:seriesEntryId'>
            <Route path='seasons'>
              <Route component={SeasonRead} path='read/:seasonId'>
                <Route component={EpisodeCreate} path='create/episode'/>
              </Route>
              <Route path='read/:seasonId'>
                <Route path='episodes'>
                  <Route component={EpisodeRead} path='read/:episodeId'/>
                  <Route component={EpisodeEdit} path='edit/:episodeId'>
                    {/* <Route component={AddLanguageModal} path='add-language'/>*/}
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route component={SeasonList} path='seasons'>
          <Route component={SeasonCreate} path='create'/>
        </Route>
        <Route component={EpisodeList} path='episodes'>
          <Route component={EpisodeCreate} path='create'/>
        </Route>
      </Route>

      <Route component={UsersList} path='users' onEnter={requireOneRole([ ADMIN ])}>
        <Route component={UsersCreate} path='create'/>
      </Route>
      <Route path='users'>
        <Route component={UsersEdit} path='edit/:id'/>
        <Route component={UsersRead} path='read/:id'/>
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
  // if user is logged in, retrieve authorized config files (languages,...)
  await store.dispatch(getAuthorizedConfig());

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
