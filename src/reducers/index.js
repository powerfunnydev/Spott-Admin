import { combineReducers } from 'redux-immutablejs';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form/immutable';
import media from './media';
import globalReducer from './global';
import data from './data';
import reporting from '../pages/reporting/reducer';
import broadcastChannelsCreate from '../pages/content/broadcastChannels/create/reducer';
import broadcastChannelsList from '../pages/content/broadcastChannels/list/reducer';
import broadcastersListBroadcasters from '../pages/content/broadcasters/list/broadcasters/reducer';
import broadcastersReadBroadcastChannels from '../pages/content/broadcasters/read/broadcastChannels/reducer';
import broadcastersReadUsers from '../pages/content/broadcasters/read/users/list/reducer';
import contentProducersList from '../pages/content/contentProducers/list/reducer';
import contentProducersReadUsers from '../pages/content/contentProducers/read/users/list/reducer';
import tvGuideCreate from '../pages/tvGuide/create/reducer';
import tvGuideEdit from '../pages/tvGuide/edit/reducer';
import tvGuideList from '../pages/tvGuide/list/reducer';
import usersEdit from '../pages/users/edit/reducer';
import usersList from '../pages/users/list/reducer';
import LinkUserModal from '../pages/_common/linkUserModal/reducer';

/**
 * The application's main reducer
 */
export default combineReducers({
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
  })
});
