
import { searchTopics as dataSearchTopics } from '../../../actions/topic';
import { createSearchAction } from '../../../utils';

export const TOPICS_SEARCH_START = 'CROP_EDIT/TOPICS_SEARCH_START';
export const TOPICS_SEARCH_ERROR = 'CROP_EDIT/TOPICS_SEARCH_ERROR';

export const SELECT_FRAME = 'CROP_EDIT/SELECT_FRAME';

export const submit = console.warn;

export const searchTopics = createSearchAction(dataSearchTopics, TOPICS_SEARCH_START, TOPICS_SEARCH_ERROR);

export function selectFrame ({ sceneId }) {
  return { sceneId, type: SELECT_FRAME };
}
