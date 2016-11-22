import { createStructuredSelector } from 'reselect';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };

export const currentSeriesEntrySelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  currentSeriesEntry: currentSeriesEntrySelector
});
