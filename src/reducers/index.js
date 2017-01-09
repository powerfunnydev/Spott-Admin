import { combineReducers } from 'redux-immutablejs';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form/immutable';
import media from './media';
import globalReducer from './global';
import data from './data';
import _mediumTvGuide from '../pages/content/_mediumTvGuide/reducer';
import brandsEdit from '../pages/content/brands/edit/reducer';
import brandsList from '../pages/content/brands/list/reducer';
import brandsReadProducts from '../pages/content/brands/read/products/list/reducer';
import broadcastChannelsCreate from '../pages/content/broadcastChannels/create/reducer';
import broadcastChannelsList from '../pages/content/broadcastChannels/list/reducer';
import broadcastersListBroadcasters from '../pages/content/broadcasters/list/reducer';
import broadcastersReadBroadcastChannels from '../pages/content/broadcasters/read/broadcastChannels/reducer';
import broadcastersReadUsers from '../pages/content/broadcasters/read/users/list/reducer';
import charactersCreate from '../pages/content/characters/create/reducer';
import charactersEdit from '../pages/content/characters/edit/reducer';
import charactersList from '../pages/content/characters/list/reducer';
import commercialsCreate from '../pages/content/commercials/create/reducer';
import commercialsEdit from '../pages/content/commercials/edit/reducer';
import commercialsList from '../pages/content/commercials/list/reducer';
import contentProducersList from '../pages/content/contentProducers/list/reducer';
import contentProducersReadUsers from '../pages/content/contentProducers/read/users/list/reducer';
import episodesCreate from '../pages/content/episodes/create/reducer';
import episodesEdit from '../pages/content/episodes/edit/reducer';
import episodesList from '../pages/content/episodes/list/reducer';
import LinkUserModal from '../pages/_common/components/linkUserModal/reducer';
import mediaList from '../pages/content/media/list/reducer';
import moviesEdit from '../pages/content/movies/edit/reducer';
import moviesList from '../pages/content/movies/list/reducer';
import personsEdit from '../pages/content/persons/edit/reducer';
import personsList from '../pages/content/persons/list/reducer';
import productsCreate from '../pages/content/products/create/reducer';
import productsList from '../pages/content/products/list/reducer';
import productsEdit from '../pages/content/products/edit/reducer';
import relatedVideoPersist from '../pages/content/_relatedVideo/persist/reducer';
import reporting from '../pages/reporting/reducer';
import seasonsCreate from '../pages/content/seasons/create/reducer';
import seasonsEdit from '../pages/content/seasons/edit/reducer';
import seasonsList from '../pages/content/seasons/list/reducer';
import seasonsReadEpisodes from '../pages/content/seasons/read/episodes/reducer';
import seriesEdit from '../pages/content/series/edit/reducer';
import seriesList from '../pages/content/series/list/reducer';
import seriesReadEpisodes from '../pages/content/series/read/episodes/reducer';
import seriesReadSeasons from '../pages/content/series/read/seasons/reducer';
import shopsEdit from '../pages/content/shops/edit/reducer';
import shopsList from '../pages/content/shops/list/reducer';
import Toast from './toast';
import tvGuideCreate from '../pages/tvGuide/create/reducer';
import tvGuideEdit from '../pages/tvGuide/edit/reducer';
import tvGuideList from '../pages/tvGuide/list/reducer';
import usersEdit from '../pages/users/edit/reducer';
import usersList from '../pages/users/list/reducer';

import tagger from '../tagger/reducers';

/**
 * The application's main reducer
 */
export default combineReducers({
  tagger,
  _relatedVideo: relatedVideoPersist,
  common: combineReducers({
    linkUserModal: LinkUserModal
  }),
  content: combineReducers({
    // _mediumTvGuide is a component used by a medium.
    mediumTvGuide: _mediumTvGuide,
    broadcastChannels: combineReducers({
      create: broadcastChannelsCreate,
      list: broadcastChannelsList
    }),
    brands: combineReducers({
      edit: brandsEdit,
      list: brandsList,
      read: combineReducers({
        products: brandsReadProducts
      })
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
    characters: combineReducers({
      create: charactersCreate,
      edit: charactersEdit,
      list: charactersList
    }),
    commercials: combineReducers({
      create: commercialsCreate,
      edit: commercialsEdit,
      list: commercialsList
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
      list: episodesList
    }),
    media: combineReducers({
      list: mediaList
    }),
    movies: combineReducers({
      edit: moviesEdit,
      list: moviesList
    }),
    persons: combineReducers({
      edit: personsEdit,
      list: personsList
    }),
    shops: combineReducers({
      edit: shopsEdit,
      list: shopsList
    }),
    products: combineReducers({
      create: productsCreate,
      edit: productsEdit,
      list: productsList
    }),
    seasons: combineReducers({
      create: seasonsCreate,
      edit: seasonsEdit,
      list: seasonsList,
      read: combineReducers({
        episodes: seasonsReadEpisodes
      })
    }),
    series: combineReducers({
      edit: seriesEdit,
      list: seriesList,
      read: combineReducers({
        seasons: seriesReadSeasons,
        episodes: seriesReadEpisodes
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
