import { searchMediumCharacters as dataSearchMediumCharacters } from '../../../../../actions/character';

export { persistMediumCharacter, deleteMediumCharacter } from '../../../../../actions/character';
export const MEDIUM_CHARACTERS_SEARCH_ERROR = 'HELPERS_CHARACTERS/MEDIUM_CHARACTERS_SEARCH_ERROR';

/* search on all characters of a specific medium */
export function searchMediumCharacters (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumCharacters({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_CHARACTERS_SEARCH_ERROR });
    }
  };
}
