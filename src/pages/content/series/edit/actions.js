import { persistSeriesEntry, fetchSeriesEntry as dataFetchSeriesEntry } from '../../../../actions/series';
export { deleteProfileImage, deletePosterImage, deleteRoundLogo } from '../../../../actions/media';

export const SERIES_ENTRY_FETCH_ENTRY_ERROR = 'SERIES_ENTRY_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'SERIES_ENTRY_EDIT/CLOSE_POP_UP_MESSAGE';

export { uploadProfileImage, uploadPosterImage, uploadRoundLogo } from '../../../../actions/series';
export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistSeriesEntry;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadSeriesEntry (seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeriesEntry({ seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_FETCH_ENTRY_ERROR });
    }
  };
}
