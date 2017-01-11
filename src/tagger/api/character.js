import { del, get, post, BadRequestError, NotFoundError, UnexpectedError } from '../../api/request';
import { PRODUCT_QUICKY } from '../constants/itemTypes';

// TODO: Currently we take the first entry in localeData. Later on when localization
// is implemented, we can change this.

function transformCharacterAppearance ({ character: { uuid: id }, keyAppearance, markerHidden, markerStatus, point, region, scene, uuid: appearanceId }) {
  return { appearanceId, id, markerHidden, markerStatus, keyAppearance, point, region, sceneId: scene.uuid };
}

function transformDetailedCharacter (character) {
  const { name, portraitImage, uuid: id } = character;
  if (character.localeData) {
    return { id, name: character.localeData[0].name, portraitImageUrl: portraitImage ? portraitImage.url : null };
  }
  // Portrait image is optional.
  return { id, name, portraitImageUrl: portraitImage ? portraitImage.url : null };
}

function transformProduct (characterId, { product: { uuid: productId }, relevance }) {
  return { characterId, productId, relevance, type: PRODUCT_QUICKY };
}

function transformProductGroup (characterId, { uuid: id, name, products }) {
  return { id, name, products: products.map(transformProduct.bind(null, characterId)) };
}

/**
 * GET /video/videos/:videoId/scenes/:sceneId/characters
 * Get the id and appearance id of the characters on a scene.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param (string) data.sceneId The id of the scene in the video.
 * @param (string) data.videoId
 * @returnExample
 * [{
 *   appearanceId: 'character-appearance-id',
 *   id: 'character-id'
 * }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getSceneCharacters (baseUrl, authenticationToken, locale, { sceneId }) {
  const { body: { data: characters } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/scenes/${sceneId}/characters`);
  return characters.map(transformCharacterAppearance);
}

export async function getVideoCharacters (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { data: characters } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/allCharacters`);
  return characters.map(transformDetailedCharacter);
}

export async function getMediumCharacters (baseUrl, authenticationToken, locale, { mediumId, page = 0, pageSize = 100 }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/castMembers?page=${page}&pageSize=${pageSize}`);
  return data.map(transformDetailedCharacter);
}

export async function getCharacterAppearances (baseUrl, authenticationToken, locale, { characterId, videoId }) {
  const { body: { data: characters } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/sceneCharacters?characterUuid=${characterId}`);
  return characters.map(transformCharacterAppearance);
}

/**
 * GET /media/characters
 * Search for characters.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.searchString=''] The string to search characters on.
 * @param {number} [data.pageSize=30] The number of search results to return.
 * @returnExample
 * [{
 *   id: 'character-id'
 *   name: 'Tom De Decker',
 *   portraitImageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v004/image/images/539766be-4ee4-4fee-83a7-99775471eb7c'
 * }]
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function getCharacters (baseUrl, authenticationToken, locale, { searchString = '', pageSize = 30 }) {
  if (searchString.trim().length > 0) {
    const { body: { data: characters } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/characters?pageSize=${pageSize}&searchString=${encodeURIComponent(searchString)}`);
    return characters.map(({ uuid: id, name, portraitImage }) => ({
      id, name, portraitImageUrl: portraitImage ? portraitImage.url : null
    }));
  }
  return [];
}

/**
 * GET /media/characters/:characterId
 * Get the details of a character.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.characterId
 * @returnExample
 * {
 *   id: 'character-id'
 *   name: 'Tom De Decker',
 *   portraitImageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v004/image/images/539766be-4ee4-4fee-83a7-99775471eb7c'
 * }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getCharacter (baseUrl, authenticationToken, locale, { characterId }) {
  const { body: { uuid: id, localeData: [ { name } ], portraitImage } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}`);
  // Portrait image is optional.
  return { id, name, portraitImageUrl: portraitImage ? portraitImage.url : null };
}

/**
 * POST /video/videos/:videoId/scenes/:sceneId/characters
 * Add a character to a scene and return the new list of characters.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.appearanceId] The id of the appearance that needs to be updated. Leave it empty to add a character appearance.
 * @param {string} data.characterId The id of the character to add to the scene.
 * @param {object} data.point The percentual position of the product in the scene (integers).
 * @param {number} data.point.x The percentual position of the product on the x-axis.
 * @param {number} data.point.y The percentual position of the product on the y-axis.
 * @param (string) data.sceneId The id of the scene in the video.
 * @param (string) data.videoId
 * @returnExample
 * [{
 *   appearanceId: 'character-appearance-id',
 *   id: 'character-id'
 * }]
 * @throws BadRequestError code: characterAlreadyInScene or characterId.required
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postSceneCharacter (baseUrl, authenticationToken, locale, { appearanceId, characterId, keyAppearance, markerHidden, markerStatus, point, region, sceneId }) {
  try {
    const { body: { data: characters } } = await post(authenticationToken, 'en', `${baseUrl}/v004/video/scenes/${sceneId}/characters`, {
      character: {
        uuid: characterId
      },
      keyAppearance,
      markerHidden,
      markerStatus,
      point,
      region,
      scene: {
        uuid: sceneId
      },
      sortOrder: 0,
      uuid: appearanceId
    });
    return characters.map(transformCharacterAppearance);
  } catch (error) {
    switch (error.statusCode) {
      case 400:
        if (error.body.message === 'character already in scene' || error.body.message === 'character zit reeds in de scene') {
          throw new BadRequestError('characterAlreadyInScene', error);
        }
        if (error.body.message === 'db.id_app_character.save') {
          throw new BadRequestError('characterId.required', error);
        }
        if (error.body.message === 'character does not exist') {
          throw new NotFoundError('character', error);
        }
        break;
      // case 403:
      //   throw new UnauthorizedError();
    }
    throw new UnexpectedError(error);
  }
}

/**
 * DELETE /video/videos/:videoId/scenes/:sceneId/characters/:characterAppearanceId
 * Remove a character from a scene, return the new list of characters on that scene.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} data.characterAppearanceId The appearance id of the character in the scene, which we want to remove.
 * @param (string) data.sceneId The id of the scene in the video, where the character takes part of.
 * @param (string) data.videoId
 * @returnExample
 * [{
 *   appearanceId: 'character-appearance-id',
 *   id: 'product-id',
 *   position: {
 *     x: 10,
 *     y: 10
 *   },
 *   relevance: 'EXACT'
 * }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function deleteSceneCharacter (baseUrl, authenticationToken, locale, { characterAppearanceId, sceneId, videoId }) {
  try {
    const { body: { data: characters } } = await del(authenticationToken, 'en', `${baseUrl}/v004/video/scenes/${sceneId}/characters/${characterAppearanceId}`);
    return characters.map(transformCharacterAppearance);
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        if (error.body.message === 'character appearance in scene does not exist') {
          throw new NotFoundError('character', error);
        }
        break;
    }
    throw new UnexpectedError(error);
  }
}

/**
 * GET /rest/v004/image/images/{imageUuid}/cropAsJson
 * POST /rest/v004/media/characters/{characterUuid}/faces
 * Associates a rectangular part of the given image with the given character,
 * for face recognition purposes.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} imageId The unique identifier of the image from which a rectangular part is taken.
 * @param {int} x The (procentual) x-coordinate of the upperleft corner of the rectangle in the image.
 * @param {int} y The (procentual) y-coordinate of the upperleft corner of the rectangle in the image.
 * @param {int} width The (procentual) width of the rectangle in the image.
 * @param {int} height The (procentual) height of the rectangle in the image.
 * @param {string} characterId The unique identifier of the character to which the cropped rectangular image should be associated for future image recognition.
 * @returnExample
 * {
 *   id: '50ed4223-ed90-4326-9af4-33494b88e135',
 *   name: 'Tom De Decker',
 *   portraitImageUrl: 'https://spott-cms-rest-tst.appiness.mobi:443/apptvate/rest/v004/image/images/abc5ad3a-25f2-4eaf-bdf1-853e773bdc28'
 * }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postCharacterFace (baseUrl, authenticationToken, locale, { imageId, region: { x, y, width, height }, characterId }) {
  try {
    // Crop the image
    const { body: cropBody } = await get(authenticationToken, locale, `${baseUrl}/v004/image/images/${imageId}/cropAsJson?x=${x}&y=${y}&width=${width}&height=${height}`);
    // Post to faces
    const { body: postFaceBody } = await post(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}/faces`, {
      data: cropBody.data
    });
    // Return character data
    return transformDetailedCharacter(postFaceBody);
  } catch (error) {
    switch (error.statusCode) {
      // case 403:
      //   throw new UnauthorizedError();
      case 404:
        if (error.body.message === 'image does not exist') {
          throw new NotFoundError('image', error);
        } else if (error.body.message === 'character does not exist') {
          throw new NotFoundError('character', error);
        }
    }
    throw new UnexpectedError(error);
  }
}

/**
 * DELETE /media/characters/:characterId/productGroups/:productGroupId
 * Remove a product group from a medium.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} data.characterId
 * @param {string} data.productGroupId
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function deleteProductGroup (baseUrl, authenticationToken, locale, { characterId, productGroupId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}/productGroups/${productGroupId}`);
}

/**
 * GET /media/characters/:characterId/productGroups/:productGroupId
 * Get a product group of a character, the products are included in the product group.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} data.characterId
 * @param {string} data.productGroupId
 * @returnExample
 * {
 *   id: '123'
 *   name: 'Kitchen',
 *   products: [ characterId, productId, relevance ]
 *  }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getProductGroup (baseUrl, authenticationToken, locale, { characterId, productGroupId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}/productGroups/${productGroupId}`);
  return transformProductGroup(characterId, body);
}

/**
 * GET /media/characters/:characterId/productGroups
 * Get the product groups of a character, the products are included in the product group.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} data.characterId The unique identifier of the character.
 * @returnExample
 * [{
 *   id: '123'
 *   name: 'Kitchen',
 *   products: [ characterId, productId, relevance ]
 *  }]
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getProductGroups (baseUrl, authenticationToken, locale, { characterId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}/productGroups?pageSize=1000`);
  return data.map(transformProductGroup.bind(null, characterId));
}

/**
 * POST /media/characters/:characterId/productGroups/:productGroupId
 * Create/update a product group.
 * @param {string} authenticationToken
 * @param {Object} data
 * @param {string} [data.id] The id of the product group we want to update.
 * @param {string} data.name The name of the product group.
 * @param {[Object]} [data.products] All products in the product group { productId, relevance }.
 * @returnExample
 * {
 *   id: '123'
 *   name: 'Keuken',
 *   products: [ { characterId, productId, relevance } ]
 * }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postProductGroup (baseUrl, authenticationToken, locale, { characterId, id, name, products = [] }) {
  let productGroup = {};

  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}/productGroups/${id}`);
    productGroup = body;
  }

  productGroup.name = name;
  productGroup.products = products.map(({ productId, relevance }) => ({
    product: { uuid: productId },
    relevance
  }));

  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/characters/${characterId}/productGroups`, productGroup);
  return transformProductGroup(characterId, body);
}
