import { deleteTvGuideEntry as dataDeleteTvGuideEntry,
  deleteTvGuideEntries as dataDeleteTvGuideEntries } from '../../../../../actions/tvGuide';
import { fetchTvGuideEntries as dataFetchTvGuideEntries } from '../../../../../actions/episode';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const TV_GUIDE_ENTRIES_FETCH_ERROR = 'EPISODE_READ_TV_GUIDE/TV_GUIDE_FETCH_ERROR';
export const TV_GUIDE_ENTRIES_FETCH_SUCCESS = 'EPISODE_READ_TV_GUIDE/TV_GUIDE_FETCH_SUCCESS';

export const TV_GUIDE_ENTRIES_DELETE_ERROR = 'EPISODE_READ_TV_GUIDE/TV_GUIDE_ENTRIES_REMOVE_ERROR';
export const TV_GUIDE_ENTRY_DELETE_ERROR = 'EPISODE_READ_TV_GUIDE/TV_GUIDE_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'EPISODE_READ_TV_GUIDE/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'EPISODE_READ_TV_GUIDE/SELECT_CHECKBOX';
export const SELECT_ENTITY = 'EPISODE_READ_TV_GUIDE/SELECT_ENTITY';

export const SORT_COLUMN = 'EPISODE_READ_TV_GUIDE/SORT_COLUMN';

export function load (query, episodeId) {
  console.log('episodeId', episodeId);
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTvGuideEntries({ ...getInformationFromQuery(query, prefix), episodeId }));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_ENTRIES_FETCH_ERROR });
    }
  };
}

export function deleteTvGuideEntries (tvGuideEntryIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteTvGuideEntries({ tvGuideEntryIds }));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_ENTRIES_DELETE_ERROR });
    }
  };
}

export function deleteTvGuideEntry (tvGuideEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteTvGuideEntry({ tvGuideEntryId }));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_ENTRY_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}

export function selectEntity (id) {
  return { type: SELECT_ENTITY, id };
}
