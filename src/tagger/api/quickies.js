import { del, get, post } from '../../api/request';
import { PRODUCT_QUICKY } from '../constants/itemTypes';

function transformProduct ({ character, markerHidden, product: { uuid: productId }, relevance }) {
  // Character is optional.
  return { characterId: character && character.uuid, markerHidden, productId, relevance, type: PRODUCT_QUICKY };
}

function transformProductGroup ({ uuid: id, name, products }) {
  return { id, name, products: products.map(transformProduct) };
}

/**
 * DELETE /media/media/:mediumId/productGroups/:productGroupId
 * Remove a product group from a medium.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} data.mediumId
 * @param {string} data.productGroupId
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function deleteProductGroup (baseUrl, authenticationToken, locale, { mediumId, productGroupId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/productGroups/${productGroupId}`);
}

/**
 * GET /media/media/:mediumId/productGroups/:productGroupId
 * Get a product group of a medium, the products are included in the product group.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} data.mediumId
 * @param {string} data.productGroupId
 * @returnExample
 * {
 *   id: '123'
 *   name: 'Kitchen',
 *   products: [ characterId, markerHidden, productId, relevance ]
 *  }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getProductGroup (baseUrl, authenticationToken, locale, { mediumId, productGroupId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/productGroups/${productGroupId}`);
  return transformProductGroup(body);
}

/**
 * GET /media/media/:mediumId/productGroups
 * Get the product groups of a medium, the products are included in the product group.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} data.mediumId The unique identifier of the medium.
 * @returnExample
 * [{
 *   id: '123'
 *   name: 'Kitchen',
 *   products: [ characterId, markerHidden, productId, relevance ]
 *  }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getProductGroups (baseUrl, authenticationToken, locale, { mediumId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/productGroups?pageSize=1000`);
  return data.map(transformProductGroup);
}

/**
 * POST /media/media/:mediumId/productGroups/:productGroupId
 * Create/update a product group.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} [data.id] The id of the product group we want to update.
 * @param {string} data.name The name of the product group.
 * @param {[Object]} [data.products] All products in the product group { characterId, productId, relevance }.
 *                   The characterId is optional.
 * @returnExample
 * {
 *   id: '123'
 *   name: 'Keuken',
 *   products: [ { characterId, markerHidden, productId, relevance } ]
 * }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postProductGroup (baseUrl, authenticationToken, locale, { id, name, mediumId, products = [] }) {
  let productGroup = {};

  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/productGroups/${id}`);
    productGroup = body;
  }

  productGroup.name = name;
  productGroup.products = products.map(({ characterId, markerHidden, productId, relevance }) => ({
    character: characterId && { uuid: characterId },
    markerHidden,
    product: { uuid: productId },
    relevance
  }));

  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/productGroups`, productGroup);
  return transformProductGroup(body);
}
