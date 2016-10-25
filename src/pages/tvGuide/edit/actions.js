import { searchMedia as dataSearchMedia } from '../../../actions/media';
import { searchBroadcastChannels as dataSearchBroadcastChannels } from '../../../actions/broadcastChannel';
import { persistTvGuideEntry, fetchTvGuideEntry as dataFetchTvGuideEntry } from '../../../actions/tvGuide';
import { searchSeasons as dataSearchSeasons } from '../../../actions/season';
import { searchEpisodes as dataSearchEpisodes } from '../../../actions/episode';
import { currentSeasonIdSelector, currentMediumIdSelector } from './selector';

export const BROADCAST_CHANNELS_SEARCH_START = 'TV_GUIDE_EDIT/BROADCAST_CHANNELS_SEARCH_START';
export const BROADCAST_CHANNELS_SEARCH_ERROR = 'TV_GUIDE_EDIT/BROADCAST_CHANNELS_SEARCH_ERROR';

export const TV_GUIDE_FETCH_ENTRY_ERROR = 'TV_GUIDE_EDIT/FETCH_ENTRY_ERROR';

export const EPISODES_SEARCH_START = 'TV_GUIDE_EDIT/EPISODES_SEARCH_START';
export const EPISODES_SEARCH_ERROR = 'TV_GUIDE_EDIT/EPISODES_SEARCH_ERROR';

export const MEDIA_SEARCH_START = 'TV_GUIDE_EDIT/MEDIA_SEARCH_START';
export const MEDIA_SEARCH_ERROR = 'TV_GUIDE_EDIT/MEDIA_SEARCH_ERROR';

export const SEASONS_SEARCH_START = 'TV_GUIDE_EDIT/SEASONS_SEARCH_START';
export const SEASONS_SEARCH_ERROR = 'TV_GUIDE_EDIT/SEASONS_SEARCH_ERROR';

export const submit = persistTvGuideEntry;

export function load (tvGuideEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTvGuideEntry(tvGuideEntryId));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_FETCH_ENTRY_ERROR });
    }
  };
}

function editSearchAction (dataAction, startActionType, errorActionType, selector) {
  return (searchString = '') => {
    return async (dispatch, getState) => {
      const lowerCaseSearchString = searchString.toLowerCase();
      const payload = selector ? selector(getState()) : {};
      try {
        dispatch({ searchString: lowerCaseSearchString, type: startActionType, ...payload });
        return await dispatch(dataAction({ searchString, ...payload }));
      } catch (error) {
        dispatch({ error, searchString: lowerCaseSearchString, type: errorActionType, ...payload });
      }
    };
  };
}

export const searchBroadcastChannels = editSearchAction(dataSearchBroadcastChannels, BROADCAST_CHANNELS_SEARCH_START, BROADCAST_CHANNELS_SEARCH_ERROR, (state) => ({ seasonId: currentSeasonIdSelector(state) }));
export const searchEpisodes = editSearchAction(dataSearchEpisodes, EPISODES_SEARCH_START, EPISODES_SEARCH_ERROR, (state) => ({ seasonId: currentSeasonIdSelector(state) }));
export const searchMedia = editSearchAction(dataSearchMedia, MEDIA_SEARCH_START, MEDIA_SEARCH_ERROR);
export const searchSeasons = editSearchAction(dataSearchSeasons, SEASONS_SEARCH_START, SEASONS_SEARCH_ERROR, (state) => ({ seriesId: currentMediumIdSelector(state) }));
