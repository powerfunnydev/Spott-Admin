import * as api from '../api/tag';
import { makeApiActionCreator } from './utils';

export const TAG_SEARCH_START = 'TAG/TAG_SEARCH_START';
export const TAG_SEARCH_SUCCESS = 'TAG/TAG_SEARCH_SUCCESS';
export const TAG_SEARCH_ERROR = 'TAG/TAG_SEARCH_ERROR';

export const TAGS_FETCH_START = 'TAG/TAGS_FETCH_START';
export const TAGS_FETCH_SUCCESS = 'TAG/TAGS_FETCH_SUCCESS';
export const TAGS_FETCH_ERROR = 'TAG/TAGS_FETCH_ERROR';

export const TAG_FETCH_START = 'TAG/TAG_FETCH_START';
export const TAG_FETCH_SUCCESS = 'TAG/TAG_FETCH_SUCCESS';
export const TAG_FETCH_ERROR = 'TAG/TAG_FETCH_ERROR';

export const TAG_DELETE_START = 'TAG/TAG_DELETE_START';
export const TAG_DELETE_SUCCESS = 'TAG/TAG_DELETE_SUCCESS';
export const TAG_DELETE_ERROR = 'TAG/TAG_DELETE_ERROR';

export const TAGS_DELETE_START = 'TAG/TAGS_DELETE_START';
export const TAGS_DELETE_SUCCESS = 'TAG/TAGS_DELETE_SUCCESS';
export const TAGS_DELETE_ERROR = 'TAG/TAGS_DELETE_ERROR';

export const TAG_PERSIST_START = 'TAG/TAG_PERSIST_START';
export const TAG_PERSIST_SUCCESS = 'TAG/TAG_PERSIST_SUCCESS';
export const TAG_PERSIST_ERROR = 'TAG/TAG_PERSIST_ERROR';

export const deleteTags = makeApiActionCreator(api.deleteTags, TAGS_DELETE_START, TAGS_DELETE_SUCCESS, TAGS_DELETE_ERROR);
export const deleteTag = makeApiActionCreator(api.deleteTag, TAG_DELETE_START, TAG_DELETE_SUCCESS, TAG_DELETE_ERROR);
export const fetchTags = makeApiActionCreator(api.fetchTags, TAGS_FETCH_START, TAGS_FETCH_SUCCESS, TAGS_FETCH_ERROR);
export const fetchTag = makeApiActionCreator(api.fetchTag, TAG_FETCH_START, TAG_FETCH_SUCCESS, TAG_FETCH_ERROR);
export const persistTag = makeApiActionCreator(api.persistTag, TAG_PERSIST_START, TAG_PERSIST_SUCCESS, TAG_PERSIST_ERROR);
export const searchTags = makeApiActionCreator(api.searchTags, TAG_SEARCH_START, TAG_SEARCH_SUCCESS, TAG_SEARCH_ERROR);
