import { del, get, post, BadRequestError, NotFoundError, UnexpectedError } from '../../api/request';

// TODO: Currently we take the first entry in localeData. Later on when localization
// is implemented, we can change this.

function transformProductAppearance ({ character, keyAppearance, markerHidden, markerStatus, product: { uuid: id }, relevance, scene: { uuid: sceneId }, uuid: appearanceId, point, region }) {
  // Character is optional.
  return { appearanceId, characterId: character && character.uuid, id, keyAppearance, markerHidden, markerStatus, point, region, relevance, sceneId };
}

function _transformVideoProducts (products) {
  const result = [];
  for (const { product: { uuid: id }, relevance, uuid: appearanceId } of products) {
    result.push({ appearanceId, id, relevance });
  }
  return result;
}

function transformDetailedProduct (product) {
  // TODO: remove patch code once brandInfo has been removed.
  // Some request return brandInfo others brand.
  const brand = { ...product.brand, ...product.brandInfo };
  // Images are optional, take the first image url.
  // brandName is optional.
  const { image, uuid: id } = product;
  if (product.localeData) {
    const { localeData: [ { images, shortName } ] } = product;
    return { brandId: brand.uuid, brandName: brand.name, id, imageUrl: images && images.length > 0 ? images[0].url : null, shortName };
  }
  return { brandId: brand.uuid, brandName: brand.name, id, imageUrl: image && image.url, shortName: product.shortName };
}

function transformSuggestedProducts (suggestedProducts) {
  const result = [];
  for (const { product, accuracy } of suggestedProducts) {
    result.push({ accuracy, product: transformDetailedProduct(product) });
  }
  return result;
}

function transformSimilarProduct ({ matchPercentage, product, uuid: id }) {
  return {
    id,
    matchPercentage,
    product: transformDetailedProduct(product)
  };
}

/**
 * GET /video/scenes/:sceneId/products
 * Get the products of a scene.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.sceneId The id of the scene in the video, where the products takes part of.
 * @param {string} data.videoId
 * @returnExample
 * [{
 *   appearanceId: 'product-appearance-id',
 *   [characterId]: 'character-id',
 *   id: 'product-id',
 *   markerHidden: true,
 *   markerStatus: 'ATTENTION' || 'DONE' || 'REVIEW'
 *   point: {
 *     x: 10,
 *     y: 10
 *   },
 *   [region]: {
 *     angle: 90,
 *     height: 100,
 *     width: 100,
 *     x: 50,
 *     y: 50
 *   },
 *   relevance: 'EXACT' ||  'LOW' || 'MEDIUM' || 'NONE'
 * }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getSceneProducts (baseUrl, authenticationToken, locale, { sceneId }) {
  const { body: { data: products } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/scenes/${sceneId}/products`);
  return products.map(transformProductAppearance);
}

export async function getVideoProducts (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { data: products } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/allProducts`);
  return products.map(transformDetailedProduct);
}

export async function getProductAppearances (baseUrl, authenticationToken, locale, { productId, videoId }) {
  const { body: { data: products } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/sceneProducts?productUuid=${productId}`);
  return products.map(transformProductAppearance);
}

/**
 * GET /video/videos/:videoId/products
 * Get the products of a video (global products).
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {string} videoId
 * @returnExample
 * [{
 *   appearanceId: 'product-appearance-id',
 *   id: 'product-id',
 *   relevance: 'EXACT' ||  'LOW' || 'MEDIUM' || 'NONE'
 * }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getGlobalProducts (baseUrl, authenticationToken, locale, { videoId }) {
  try {
    const { body: { data: products } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/products`);
    return _transformVideoProducts(products);
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        throw new NotFoundError('video', error);
    }
    throw new UnexpectedError(error);
  }
}

/**
 * GET /product/products/:productId
 * Get the details of a product. The brand of the product can be normalized.
 * To retrieve the brand we need to perform a separate request.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.productId
 * @returnExample
 * {
 *   brandId: 'brand-id'
 *   id: 'product-id',
 *   imageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v004/image/images/539766be-4ee4-4fee-83a7-99775471eb7c',
 *   shortName: '3 Pommes Jas bleu navy'
 * }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getProduct (baseUrl, authenticationToken, locale, { productId }) {
  try {
    const { body: { brand: { uuid: brandId }, localeData: [ { shortName, images } ], uuid: id } } = await get(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}`);
    // Images are optional, take the first image url.
    return { brandId, id, imageUrl: images && images.length > 0 ? images[0].url : null, shortName };
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        throw new NotFoundError('product', error);
    }
    throw new UnexpectedError(error);
  }
}

/**
 * GET /search?searchString=pommes+b&searchTags=true&type=PRODUCT
 * Search for products.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.brandName=''] Matches products of this brand (partial matching supported)
 * @param {string} [data.productOfferingPriceFrom=''] Matches products with offerings higher than or equal to this price.
 * @param {string} [data.productOfferingPriceTo='']  Matches products with offerings lower than or equal to this price.
 * @param {string} [data.productOfferingShopName=''] Matches products with offerings from this shop (partial matching supported)
 * @param {string} [data.searchString=''] The string to search products on.
 * @param {number} [data.pageSize=30] The number of search results to return.
 * @returnExample
 * {
 *   brandName: 'Nike',
 *   id: 'product-id',
 *   imageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v004/image/images/539766be-4ee4-4fee-83a7-99775471eb7c',
 *   shortName: '3 Pommes BACK TO SCHOOL Winterjas bleu fonce'
 * }
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function getProducts (baseUrl, authenticationToken, locale, { affiliate, brandName = '',
  productOfferingPriceFrom = '', productOfferingPriceTo = '', productOfferingShopName = '',
  searchString = '', pageSize = 30 }) {
  if (searchString.trim().length > 0) {
    let searchUrl = `${baseUrl}/v004/search?productFilter.brandName=${brandName}&pageSize=${pageSize}&productFilter.productOfferingPriceFrom=${productOfferingPriceFrom}&productFilter.productOfferingPriceTo=${productOfferingPriceTo}&productFilter.productOfferingShopName=${productOfferingShopName}&searchString=${searchString}&type=PRODUCT`;
    if (affiliate) {
      searchUrl += '&affiliate=true';
    }
    const { body: { data: products } } = await get(authenticationToken, locale, searchUrl);
    return products.map((p) => transformDetailedProduct(p.entity));
  }
  return [];
}

/**
 * GET /product/products/:productId/similar
 * Get similar products of a product.
 * @param {string} authenticationToken
 * @param {string} productId
 * @returnExample
 * {
 *   id,
 *   matchPercentage,
 *   product
 * }
 * @throws NotFoundError
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function getSimilarProducts (baseUrl, authenticationToken, locale, { productId }) {
  const { body: { pageCount, data } } = await get(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}/similar?page=0`);

  let similarProducts = data;
  for (let page = 1; page < pageCount; page++) {
    const { body: { data: products } } = await get(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}/similar?page=${page}`);
    similarProducts = similarProducts.concat(products);
  }

  return similarProducts.map(transformSimilarProduct);
}

/**
 * POST /video/scenes/:sceneId/products
 * Add a product to a scene, return the new list of products on that scene.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.appearanceId] The id of the appearance that needs to be updated. Leave it empty to add a product appearance.
 * @param {string} [data.characterId] The id of the character that wears the product.
 * @param {string} data.markerStatus The status of the marker, which can be 'ATTENTION', 'DONE' or 'REVIEW'.
 * @param {object} data.point The percentual position of the product in the scene (integers).
 * @param {number} data.point.x The percentual position of the product on the x-axis.
 * @param {number} data.point.y The percentual position of the product on the y-axis.
 * @param {string} data.product The id of the product in the scene.
 * @param {string} data.relevance The relevance of the product, which can be 'EXACT', 'LOW', 'MEDIUM' or 'NONE'.
 * @param {string} data.sceneId The id of the scene in the video.
 * @param {string} data.videoId
 * @returnExample
 * [{
 *   [appearanceId]: 'product-appearance-id',
 *   [characterId]: 'character-id',
 *   id: 'product-id',
 *   markerHidden: true,
 *   markerStatus: 'ATTENTION' || 'DONE' || 'REVIEW'
 *   point: {
 *     x: 10,
 *     y: 10
 *   },
 *   [region]: {
 *     angle: 90,
 *     height: 100,
 *     width: 100,
 *     x: 50,
 *     y: 50
 *   },
 *   relevance: 'EXACT' ||  'LOW' || 'MEDIUM' || 'NONE'
 * }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postSceneProduct (baseUrl, authenticationToken, locale, { appearanceId, characterId, keyAppearance, markerHidden, markerStatus, point, productId, relevance, sceneId, videoId }) {
  try {
    const { body: { data: products } } = await post(authenticationToken, 'en', `${baseUrl}/v004/video/scenes/${sceneId}/products`, {
      character: characterId && {
        uuid: characterId
      },
      keyAppearance,
      markerHidden,
      markerStatus,
      point,
      product: {
        uuid: productId
      },
      scene: {
        uuid: sceneId
      },
      relevance,
      sortOrder: 0,
      uuid: appearanceId
    });
    return products.map(transformProductAppearance);
  } catch (error) {
    switch (error.statusCode) {
      case 400:
        if (error.body.message === 'product does not exist') {
          throw new NotFoundError('product', error);
        }
        if (error.body.message === 'db.id_app_product.save') {
          throw new BadRequestError({ productId: 'required' }, error);
        }
        break;
      // case 403:
      //   throw new UnauthorizedError();
    }
    throw new UnexpectedError(error);
  }
}

/**
 * POST /video/videos/:videoId/products
 * Add a product to a video, return the new list of products in that video.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.appearanceId] The id of the appearance that needs to be updated. Leave it empty to add a product appearance.
 * @param {string} data.productId The id of the product in the scene.
 * @param {string} data.relevance The relevance of the product, which can be 'EXACT', 'LOW', 'MEDIUM' or 'NONE'.
 * @param {string} data.videoId
 * @returnExample
 * [{
 *   appearanceId: 'product-appearance-id',
 *   id: 'product-id',
 *   relevance: 'EXACT' ||  'LOW' || 'MEDIUM' || 'NONE'
 * }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postVideoProduct (baseUrl, authenticationToken, locale, { appearanceId, productId, relevance, videoId }) {
  try {
    const { body: { data: products } } = await post(authenticationToken, 'en', `${baseUrl}/v004/video/videos/${videoId}/products`, {
      product: {
        uuid: productId
      },
      relevance,
      sortOrder: 0,
      uuid: appearanceId
    });
    console.warn('products', _transformVideoProducts(products));
    return _transformVideoProducts(products);
  } catch (error) {
    switch (error.statusCode) {
      case 400:
        if (error.body.message === 'product does not exist') {
          throw new NotFoundError('product', error);
        }
        if (error.body.message === 'product already linked to video') {
          throw new BadRequestError({ productId: 'alreadyExists' }, error);
        }
        if (error.body.message === 'db.id_app_product.save') {
          throw new BadRequestError({ productId: 'required' }, error);
        }
        break;
      // case 403:
      //   throw new UnauthorizedError();
    }
    throw new UnexpectedError(error);
  }
}

/**
 * DELETE /video/scenes/:sceneId/products/:productAppearanceId
 * Remove a product from a scene, return the new list of products on that scene.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.productAppearanceId The appearance id of the product in the scene.
 * @param {string} data.sceneId The id of the scene in the video, where the product is part of.
 * @param {string} data.videoId
 * @returnExample
 * [{
 *   [appearanceId]: 'product-appearance-id',
 *   [characterId]: 'character-id',
 *   id: 'product-id',
 *   markerHidden: true,
 *   markerStatus: 'ATTENTION' || 'DONE' || 'REVIEW'
 *   point: {
 *     x: 10,
 *     y: 10
 *   },
 *   [region]: {
 *     angle: 90,
 *     height: 100,
 *     width: 100,
 *     x: 50,
 *     y: 50
 *   },
 *   relevance: 'EXACT' ||  'LOW' || 'MEDIUM' || 'NONE'
 * }]<
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function deleteSceneProduct (baseUrl, authenticationToken, locale, { productAppearanceId, sceneId, videoId }) {
  try {
    const { body: { data: products } } = await del(authenticationToken, 'en', `${baseUrl}/v004/video/scenes/${sceneId}/products/${productAppearanceId}`);
    return products.map(transformProductAppearance);
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        if (error.body.message === 'product appearance in scene does not exist') {
          throw new NotFoundError('product', error);
        }
        break;
    }
    throw new UnexpectedError(error);
  }
}

/**
 * DELETE /video/videos/:videoId/products/:productAppearanceId
 * Remove a product from a video, return the new list of products on that video.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.appearanceId The appearance id of the product in the video.
 * @param {string} data.videoId
 * @returnExample
 * [{
 *   appearanceId: 'product-appearance-id',
 *   id: 'product-id',
 *   relevance: 'EXACT' ||  'LOW' || 'MEDIUM' || 'NONE'
 * }]<
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function deleteVideoProduct (baseUrl, authenticationToken, locale, { appearanceId, videoId }) {
  const { body: { data: products } } = await del(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/products/${appearanceId}`);
  return _transformVideoProducts(products);
}

/**
 * GET /rest/v004/image/searches/products
 * Searches for product suggestions given a rectangular part of the given image.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.imageId The unique identifier of the image from which a rectangular part is taken.
 * @param {Object} data.region
 * @param {int} data.region.x The (procentual) x-coordinate of the upperleft corner of the rectangle in the image.
 * @param {int} data.region.y The (procentual) y-coordinate of the upperleft corner of the rectangle in the image.
 * @param {int} data.region.width The (procentual) width of the rectangle in the image.
 * @param {int} data.region.height The (procentual) height of the rectangle in the image.
 * @returnExample
 * [ ... ]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getProductSuggestions (baseUrl, authenticationToken, locale, { imageId, region: { x, y, width, height } }) {
  try {
    const { body } = await get(authenticationToken, 'en', `${baseUrl}/v004/image/searches/products?imageUUid=${imageId}&x=${x}&y=${y}&width=${width}&height=${height}&maxResults=50`);
    return transformSuggestedProducts(body);
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        if (error.body.message === 'image does not exist') {
          throw new NotFoundError('image', error);
        }
    }
    throw new UnexpectedError(error);
  }
}

/**
 * GET /rest/v004/image/images/{imageUuid}/cropAsJson
 * POST /rest/v004/product/products/{productUuid}/images
 * Associates a rectangular part of the given image with the given product,
 * for product suggestion purposes.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} imageId The unique identifier of the image from which a rectangular part is taken.
 * @param {int} x The (procentual) x-coordinate of the upperleft corner of the rectangle in the image.
 * @param {int} y The (procentual) y-coordinate of the upperleft corner of the rectangle in the image.
 * @param {int} width The (procentual) width of the rectangle in the image.
 * @param {int} height The (procentual) height of the rectangle in the image.
 * @param {string} productId The unique identifier of the product to which the cropped rectangular image should be associated for future product suggestions.
 * @returnExample
 * {}
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postProductSuggestionImage (baseUrl, authenticationToken, locale, { imageId, region: { x, y, width, height }, productId }) {
  try {
    // Crop the image
    const { body: cropBody } = await get(authenticationToken, locale, `${baseUrl}/v004/image/images/${imageId}/cropAsJson?x=${x}&y=${y}&width=${width}&height=${height}`);
    // Post as product image
    const { body: postProductImageBody } = await post(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}/croppedImages`, {
      data: cropBody.data
    });
    // Return product data
    return transformDetailedProduct(postProductImageBody);
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        if (error.body.message === 'image does not exist') {
          throw new NotFoundError('image', error);
        } else if (error.body.message === 'product does not exist') {
          throw new NotFoundError('product', error);
        }
    }
    throw new UnexpectedError(error);
  }
}
