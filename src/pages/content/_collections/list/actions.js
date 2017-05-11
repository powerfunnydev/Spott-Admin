import { searchMediumBrands as dataSearchMediumBrands } from '../../../../actions/brand';
import { searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';
import { fetchMediumCollections } from '../../../../actions/collection';
import { fetchCollectionItems } from '../../../../actions/collectionItem';
import { searchSeasons as dataSearchSeasons } from '../../../../actions/series';
import { searchEpisodes as dataSearchEpisodes } from '../../../../actions/season';
import { createSearchAction } from '../../../../utils';
import { currentSeasonIdSelector } from './selector';

export { importCollections } from '../../../../actions/media';
export { fetchCollection as loadCollection, deleteCollection, moveCollection, persistCollection, reorderCollections } from '../../../../actions/collection';
export { fetchCollectionItem as loadCollectionItem, fetchCollectionItems, deleteCollectionItem, persistCollectionItem, moveCollectionItem, moveCollectionItemToOtherCollection } from '../../../../actions/collectionItem';
export const MEDIUM_BRANDS_SEARCH_ERROR = 'HELPERS_COLLECTIIONS/MEDIUM_BRANDS_SEARCH_ERROR';
export const MEDIUM_CHARACTERS_SEARCH_ERROR = 'HELPERS_COLLECTIIONS/MEDIUM_CHARACTERS_SEARCH_ERROR';

export const EPISODES_SEARCH_START = 'HELPERS_COLLECTIIONS/EPISODES_SEARCH_START';
export const EPISODES_SEARCH_ERROR = 'HELPERS_COLLECTIIONS/EPISODES_SEARCH_ERROR';

export const SEASONS_SEARCH_START = 'HELPERS_COLLECTIIONS/SEASONS_SEARCH_START';
export const SEASONS_SEARCH_ERROR = 'HELPERS_COLLECTIIONS/SEASONS_SEARCH_ERROR';

// Search on all brands of a specific medium.
export function searchMediumBrands (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumBrands({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_BRANDS_SEARCH_ERROR });
    }
  };
}

// Search on all characters (cast) of a specific medium.
export function searchMediumCharacters (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumCharacters({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_CHARACTERS_SEARCH_ERROR });
    }
  };
}

export function loadCollections ({ mediumId }) {
  return async (dispatch, getState) => {
    const { data: collections } = await dispatch(fetchMediumCollections({ mediumId }));
    for (const { id } of collections) {
      await dispatch(fetchCollectionItems({ collectionId: id }));
    }
    return collections;
  };
}

export const searchEpisodes = createSearchAction(dataSearchEpisodes, EPISODES_SEARCH_START, EPISODES_SEARCH_ERROR, (state) => ({ seasonId: currentSeasonIdSelector(state) }));
export const searchSeasons = createSearchAction(dataSearchSeasons, SEASONS_SEARCH_START, SEASONS_SEARCH_ERROR);
