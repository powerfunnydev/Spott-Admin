import { makeApiActionCreator } from './utils';
import * as languageApi from '../api/language';

export const LANGUAGES_FETCH_START = 'COUNTRY/LANGUAGES_FETCH_START';
export const LANGUAGES_FETCH_SUCCESS = 'COUNTRY/LANGUAGES_FETCH_SUCCESS';
export const LANGUAGES_FETCH_ERROR = 'COUNTRY/LANGUAGES_FETCH_ERROR';

export const fetchLanguages = makeApiActionCreator(languageApi.fetchLanguages, LANGUAGES_FETCH_START, LANGUAGES_FETCH_SUCCESS, LANGUAGES_FETCH_ERROR);
