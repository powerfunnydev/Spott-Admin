import { del, get, post } from './request';
import { transformSimilarProduct } from './transformers';

export async function persistSimilarProduct (baseUrl, authenticationToken, locale, { product1Id, product2Id, similarProductId }) {
  let productOffering = {};
  if (similarProductId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/similarProducts/${similarProductId}`);
    productOffering = body;
  }
  productOffering.product1 = { uuid: product1Id };
  productOffering.product2 = { uuid: product2Id };
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/product/similarProducts`, productOffering);
  return transformSimilarProduct(body);
}

export async function deleteSimilarProduct (baseUrl, authenticationToken, locale, { similarProductId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/product/similarProducts/${similarProductId}`);
}
