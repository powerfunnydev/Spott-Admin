import { persistSpott } from '../../../../actions/spott';
import { searchTopics as dataSearchTopics } from '../../../../actions/topic';
import { createSearchAction } from '../../../../utils';

export const SPOTT_PERSIST_ERROR = 'SPOTT_CREATE/SPOTT_PERSIST_ERROR';
export const TOPICS_SEARCH_START = 'SPOTT_CREATE/TOPICS_SEARCH_START';
export const TOPICS_SEARCH_ERROR = 'SPOTT_CREATE/TOPICS_SEARCH_ERROR';

export const searchTopics = createSearchAction(dataSearchTopics, TOPICS_SEARCH_START, TOPICS_SEARCH_ERROR);

export function submit ({ comment, defaultLocale, title, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const spott = {
        ...restProps,
        comment: { [defaultLocale]: comment },
        title: { [defaultLocale]: title },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistSpott(spott));
    } catch (error) {
      dispatch({ error, type: SPOTT_PERSIST_ERROR });
    }
  };
}
