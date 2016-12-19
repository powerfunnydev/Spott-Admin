import { fromJS, Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes';

/**
 * -> appearance
 * -> appearanceType
 * -> similarScenesOfScene
 */
export default (state = fromJS({ similarScenesOfScene: {} }), action) => {
  switch (action.type) {
    case actionTypes.MODAL_OPEN_ADD_APPEARANCE_TO_SIMILAR_FRAMES:
      const isSimilarScenes = action.similarSceneIds.reduce((scenes, sceneId) => scenes.set(sceneId, true), Map());

      // Store a template of the appearance to add it to the similar frames which are not hidden.
      return state
        .setIn([ 'similarScenesOfScene', action.sceneId ], isSimilarScenes)
        .set('appearance', action.appearance)
        .set('appearanceType', action.appearanceType);
    case actionTypes.SELECT_SIMILAR_SCENE:
      const sceneId = action.scene.get('id');
      const isSimilarScene = state.getIn([ 'similarScenesOfScene', action.currentSceneId, sceneId ]);
      return state.setIn([ 'similarScenesOfScene', action.currentSceneId, sceneId ], !isSimilarScene);
    default:
      return state;
  }
};
