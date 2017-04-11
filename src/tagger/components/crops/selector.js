import { createSelector, createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../selectors/global';
import { createFormValueSelector } from '../../../utils';
import { serializeFilterHasCountries, serializeFilterHasLanguages } from '../../../reducers/utils';
import {
  createEntityIdsByRelationSelector,
  createEntityByIdSelector,
  filterHasCountriesRelationsSelector,
  filterHasLanguagesRelationsSelector,
  searchStringHasTopicsRelationsSelector,
  spottsEntitiesSelector,
  topicsEntitiesSelector,
  listCharactersEntitiesSelector,
  listPersonsEntitiesSelector,
  listProductsEntitiesSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasPersonsRelationsSelector,
  searchStringHasProductsRelationsSelector
} from '../../../selectors/data';

import { List, Map } from 'immutable';
import {
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  characterHasAppearancesRelationsSelector,
  createEntitiesByRelationSelector,
  currentVideoIdSelector,
  sceneEntitiesSelector,
  videoHasCharactersRelationsSelector,
  videoHasScenesRelationsSelector,
  videoHasSceneGroupsRelationsSelector,
  sceneGroupEntitiesSelector,
  videoHasProductsRelationsSelector,
  productEntitiesSelector,
  productHasAppearancesRelationsSelector
} from '../../selectors/common';

const formName = 'cropPersist';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');
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
const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'crops', 'currentSceneId' ]);
const currentSceneSelector = createEntityByIdSelector(sceneEntitiesSelector, currentSceneIdSelector);

export default createStructuredSelector({
  currentScene: currentSceneSelector,
  // currentModal: currentModalSelector,
  // currentSpott: currentSpottSelector,

  // errors: formErrorsSelector,
  // formValues: valuesSelector,
  // popUpMessage: popUpMessageSelector,
  // productsById: listProductsEntitiesSelector,

  spotts: () => List()
  // supportedLocales: supportedLocalesSelector,
  // tags: spottTagsSelector,

});

// Select a crop modal
// ///////////////////

export const selectCropSelector = createStructuredSelector({
  scenes: allScenesSelector
});

// Persist a crop modal
// ///////////////////

export const persistCropSelector = createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  defaultLocale: currentDefaultLocaleSelector,
  searchedTopicIds: searchedTopicIdsSelector,
  supportedLocales: supportedLocalesSelector,
  topicIds: topicIdsSelector,
  topicsById: topicsEntitiesSelector
});
