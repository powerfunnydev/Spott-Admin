import { createStructuredSelector } from 'reselect';
import {
  seasonHasEpisodesSelector,
  createEntitiesByRelationSelector,
  listMediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../../selectors/data';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'seasons', 'read', 'episodes', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'seasons', 'read', 'episodes', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'seasons', 'read', 'episodes', 'totalResultCount' ]);

export const currentSeasonIdSelector = (state, props) => { return props.params.seasonId; };

export const currentSeasonSelector = createEntityByIdSelector(listMediaEntitiesSelector, currentSeasonIdSelector);

export const episodesSelector = createEntitiesByRelationSelector(
  seasonHasEpisodesSelector,
  currentSeasonIdSelector,
  listMediaEntitiesSelector
);
export default createStructuredSelector({
  episodes: episodesSelector,
  currentSeason: currentSeasonSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
