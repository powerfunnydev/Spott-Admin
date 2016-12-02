import * as api from '../api/character';
import { makeApiActionCreator } from './utils';

export const CHARACTER_SEARCH_START = 'CHARACTER/CHARACTER_SEARCH_START';
export const CHARACTER_SEARCH_SUCCESS = 'CHARACTER/CHARACTER_SEARCH_SUCCESS';
export const CHARACTER_SEARCH_ERROR = 'CHARACTER/CHARACTER_SEARCH_ERROR';

export const searchCharacters = makeApiActionCreator(api.searchCharacters, CHARACTER_SEARCH_START, CHARACTER_SEARCH_SUCCESS, CHARACTER_SEARCH_ERROR);
