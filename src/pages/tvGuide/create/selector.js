import { createSelector, createStructuredSelector } from 'reselect';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  searchStringHasMediaRelationsSelector
} from '../../../selectors/data';
import { getFormValues } from 'redux-form/immutable';

const formSelector = getFormValues('tvGuideCreateEntry');

export const currentMediumIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('mediumId')
);

const currentMediumSelector = createEntityByIdSelector(mediaEntitiesSelector, currentMediumIdSelector);

// export const currentSeasonsSearchStringSelector = (state) => state.getIn([ 'content', 'editEpisodes', 'currentSeasonsSearchString' ]);
export const currentMediaSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'create', 'currentMediaSearchString' ]);
// export const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'editEpisodes', 'currentContentProducersSearchString' ]);
// export const currentSeriesFilterHasSeasonsStringSelector = createSelector(
//   currentSeriesIdSelector,
//   currentSeasonsSearchStringSelector,
//   (seriesId, searchString) => `searchString=${encodeURIComponent(searchString || '')}&seriesId=${seriesId || ''}`
// );
// export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesFilterHasSeasonsRelationsSelector, currentSeriesFilterHasSeasonsStringSelector);
export const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);

export default createStructuredSelector({
  // searchedSeasonIds: searchedSeasonIdsSelector,
  searchedMediumIds: searchedMediumIdsSelector,
  medium: currentMediumSelector,
  mediaById: mediaEntitiesSelector
});
