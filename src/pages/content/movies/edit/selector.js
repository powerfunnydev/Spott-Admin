import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  createEntitiesByRelationSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  listBrandsEntitiesSelector,
  listCharactersEntitiesSelector,
  listMediumCategoriesEntitiesSelector,
  listShopsEntitiesSelector,
  mediaEntitiesSelector,
  mediumHasBrandsRelationsSelector,
  mediumHasCharactersRelationsSelector,
  mediumHasShopsRelationsSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  searchStringHasMediumCategoriesRelationsSelector,
  searchStringHasShopsRelationsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

export const formName = 'movieEdit';

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentMovieIdSelector = (state, props) => { return props.params.movieId; };
const currentMovieSelector = createEntityByIdSelector(mediaEntitiesSelector, currentMovieIdSelector);

const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentBrandsSearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentBroadcastersSearchString' ]);
const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentCharacterSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentMediumCategoriesSearchString' ]);
const currentShopSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentShopSearchString' ]);
const popUpMessageSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'popUpMessage' ]);

const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);
const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);
const searchedShopIdsSelector = createEntityIdsByRelationSelector(searchStringHasShopsRelationsSelector, currentShopSearchStringSelector);

const movieBrandsSelector = createEntitiesByRelationSelector(mediumHasBrandsRelationsSelector, currentMovieIdSelector, listBrandsEntitiesSelector);
const movieCharactersSelector = createEntitiesByRelationSelector(mediumHasCharactersRelationsSelector, currentMovieIdSelector, listCharactersEntitiesSelector);
const movieShopsSelector = createEntitiesByRelationSelector(mediumHasShopsRelationsSelector, currentMovieIdSelector, listShopsEntitiesSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  brandsById: listBrandsEntitiesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentMovie: currentMovieSelector,
  currentModal: currentModalSelector,
  defaultLocale: currentDefaultLocaleSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  movieBrands: movieBrandsSelector,
  movieCharacters: movieCharactersSelector,
  movieShops: movieShopsSelector,
  popUpMessage: popUpMessageSelector,
  errors: formErrorsSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedMediumCategoryIds: searchedMediumCategoryIdsSelector,
  searchedShopIds: searchedShopIdsSelector,
  shopsById: listShopsEntitiesSelector,
  supportedLocales: supportedLocalesSelector,
  formValues: valuesSelector
});
