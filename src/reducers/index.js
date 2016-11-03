import { combineReducers } from 'redux-immutablejs';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form/immutable';
import media from './media';
import globalReducer from './global';
import data from './data';
import reporting from '../pages/reporting/reducer';
import contentProducersList from '../pages/content/contentProducers/list/reducer';
import broadcastersList from '../pages/content/broadcasters/list/reducer';
import broadcastersRead from '../pages/content/broadcasters/read/reducer';
import broadcastChannelsCreate from '../pages/content/broadcastChannels/create/reducer';
import broadcastChannelsList from '../pages/content/broadcastChannels/list/reducer';
import tvGuideCreate from '../pages/tvGuide/create/reducer';
import tvGuideEdit from '../pages/tvGuide/edit/reducer';
import tvGuideList from '../pages/tvGuide/list/reducer';

/**
 * The application's main reducer
 */
export default combineReducers({
  content: combineReducers({
    broadcastChannels: combineReducers({
      create: broadcastChannelsCreate,
      list: broadcastChannelsList
    }),
    broadcasters: combineReducers({
      list: broadcastersList,
      read: broadcastersRead
    }),
    contentProducers: combineReducers({
      list: contentProducersList
    })
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
