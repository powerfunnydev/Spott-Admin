import { deleteTvGuideEntry as dataDeleteTvGuideEntry,
  deleteTvGuideEntries as dataDeleteTvGuideEntries } from '../../../actions/tvGuide';
import { fetchTvGuideEntries as dataFetchTvGuideEntries } from '../../../actions/media';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const TV_GUIDE_ENTRIES_FETCH_ERROR = 'MEDIUM_TV_GUIDE/TV_GUIDE_FETCH_ERROR';

export const TV_GUIDE_ENTRIES_DELETE_ERROR = 'MEDIUM_TV_GUIDE/TV_GUIDE_ENTRIES_REMOVE_ERROR';
export const TV_GUIDE_ENTRY_DELETE_ERROR = 'MEDIUM_TV_GUIDE/TV_GUIDE_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'MEDIUM_TV_GUIDE/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'MEDIUM_TV_GUIDE/SELECT_CHECKBOX';
export const SELECT_ENTITY = 'MEDIUM_TV_GUIDE/SELECT_ENTITY';

export const SORT_COLUMN = 'MEDIUM_TV_GUIDE/SORT_COLUMN';

export function load (query, mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTvGuideEntries({ ...getInformationFromQuery(query, prefix), mediumId }));
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

export function selectAllCheckboxes (mediumId) {
  return { type: SELECT_ALL_CHECKBOXES, mediumId };
}

export function selectCheckbox (id, mediumId) {
  return { type: SELECT_CHECKBOX, id, mediumId };
}

export function selectEntity (id, mediumId) {
  return { type: SELECT_ENTITY, id, mediumId };
}
