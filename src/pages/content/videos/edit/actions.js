import { persistVideo, fetchVideo as dataFetchVideo } from '../../../../actions/video';
import { searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';

export { openModal, closeModal } from '../../../../actions/global';

export const SERIES_ENTRIES_SEARCH_START = 'SEASON_EDIT/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'SEASON_EDIT/SERIES_ENTRIES_SEARCH_ERROR';

export const SEASON_PERSIST_ERROR = 'VIDEO_EDIT/VIDEO_PERSIST_ERROR';

export const VIDEO_FETCH_ERROR = 'VIDEO_EDIT/VIDEO_FETCH_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'SEASONS_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'SEASONS_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const submit = persistVideo;

export function loadVideo (videoId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchVideo({ videoId }));
    } catch (error) {
      dispatch({ error, type: VIDEO_FETCH_ERROR });
    }
  };
}

// export function searchSeriesEntries (searchString) {
//   return async (dispatch, getState) => {
//     try {
//       await dispatch({ type: SERIES_ENTRIES_SEARCH_START, searchString });
//       return await dispatch(dataSearchSeriesEntries({ searchString }));
//     } catch (error) {
//       dispatch({ error, type: SERIES_ENTRIES_SEARCH_ERROR });
//     }
//   };
// }
