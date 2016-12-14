import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  listCharactersEntitiesSelector,
  mediaEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  searchStringHasMediumCategoriesRelationsSelector,
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  listMediumCategoriesEntitiesSelector,
  mediumHasCharactersRelationsSelector,
  createEntitiesByRelationSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

export const formName = 'movieEdit';

const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentMovieIdSelector = (state, props) => { return props.params.movieId; };
const currentMovieSelector = createEntityByIdSelector(mediaEntitiesSelector, currentMovieIdSelector);

const movieCharactersSelector = createEntitiesByRelationSelector(mediumHasCharactersRelationsSelector, currentMovieIdSelector, listCharactersEntitiesSelector);

const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentCharacterSearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentBroadcastersSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentMediumCategoriesSearchString' ]);
const popUpMessageSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'popUpMessage' ]);

const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  broadcastersById: broadcastersEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentMovie: currentMovieSelector,
  currentModal: currentModalSelector,
  defaultLocale: currentDefaultLocaleSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  movieCharacters: movieCharactersSelector,
  popUpMessage: popUpMessageSelector,
  errors: formErrorsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedMediumCategoryIds: searchedMediumCategoryIdsSelector,
  supportedLocales: supportedLocalesSelector
});
