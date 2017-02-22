import { makeApiActionCreator } from './utils';
import * as countryApi from '../api/country';

export const COUNTRIES_FETCH_START = 'COUNTRY/COUNTRIES_FETCH_START';
export const COUNTRIES_FETCH_SUCCESS = 'COUNTRY/COUNTRIES_FETCH_SUCCESS';
export const COUNTRIES_FETCH_ERROR = 'COUNTRY/COUNTRIES_FETCH_ERROR';

export const fetchCountries = makeApiActionCreator(countryApi.fetchCountries, COUNTRIES_FETCH_START, COUNTRIES_FETCH_SUCCESS, COUNTRIES_FETCH_ERROR);
