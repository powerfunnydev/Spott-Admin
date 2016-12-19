import { MEDIUM_FETCH_ERROR, MEDIUM_FETCH_START, MEDIUM_FETCH_SUCCESS } from '../constants/actionTypes';
import { getMedium } from '../api/medium';
import { makeFetchRecordActionCreator } from '../actions/_utils';

/**
 * Action creator for fetching media (commercials, movies, series episodes,...).
 * @param {Object} params
 * @param (string) params.mediumId The unique identifier of the medium to fetch. Must be of the passed mediumType.
 * @param (string) params.mediumType See "/constants/mediumTypes".
 * @return {function(id: string): Promise<Object, Error>} A function triggering an action with type
 * 'getMedium, MEDIUM_FETCH_START', then performing the API call for medium retrieval.
 * Upon finishing the request, an action with either type 'MEDIUM_FETCH_SUCCESS' or 'MEDIUM_FETCH_ERROR' is triggered.
 */
export const fetch = makeFetchRecordActionCreator(getMedium, null, MEDIUM_FETCH_START, MEDIUM_FETCH_SUCCESS, MEDIUM_FETCH_ERROR);
