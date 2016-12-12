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
  mediaEntitiesSelector,
  mediumHasCharactersRelationsSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasContentProducersRelationsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'commercialEdit';
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);

const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');
const hasBannerSelector = createFormValueSelector(formName, 'hasBanner');

const currentCommercialIdSelector = (state, props) => props.params.commercialId;
const currentCommercialSelector = createEntityByIdSelector(mediaEntitiesSelector, currentCommercialIdSelector);

const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBrandsSearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBroadcastersSearchString' ]);
const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentCharacterSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentContentProducersSearchString' ]);

const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);

const commercialCharactersSelector = createEntitiesByRelationSelector(mediumHasCharactersRelationsSelector, currentCommercialIdSelector, listCharactersEntitiesSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  broadcastersById: broadcastersEntitiesSelector,
  brandsById: listBrandsEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  commercialCharacters: commercialCharactersSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentCommercial: currentCommercialSelector,
  currentModal: currentModalSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  hasBanner: hasBannerSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  supportedLocales: supportedLocalesSelector
});
