import {
  searchBroadcasters as dataSearchBroadcasters,
  searchBroadcasterChannels as dataSearchBroadcasterChannels,
  searchBroadcasterMedia as dataSearchBroadcasterMedia } from '../../../../../../actions/broadcaster';
import { createSearchAction } from '../../../../../../utils';
import { broadcasterIdSelector } from './selector';

export {
  deleteScheduleEntry,
  persistScheduleEntry
} from '../../../../../../actions/scheduleEntry';
export {
  fetchScheduleEntries as loadScheduleEntries
} from '../../../../../../actions/commercial';

export const BROADCASTERS_SEARCH_START = 'COMMERCIAL_SCHEDULE_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'COMMERCIAL_SCHEDULE_EDIT/BROADCASTERS_SEARCH_ERROR';

export const BROADCASTER_CHANNELS_SEARCH_START = 'COMMERCIAL_SCHEDULE_EDIT/BROADCASTER_CHANNELS_SEARCH_START';
export const BROADCASTER_CHANNELS_SEARCH_ERROR = 'COMMERCIAL_SCHEDULE_EDIT/BROADCASTER_CHANNELS_SEARCH_ERROR';

export const BROADCASTER_MEDIA_SEARCH_START = 'COMMERCIAL_SCHEDULE_EDIT/BROADCASTER_MEDIA_SEARCH_START';
export const BROADCASTER_MEDIA_SEARCH_ERROR = 'COMMERCIAL_SCHEDULE_EDIT/BROADCASTER_MEDIA_SEARCH_ERROR';

export const searchBroadcasters = createSearchAction(dataSearchBroadcasters, BROADCASTERS_SEARCH_START, BROADCASTERS_SEARCH_ERROR);
export const searchBroadcasterChannels = createSearchAction(dataSearchBroadcasterChannels, BROADCASTER_CHANNELS_SEARCH_START, BROADCASTER_CHANNELS_SEARCH_ERROR, (state) => ({ broadcasterId: broadcasterIdSelector(state) }));
export const searchBroadcasterMedia = createSearchAction(dataSearchBroadcasterMedia, BROADCASTER_MEDIA_SEARCH_START, BROADCASTER_MEDIA_SEARCH_ERROR, (state) => ({ broadcasterId: broadcasterIdSelector(state) }));
