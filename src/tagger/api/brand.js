import { get } from '../../api/request';

/**
 * GET /product/brands/:brandId
 * Get the details of a brand.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.brandId
 * @returnExample
 * {
 *   brand: 'Levis'
 *   id: 'brand-id'
 * }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getBrand (baseUrl, authenticationToken, locale, { brandId }) {
  const { body: { localeData: [ { name } ], uuid: id } } = await get(authenticationToken, locale, `${baseUrl}/v004/product/brands/${brandId}`);
  return { id, name };
}
