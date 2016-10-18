import { searchMedia as dataSearchMedia } from '../../../actions/media';
import { currentMediumIdSelector } from './selector';

export const MEDIA_SEARCH_START = 'TV_GUIDE_CREATE/MEDIA_SEARCH_START';
export const MEDIA_SEARCH_ERROR = 'TV_GUIDE_CREATE/MEDIA_SEARCH_ERROR';

export const SEASONS_SEARCH_START = 'TV_GUIDE_CREATE/SEASONS_SEARCH_START';
export const SEASONS_SEARCH_ERROR = 'TV_GUIDE_CREATE/SEASONS_SEARCH_ERROR';

// export function submit (tvGuideEntry) {
//   return async (dispatch) => {
//     try {
//       return await dispatch(persistTvGuideEntry(tvGuideEntry));
//     } catch (error) {
//       throw { _error: error.name }; // Catched by redux form.
//     }
//   };
// }

export function searchMedia (searchString = '') {
  return async (dispatch, getState) => {
    try {
      dispatch({ searchString, type: MEDIA_SEARCH_START });
      return await dispatch(dataSearchMedia({ searchString }));
    } catch (error) {
      dispatch({ error, searchString, type: MEDIA_SEARCH_ERROR });
    }
  };
}

// export function searchSeasons (searchString = '') {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const seriesId = currentMediumIdSelector(state) || '';
//     const lowerCaseSearchString = searchString.toLowerCase();
//
//     try {
//       dispatch({ searchString: lowerCaseSearchString, seriesId, type: SEASONS_SEARCH_START });
//       return await dispatch(dataSearchSeasons({ searchString, seriesId }));
//     } catch (error) {
//       dispatch({ error, searchString: lowerCaseSearchString, seriesId, type: SEASONS_SEARCH_ERROR });
//     }
//   };
// }
