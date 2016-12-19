import { List, Map, OrderedSet } from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import { CHARACTER_QUICKY, PRODUCT_QUICKY } from '../constants/itemTypes';
import { LATEST } from '../constants/quickiesTabTypes';

function appendCharacterId (state, characterId) {
  return state.set('characters', state.get('characters').add(characterId));
}

/**
 * Helper function which adds a character/product appearance template to
 * the Immutable List 'characterHasQuickies' in the given state. To check if a template is
 * already present in the quickies list, a equality function is passed as last argument.
 * The new quicky will be added to the front of the List if it was not found.
 * If the quicky is already present, the original state is returned.
 * @param {Object} state The state of the application which contains the Immutable List 'characterHasQuickies'.
 * @param {Object} template The new character/product appearance template, to add to the List.
 * @param {function} equal An equality function, to check if the quicky is already present in the List.
 * @return {Object} The new Immutable state, where eventually a new quicky was added.
 */
function prependQuicky (state, path, template, equal) {
  let quickies = state.getIn(path) || List();
  const index = quickies.findIndex(equal);
  // Character/Product was found, remove it first.
  if (index !== -1) {
    quickies = quickies.delete(index);
  }
  // Add the template of an appearance to the front of the list.
  quickies = quickies.unshift(template);
  // Update state
  return state.setIn(path, quickies);
}

function addQuickiesCharacter (state, characterId) {
  // Create a template of a character appearance (id and type).
  const characterTemplate = Map({ characterId, type: CHARACTER_QUICKY });
  // Add quicky to the quickies list.
  // The quicky is already present if it's of the same type (CHARACTER_QUICKY) and has the same character id.
  const newState = prependQuicky(state, [ 'quickies' ], characterTemplate,
    (quicky) => quicky.get('type') === CHARACTER_QUICKY && quicky.get('characterId') === characterId);
  // Append the character id if it does not exist.
  return appendCharacterId(newState, characterId);
}

function addQuickiesProduct (state, { characterId, markerHidden, productId, relevance }) {
  // Create a template of a product appearance (characterId, markerHidden, productId and  relevance).
  const productTemplate = Map({ characterId, markerHidden, productId, relevance, type: PRODUCT_QUICKY });
  // Create an equality function for quicky products.
  const equalQuickyProduct = (quicky) => quicky.get('type') === PRODUCT_QUICKY && quicky.get('productId') === productId && quicky.get('characterId') === characterId;
  // Add quicky to the quickies list.
  // The quicky is already present if it's of the same type (PRODUCT_QUICKY) and has the same product id and the same character linked to it.
  const nextState = prependQuicky(state, [ 'quickies' ], productTemplate, equalQuickyProduct);
  // Append the character id if there is a character linked to the product.
  if (characterId) {
    return appendCharacterId(nextState, characterId);
  }
  return nextState;
}

/**
  * Quickies reducer:
  * The order of the characterId's will be the order in which they were added.
  * -> activeTab: one of [ 'LATEST', 'SCENES', 'CHARACTERS' ]
  * -> characters: OrderedSet(characterId)
  *    The character which is currently selected, if any (equals the null when selected
  *    'Recent').
  * -> currentCharacterId
  * -> currentEditProductGroupId
  *    The product group in the scenes tab which we're currently editing.
  * -> currentEditCharacterProductGroupId
  *    The product group in the characters tab which we're currently editing.
  * -> openCharacterId
  *    The character which is selected to see its product groups.
  * -> quickies: List(quickies)
  *    List of all appearance templates (quickies)
  * -> selectedProductId
  *    The product to show the details of.
  */
export default (state = Map({ activeTab: LATEST, characters: OrderedSet(), quickies: List() }), action) => {
  switch (action.type) {
    case actionTypes.QUICKIES_SELECT_TAB:
      return state.set('activeTab', action.tab);
    case actionTypes.CHARACTER_SELECT:
      return state.set('currentCharacterId', action.characterId);
    case actionTypes.CHARACTER_OPEN:
      return state.set('openCharacterId', action.characterId);
    case actionTypes.PRODUCT_SELECT:
      if (state.get('selectedProductId') === action.productId) {
        return state.delete('selectedProductId');
      }
      return state.set('selectedProductId', action.productId);
    case actionTypes.EDIT_PRODUCT_GROUP_SELECT:
      return state.set('currentEditProductGroupId', action.productGroupId);
    case actionTypes.EDIT_CHARACTER_PRODUCT_GROUP_SELECT:
      return state.set('currentEditCharacterProductGroupId', action.productGroupId);
    case actionTypes.CREATE_PRODUCT_MARKER_SUCCESS:
      return addQuickiesProduct(state, action);
    case actionTypes.CREATE_CHARACTER_MARKER_SUCCESS:
      return addQuickiesCharacter(state, action.characterId);
    case actionTypes.LOCAL_QUICKY_DELETE:
      return state.deleteIn([ 'quickies', action.index ]);
    default:
      return state;
  }
};
