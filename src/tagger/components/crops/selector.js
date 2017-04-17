import { createSelector, createStructuredSelector } from 'reselect';
import { currentLocaleSelector } from '../../../selectors/global';
import { createFormValueSelector } from '../../../utils';
import {
  createEntityIdsByRelationSelector,
  createEntityByIdSelector,
  searchStringHasTopicsRelationsSelector,
  topicsEntitiesSelector
} from '../../../selectors/data';
import { List, Map } from 'immutable';
import {
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  createEntitiesByRelationSelector,
  currentVideoIdSelector,
  sceneEntitiesSelector,
  videoHasScenesRelationsSelector,
  videoHasCropsRelationsSelector,
  listCropEntitiesSelector,
  productEntitiesSelector,
  sceneHasCharactersRelationsSelector,
  sceneHasProductsRelationsSelector
} from '../../selectors/common';
import { CHARACTER, PRODUCT } from '../../constants/appearanceTypes';

const formName = 'cropPersist';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');

const spottTagsSelector = createSelector(
  createFormValueSelector(formName, 'tags'),
  (tags) => tags && typeof tags.toJS === 'function' ? tags.toJS() : tags
);
const topicIdsSelector = createSelector(
  createFormValueSelector(formName, 'topicIds'),
  (topicIds) => topicIds && typeof topicIds.toJS === 'function' ? topicIds.toJS() : topicIds
);

export const currentTopicsSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'crops', 'currentTopicsSearchString' ]);

export const searchedTopicIdsSelector = createEntityIdsByRelationSelector(searchStringHasTopicsRelationsSelector, currentTopicsSearchStringSelector);

// const _sceneGroupsSelector = createEntitiesByRelationSelector(videoHasSceneGroupsRelationsSelector, currentVideoIdSelector, sceneGroupEntitiesSelector);
// export const characterAppearancesSelector = createEntitiesByRelationSelector(characterHasAppearancesRelationsSelector, currentCharacterIdSelector, appearanceEntitiesSelector);
// export const productAppearancesSelector = createEntitiesByRelationSelector(productHasAppearancesRelationsSelector, currentProductIdSelector, appearanceEntitiesSelector);

export const allScenesSelector = createSelector(
   currentVideoIdSelector,
   videoHasScenesRelationsSelector,
   sceneEntitiesSelector,
   (videoId, videoHasScenes, scenes) => {
     const sceneIds = videoHasScenes.get(videoId) || List();
     return sceneIds.map((sceneId) => scenes.get(sceneId));
   }
 );
//
// export const visibleScenesSelector = createSelector(
//   _sceneGroupsSelector,
//   characterAppearancesSelector,
//   productAppearancesSelector,
//   sceneEntitiesSelector,
//   (sceneGroups, characterAppearances, productAppearances, scenesById) => {
//     return List();
//     // if (currentSceneGroup) {
//     //   result = currentSceneGroup
//     //     .get('scenes')
//     //     .map((f) => f.set('isKeyFrame', currentSceneGroup.get('keySceneId') === f.get('id')));
//     // }
//     // if (currentCharacterId) {
//     //   result = characterAppearances
//     //     .get('data')
//     //     .map((a) => {
//     //       return scenesById.get(a.get('sceneId')).set('appearance', a);
//     //     })
//     //     .filter((f) => f)
//     //     .map((f) => f.set('isKeyFrame', f.getIn([ 'appearance', 'keyAppearance' ])));
//     // }
//     // if (currentProductId) {
//     //   result = productAppearances
//     //     .get('data')
//     //     .map((a) => {
//     //       return scenesById.get(a.get('sceneId')).set('appearance', a);
//     //     })
//     //     .filter((f) => f)
//     //     .map((f) => f.set('isKeyFrame', f.getIn([ 'appearance', 'keyAppearance' ])));
//     // }
//     // return result
//     //   .filter((f) => !f.get('hidden') &&
//     //     (!hideNonKeyFrames || f.get('isKeyFrame')));
//   }
// );
export const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'crops', 'currentSceneId' ]);
const currentSceneSelector = createEntityByIdSelector(sceneEntitiesSelector, currentSceneIdSelector);

const cropsSelector = createEntitiesByRelationSelector(videoHasCropsRelationsSelector, currentVideoIdSelector, listCropEntitiesSelector);

export default createStructuredSelector({
  crops: cropsSelector,
  currentLocale: currentLocaleSelector,
  currentScene: currentSceneSelector,
  // currentModal: currentModalSelector,
  // currentSpott: currentSpottSelector,

  // errors: formErrorsSelector,
  // formValues: valuesSelector,
  // popUpMessage: popUpMessageSelector,
  // productsById: listProductsEntitiesSelector,

  spotts: () => List()
  // tags: spottTagsSelector,

});

// Select a crop modal
// ///////////////////

export const selectCropSelector = createStructuredSelector({
  scenes: allScenesSelector
});

// Persist a crop modal
// ///////////////////

const _appearancesSelector = createSelector(
  currentSceneIdSelector,
  sceneHasCharactersRelationsSelector,
  sceneHasProductsRelationsSelector,
  appearanceEntitiesSelector,
  (sceneId, sceneHasCharacters, sceneHasProducts, appearancesEntities) => {
    const characterAppearanceIds = sceneHasCharacters.get(sceneId) || List();
    const productAppearanceIds = sceneHasProducts.get(sceneId) || List();

    let appearances = List();
    characterAppearanceIds.forEach((characterAppearanceId) => {
      appearances = appearances.push(appearancesEntities.get(characterAppearanceId));
    });
    productAppearanceIds.forEach((productAppearanceId) => {
      appearances = appearances.push(appearancesEntities.get(productAppearanceId));
    });

    return appearances;
  }
);

const appearancesSelector = createSelector(
  _appearancesSelector,
  characterEntitiesSelector,
  productEntitiesSelector,
  (appearances, charactersById, productsById) => {
    return appearances.map((appearance) => {
      switch (appearance.get('type')) {
        case CHARACTER:
          return Map({
            appearance,
            entity: charactersById.get(appearance.get('id'))
          });
        case PRODUCT:
          return Map({
            appearance,
            entity: productsById.get(appearance.get('id'))
          });
      }
      console.warn('Selectors:sceneEditor: Unsupported appearance type ', appearance);
      return null;
    });
  }
);

export const persistCropSelector = createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  appearances: appearancesSelector,
  defaultLocale: currentDefaultLocaleSelector,
  searchedTopicIds: searchedTopicIdsSelector,

  topicIds: topicIdsSelector,
  topicsById: topicsEntitiesSelector
});
