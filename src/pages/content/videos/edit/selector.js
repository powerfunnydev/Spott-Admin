import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  createEntityByIdSelector,
  // listMediaEntitiesSelector,
  // mediaEntitiesSelector,
  // searchStringHasSeriesEntriesRelationsSelector,
  videosEntitiesSelector
} from '../../../../selectors/data';
// import { createFormValueSelector } from '../../../../utils';

const formName = 'videoEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const currentVideoIdSelector = (state, props) => props.params.videoId;
const currentVideoSelector = createEntityByIdSelector(videosEntitiesSelector, currentVideoIdSelector);
// const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);
// const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  currentVideo: currentVideoSelector,
  currentModal: currentModalSelector,
  // currentSeriesEntryId: currentSeriesEntryIdSelector,
  // defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector
  // searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  // seriesEntriesById: listMediaEntitiesSelector
});
