import { createEntitiesByRelationSelector, characterSearchRelationsSelector, characterSearchStringSelector, characterEntitiesSelector } from './common';

const characterSearchResultSelector = createEntitiesByRelationSelector(characterSearchRelationsSelector, characterSearchStringSelector, characterEntitiesSelector);

export default (state) => ({
  characterSearchResult: characterSearchResultSelector(state)
});
