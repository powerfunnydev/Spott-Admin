import { searchMedia as dataSearchMedia } from '../../../actions/media';
import { searchBroadcastChannels as dataSearchBroadcastChannels } from '../../../actions/broadcastChannel';
import { persistTvGuideEntry } from '../../../actions/tvGuide';
import { searchSeasons as dataSearchSeasons } from '../../../actions/series';
import { searchEpisodes as dataSearchEpisodes } from '../../../actions/season';
import { fetchNextEpisode as dataFetchNextEpisode } from '../../../actions/episode';
import { createSearchAction } from '../../../utils';
import { currentSeasonIdSelector, currentMediumIdSelector } from './selector';

export const BROADCAST_CHANNELS_SEARCH_START = 'TV_GUIDE_CREATE/BROADCAST_CHANNELS_SEARCH_START';
export const BROADCAST_CHANNELS_SEARCH_ERROR = 'TV_GUIDE_CREATE/BROADCAST_CHANNELS_SEARCH_ERROR';

export const EPISODES_SEARCH_START = 'TV_GUIDE_CREATE/EPISODES_SEARCH_START';
export const EPISODES_SEARCH_ERROR = 'TV_GUIDE_CREATE/EPISODES_SEARCH_ERROR';

export const MEDIA_SEARCH_START = 'TV_GUIDE_CREATE/MEDIA_SEARCH_START';
export const MEDIA_SEARCH_ERROR = 'TV_GUIDE_CREATE/MEDIA_SEARCH_ERROR';

export const SEASONS_SEARCH_START = 'TV_GUIDE_CREATE/SEASONS_SEARCH_START';
export const SEASONS_SEARCH_ERROR = 'TV_GUIDE_CREATE/SEASONS_SEARCH_ERROR';

export const NEXT_EPISODE_FETCH_ERROR = 'TV_GUIDE_CREATE/NEXT_EPISODE_FETCH_ERROR';
export const CLEAR_POP_UP_MESSAGE = 'TV_GUIDE_CREATE/CLEAR_POP_UP_MESSAGE';

export const submit = persistTvGuideEntry;

export function fetchNextEpisode (episodeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchNextEpisode({ episodeId }));
    } catch (error) {
      dispatch({ error, type: NEXT_EPISODE_FETCH_ERROR });
    }
  };
}

export function clearPopUpMessage () {
  return { type: CLEAR_POP_UP_MESSAGE };
}

export const searchBroadcastChannels = createSearchAction(dataSearchBroadcastChannels, BROADCAST_CHANNELS_SEARCH_START, BROADCAST_CHANNELS_SEARCH_ERROR, (state) => ({ seasonId: currentSeasonIdSelector(state) }));
export const searchEpisodes = createSearchAction(dataSearchEpisodes, EPISODES_SEARCH_START, EPISODES_SEARCH_ERROR, (state) => ({ seasonId: currentSeasonIdSelector(state) }));
export const searchMedia = createSearchAction(dataSearchMedia, MEDIA_SEARCH_START, MEDIA_SEARCH_ERROR);
export const searchSeasons = createSearchAction(dataSearchSeasons, SEASONS_SEARCH_START, SEASONS_SEARCH_ERROR, (state) => ({ seriesEntryId: currentMediumIdSelector(state) }));
