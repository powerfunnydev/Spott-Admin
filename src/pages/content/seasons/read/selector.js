import { createStructuredSelector } from 'reselect';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentSeasonIdSelector = (state, props) => { return props.params.seasonId; };

export const currentSeasonSelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeasonIdSelector);

export default createStructuredSelector({
  currentSeason: currentSeasonSelector
});
