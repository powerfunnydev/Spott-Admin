import { combineReducers } from 'redux-immutablejs';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form/immutable';
import media from './media';
import globalReducer from './global';
import data from './data';
import broadcastChannelsCreate from '../pages/content/broadcastChannels/create/reducer';
import broadcastChannelsList from '../pages/content/broadcastChannels/list/reducer';
import broadcastersListBroadcasters from '../pages/content/broadcasters/list/reducer';
import broadcastersReadBroadcastChannels from '../pages/content/broadcasters/read/broadcastChannels/reducer';
import broadcastersReadUsers from '../pages/content/broadcasters/read/users/list/reducer';
import contentProducersList from '../pages/content/contentProducers/list/reducer';
import contentProducersReadUsers from '../pages/content/contentProducers/read/users/list/reducer';
import episodesCreate from '../pages/content/episodes/create/reducer';
import episodesList from '../pages/content/episodes/list/reducer';
import episodesEdit from '../pages/content/episodes/edit/reducer';
import episodesReadTvGuide from '../pages/content/episodes/read/tvGuide/reducer';
import LinkUserModal from '../pages/_common/components/linkUserModal/reducer';
import reporting from '../pages/reporting/reducer';
import relatedVideoPersist from '../pages/content/_relatedVideo/persist/reducer';
import seasonsCreate from '../pages/content/seasons/create/reducer';
import seasonsEdit from '../pages/content/seasons/edit/reducer';
import seasonsList from '../pages/content/seasons/list/reducer';
import seasonsReadEpisodes from '../pages/content/seasons/read/episodes/reducer';
import seasonsReadTvGuide from '../pages/content/seasons/read/tvGuide/reducer';
import seriesList from '../pages/content/series/list/reducer';
import seriesReadSeasons from '../pages/content/series/read/seasons/reducer';
import seriesReadTvGuide from '../pages/content/series/read/tvGuide/reducer';
import tvGuideCreate from '../pages/tvGuide/create/reducer';
import tvGuideEdit from '../pages/tvGuide/edit/reducer';
import tvGuideList from '../pages/tvGuide/list/reducer';
import usersEdit from '../pages/users/edit/reducer';
import usersList from '../pages/users/list/reducer';
import Toast from './toast';

/**
 * The application's main reducer
 */
export default combineReducers({
  _relatedVideo: relatedVideoPersist,
  common: combineReducers({
    linkUserModal: LinkUserModal
  }),
  content: combineReducers({
    broadcastChannels: combineReducers({
      create: broadcastChannelsCreate,
      list: broadcastChannelsList
    }),
    broadcasters: combineReducers({
      list: combineReducers({
        broadcasters: broadcastersListBroadcasters
      }),
      read: combineReducers({
        broadcastChannels: broadcastersReadBroadcastChannels,
        users: broadcastersReadUsers
      })
    }),
    contentProducers: combineReducers({
      list: contentProducersList,
      read: combineReducers({
        users: contentProducersReadUsers
      })
    }),
    episodes: combineReducers({
      create: episodesCreate,
      edit: episodesEdit,
      list: episodesList,
      read: combineReducers({
        tvGuide: episodesReadTvGuide
      })
    }),
    seasons: combineReducers({
      create: seasonsCreate,
      edit: seasonsEdit,
      list: seasonsList,
      read: combineReducers({
        episodes: seasonsReadEpisodes,
        tvGuide: seasonsReadTvGuide
      })
    }),
    series: combineReducers({
      list: seriesList,
      read: combineReducers({
        seasons: seriesReadSeasons,
        tvGuide: seriesReadTvGuide
      })
    })
  }),
  users: combineReducers({
    edit: usersEdit,
    list: usersList
  }),
  data,
  form,
  global: globalReducer,
  media,
  reporting,
  router,
  tvGuide: combineReducers({
    create: tvGuideCreate,
    edit: tvGuideEdit,
    list: tvGuideList
  }),
  toast: Toast
});
