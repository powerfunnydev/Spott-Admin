import * as api from '../api/broadcaster';
import { makeApiActionCreator } from './utils';

export const BROADCASTER_UPLOAD_IMAGE_START = 'BROADCASTER/BROADCASTER_UPLOAD_IMAGE_START';
export const BROADCASTER_UPLOAD_IMAGE_SUCCESS = 'BROADCASTER/BROADCASTER_UPLOAD_IMAGE_SUCCESS';
export const BROADCASTER_UPLOAD_IMAGE_ERROR = 'BROADCASTER/BROADCASTER_UPLOAD_IMAGE_ERROR';

export const BROADCASTER_USERS_FETCH_START = 'BROADCASTER/BROADCASTER_USERS_FETCH_START';
export const BROADCASTER_USERS_FETCH_SUCCESS = 'BROADCASTER/BROADCASTER_USERS_FETCH_SUCCESS';
export const BROADCASTER_USERS_FETCH_ERROR = 'BROADCASTER/BROADCASTER_USERS_FETCH_ERROR';

export const BROADCASTERS_FETCH_START = 'BROADCASTER/BROADCASTERS_FETCH_START';
export const BROADCASTERS_FETCH_SUCCESS = 'BROADCASTER/BROADCASTERS_FETCH_SUCCESS';
export const BROADCASTERS_FETCH_ERROR = 'BROADCASTER/BROADCASTERS_FETCH_ERROR';

export const BROADCASTER_FETCH_START = 'BROADCASTER/BROADCASTER_FETCH_START';
export const BROADCASTER_FETCH_SUCCESS = 'BROADCASTER/BROADCASTER_FETCH_SUCCESS';
export const BROADCASTER_FETCH_ERROR = 'BROADCASTER/BROADCASTER_FETCH_ERROR';

export const BROADCASTER_CHANNELS_FETCH_START = 'BROADCASTER/BROADCASTER_CHANNELS_FETCH_START';
export const BROADCASTER_CHANNELS_FETCH_SUCCESS = 'BROADCASTER/BROADCASTER_CHANNELS_FETCH_SUCCESS';
export const BROADCASTER_CHANNELS_FETCH_ERROR = 'BROADCASTER/BROADCASTER_CHANNELS_FETCH_ERROR';

export const BROADCASTER_PERSIST_START = 'BROADCASTER/BROADCASTER_PERSIST_START';
export const BROADCASTER_PERSIST_SUCCESS = 'BROADCASTER/BROADCASTER_PERSIST_SUCCESS';
export const BROADCASTER_PERSIST_ERROR = 'BROADCASTER/BROADCASTER_PERSIST_ERROR';

export const BROADCASTER_DELETE_START = 'BROADCASTER/BROADCASTER_DELETE_START';
export const BROADCASTER_DELETE_SUCCESS = 'BROADCASTER/BROADCASTER_DELETE_SUCCESS';
export const BROADCASTER_DELETE_ERROR = 'BROADCASTER/BROADCASTER_DELETE_ERROR';

export const BROADCASTERS_DELETE_START = 'BROADCASTER/BROADCASTERS_DELETE_START';
export const BROADCASTERS_DELETE_SUCCESS = 'BROADCASTER/BROADCASTERS_DELETE_SUCCESS';
export const BROADCASTERS_DELETE_ERROR = 'BROADCASTER/BROADCASTERS_DELETE_ERROR';

export const BROADCASTER_SEARCH_START = 'BROADCASTER/BROADCASTER_SEARCH_START';
export const BROADCASTER_SEARCH_SUCCESS = 'BROADCASTER/BROADCASTER_SEARCH_SUCCESS';
export const BROADCASTER_SEARCH_ERROR = 'BROADCASTER/BROADCASTER_SEARCH_ERROR';

export const BROADCASTER_CHANNELS_SEARCH_START = 'BROADCASTER/BROADCASTER_CHANNELS_SEARCH_START';
export const BROADCASTER_CHANNELS_SEARCH_SUCCESS = 'BROADCASTER/BROADCASTER_CHANNELS_SEARCH_SUCCESS';
export const BROADCASTER_CHANNELS_SEARCH_ERROR = 'BROADCASTER/BROADCASTER_CHANNELS_SEARCH_ERROR';

export const BROADCASTER_MEDIA_SEARCH_START = 'BROADCASTER/BROADCASTER_MEDIA_SEARCH_START';
export const BROADCASTER_MEDIA_SEARCH_SUCCESS = 'BROADCASTER/BROADCASTER_MEDIA_SEARCH_SUCCESS';
export const BROADCASTER_MEDIA_SEARCH_ERROR = 'BROADCASTER/BROADCASTER_MEDIA_SEARCH_ERROR';

export const BROADCASTER_LINK_USER_PERSIST_START = 'BROADCASTER/LINK_USER_PERSIST_START';
export const BROADCASTER_LINK_USER_PERSIST_SUCCESS = 'BROADCASTER/LINK_USER_PERSIST_SUCCESS';
export const BROADCASTER_LINK_USER_PERSIST_ERROR = 'BROADCASTER/LINK_USER_PERSIST_ERROR';

export const BROADCASTER_LINK_USER_DELETE_START = 'BROADCASTER/LINK_USER_DELETE_START';
export const BROADCASTER_LINK_USER_DELETE_SUCCESS = 'BROADCASTER/LINK_USER_DELETE_SUCCESS';
export const BROADCASTER_LINK_USER_DELETE_ERROR = 'BROADCASTER/LINK_USER_DELETE_ERROR';

export const BROADCASTER_LINK_USERS_DELETE_START = 'BROADCASTER/LINK_USERS_DELETE_START';
export const BROADCASTER_LINK_USERS_DELETE_SUCCESS = 'BROADCASTER/LINK_USERS_DELETE_SUCCESS';
export const BROADCASTER_LINK_USERS_DELETE_ERROR = 'BROADCASTER/LINK_USERS_DELETE_ERROR';

export const LOGO_DELETE_START = 'BROADCASTER/LOGO_DELETE_START';
export const LOGO_DELETE_SUCCESS = 'BROADCASTER/LOGO_DELETE_SUCCESS';
export const LOGO_DELETE_ERROR = 'BROADCASTER/LOGO_DELETE_ERROR';

export const fetchBroadcasterUsers = makeApiActionCreator(api.fetchBroadcasterUsers, BROADCASTER_USERS_FETCH_START, BROADCASTER_USERS_FETCH_SUCCESS, BROADCASTER_UPLOAD_IMAGE_ERROR);
export const fetchBroadcasters = makeApiActionCreator(api.fetchBroadcasters, BROADCASTERS_FETCH_START, BROADCASTERS_FETCH_SUCCESS, BROADCASTERS_FETCH_ERROR);
export const fetchBroadcaster = makeApiActionCreator(api.fetchBroadcaster, BROADCASTER_FETCH_START, BROADCASTER_FETCH_SUCCESS, BROADCASTER_FETCH_ERROR);
export const fetchBroadcasterChannels = makeApiActionCreator(api.fetchBroadcasterChannels, BROADCASTER_CHANNELS_FETCH_START, BROADCASTER_CHANNELS_FETCH_SUCCESS, BROADCASTER_CHANNELS_FETCH_ERROR);
export const persistLinkUser = makeApiActionCreator(api.persistLinkUser, BROADCASTER_LINK_USER_PERSIST_START, BROADCASTER_LINK_USER_PERSIST_SUCCESS, BROADCASTER_LINK_USER_PERSIST_ERROR);
export const persistBroadcaster = makeApiActionCreator(api.persistBroadcaster, BROADCASTER_PERSIST_START, BROADCASTER_PERSIST_SUCCESS, BROADCASTER_PERSIST_ERROR);
export const deleteLinkUser = makeApiActionCreator(api.deleteLinkUser, BROADCASTER_LINK_USER_DELETE_START, BROADCASTER_LINK_USER_DELETE_SUCCESS, BROADCASTER_LINK_USER_DELETE_ERROR);
export const deleteLinkUsers = makeApiActionCreator(api.deleteLinkUsers, BROADCASTER_LINK_USERS_DELETE_START, BROADCASTER_LINK_USERS_DELETE_SUCCESS, BROADCASTER_LINK_USERS_DELETE_ERROR);
export const deleteBroadcasters = makeApiActionCreator(api.deleteBroadcasters, BROADCASTERS_DELETE_START, BROADCASTERS_DELETE_SUCCESS, BROADCASTERS_DELETE_ERROR);
export const deleteBroadcaster = makeApiActionCreator(api.deleteBroadcaster, BROADCASTER_DELETE_START, BROADCASTER_DELETE_SUCCESS, BROADCASTER_DELETE_ERROR);
export const deleteLogo = makeApiActionCreator(api.deleteLogo, LOGO_DELETE_START, LOGO_DELETE_SUCCESS, LOGO_DELETE_ERROR);
export const searchBroadcasters = makeApiActionCreator(api.searchBroadcasters, BROADCASTER_SEARCH_START, BROADCASTER_SEARCH_SUCCESS, BROADCASTER_SEARCH_ERROR);
export const uploadBroadcasterImage = makeApiActionCreator(api.uploadBroadcasterImage, BROADCASTER_UPLOAD_IMAGE_START, BROADCASTER_UPLOAD_IMAGE_SUCCESS, BROADCASTER_UPLOAD_IMAGE_ERROR);
export const searchBroadcasterChannels = makeApiActionCreator(api.searchBroadcasterChannels, BROADCASTER_CHANNELS_SEARCH_START, BROADCASTER_CHANNELS_SEARCH_SUCCESS, BROADCASTER_CHANNELS_SEARCH_ERROR);
export const searchBroadcasterMedia = makeApiActionCreator(api.searchBroadcasterMedia, BROADCASTER_MEDIA_SEARCH_START, BROADCASTER_MEDIA_SEARCH_SUCCESS, BROADCASTER_MEDIA_SEARCH_ERROR);
