import { del, get, post } from './request';
import { transformProductOffering } from './transformers';

export async function fetchProductOfferings (baseUrl, authenticationToken, locale) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/product/offerings`);
  return data.map(transformProductOffering);
}

export async function persistProductOffering (baseUrl, authenticationToken, locale, { affiliateInfo, productId, productOfferingId, shopId,
  currency, amount, buyUrl, locale: offeringLocale }) {
  let productOffering = {};
  if (productOfferingId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/offerings/${productOfferingId}`);
    productOffering = body;
  }
  productOffering.buyUrl = buyUrl;
  productOffering.shop = { uuid: shopId };
  productOffering.price = { amount, currency };
  productOffering.locale = offeringLocale;
  productOffering.product = { uuid: productId };
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/product/offerings`, productOffering);
  return transformProductOffering(body);
}

export async function deleteProductOffering (baseUrl, authenticationToken, locale, { productOfferingId }) {
  const { body } = await del(authenticationToken, locale, `${baseUrl}/v004/product/offerings/${productOfferingId}`);
  return transformProductOffering(body);
}
