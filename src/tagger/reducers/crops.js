import { Map } from 'immutable';
import * as actions from '../components/crops/actions';

/**
  * crops
  * -> currentSceneId
  */
export default (state = Map({ currentSceneId: null }), action) => {
  switch (action.type) {
    case actions.SELECT_FRAME:
      return state.set('currentSceneId', action.sceneId);
    case actions.TOPICS_SEARCH_START:
      return state.set('currentTopicsSearchString', action.searchString);
    default:
      return state;
  }
};
