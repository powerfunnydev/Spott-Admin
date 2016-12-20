import {
  persistCommercial, fetchCommercial as dataFetchCommercial,
  uploadProfileImage as dataUploadProfileImage
} from '../../../../actions/commercial';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { searchCharacters as dataSearchCharacters } from '../../../../actions/character';
export { deleteProfileImage, deletePosterImage } from '../../../../actions/media';

export { openModal, closeModal } from '../../../../actions/global';

export const BRANDS_SEARCH_START = 'COMMERCIAL_EDIT/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BRANDS_SEARCH_ERROR';

export const CONTENT_PRODUCERS_SEARCH_START = 'COMMERCIAL_EDIT/CONTENT_PRODUCERS_SEARCH_START';
export const CONTENT_PRODUCERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/CONTENT_PRODUCERS_SEARCH_ERROR';

export const BROADCASTERS_SEARCH_START = 'COMMERCIAL_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BROADCASTERS_SEARCH_ERROR';

export const COMMERCIAL_PERSIST_ERROR = 'COMMERCIAL_EDIT/COMMERCIAL_PERSIST_ERROR';
export const COMMERCIAL_FETCH_ERROR = 'COMMERCIAL_EDIT/COMMERCIAL_FETCH_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'COMMERCIAL_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'COMMERCIAL_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CHARACTERS_SEARCH_START = 'EPISODE_EDIT/CHARACTERS_SEARCH_START';
export const CHARACTERS_SEARCH_ERROR = 'EPISODE_EDIT/CHARACTERS_SEARCH_ERROR';

export const submit = persistCommercial;
export const uploadProfileImage = dataUploadProfileImage;

export function loadCommercial (commercialId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCommercial({ commercialId }));
    } catch (error) {
      dispatch({ error, type: COMMERCIAL_FETCH_ERROR });
    }
  };
}

export function searchBrands (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: BRANDS_SEARCH_ERROR });
    }
  };
}

export function searchContentProducers (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: CONTENT_PRODUCERS_SEARCH_START, searchString });
      return await dispatch(dataSearchContentProducers({ searchString }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCERS_SEARCH_ERROR });
    }
  };
}
export function searchBroadcasters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BROADCASTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchBroadcasters({ searchString }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_SEARCH_ERROR });
    }
  };
}

/* Search on all characters. */
export function searchCharacters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchCharacters({ searchString }));
    } catch (error) {
      dispatch({ error, type: CHARACTERS_SEARCH_ERROR });
    }
  };
}
