import { createSelector, createStructuredSelector } from 'reselect';
import {
  createEntityIdsByRelationSelector,
  listCharactersEntitiesSelector,
  listPersonsEntitiesSelector,
  listProductsEntitiesSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasPersonsRelationsSelector,
  searchStringHasProductsRelationsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

export default function createTagSelector (formName, type) {
  const entityTypeSelector = createFormValueSelector('tagCreate', 'entityType');

  const spottTagsSelector = createSelector(
    createFormValueSelector(formName, 'tags'),
    (tags) => tags && typeof tags.toJS === 'function' ? tags.toJS() : tags
  );

  const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', type, 'currentTagsCharactersSearchString' ]);
  const currentPersonsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', type, 'currentTagsPersonsSearchString' ]);
  const currentProductsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', type, 'currentTagsProductsSearchString' ]);

  const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
  const searchedPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentPersonsSearchStringSelector);
  const searchedProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentProductsSearchStringSelector);

  const productCharactersSelector = createSelector(
    spottTagsSelector,
    listCharactersEntitiesSelector,
    listPersonsEntitiesSelector,
    (tags, charactersById, personsById) => {
      const characters = [];
      const myTags = tags ? tags : [];
      for (const tag of myTags) {
        if (tag.entityType === 'CHARACTER') {
          const character = charactersById.get(tag.characterId);
          if (character) {
            characters.push({
              entityType: 'CHARACTER',
              id: character.get('id'),
              imageUrl: character.getIn([ 'portraitImage', 'url' ]),
              name: character.get('name')
            });
          }
        } else if (tag.entityType === 'PERSON') {
          const person = personsById.get(tag.personId);
          if (person) {
            characters.push({
              entityType: 'PERSON',
              id: person.get('id'),
              imageUrl: person.getIn([ 'portraitImage', 'url' ]),
              name: person.get('fullName')
            });
          }
        }
      }
      return characters;
    }
  );

  const selectedProductSelector = createFormValueSelector('tagCreate', 'productId');
  return createStructuredSelector({
    charactersById: listCharactersEntitiesSelector,
    entityType: entityTypeSelector,
    personsById: listPersonsEntitiesSelector,
    productsById: listProductsEntitiesSelector,
    productCharacters: productCharactersSelector,
    searchedCharacterIds: searchedCharacterIdsSelector,
    searchedPersonIds: searchedPersonIdsSelector,
    searchedProductIds: searchedProductIdsSelector,
    selectedProductId: selectedProductSelector
  });
}
