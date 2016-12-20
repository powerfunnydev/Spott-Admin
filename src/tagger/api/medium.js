import { get } from '../../api/request';
import * as mediumTypes from '../../constants/mediumTypes';
// TODO: Currently we take the first entry in localeData. Later on when localization
// is implemented, we can change this.

/**
 * GET /media/commercials/:mediumId
 * GET /media/movies/:mediumId
 * GET /media/serieEpisodes/:mediumId
 * Get medium title by id.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param (string) data.mediumId The unique identifier of the medium to fetch. Must be of the passed mediumType.
 * @param (string) data.mediumType See "/constants/mediumTypes".
 * @returnExample
 *   {
 *     characters: [ { id: 'abcd', weight: 100 } ],
 *     id: 'serie-episode-id',
 *     [seriesId]: 'series-id',
 *     title: 'Aflevering 1',
 *     type: 'serieEpisode'
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getMedium (baseUrl, authenticationToken, locale, { mediumId, mediumType }) {
  // Perform correct call based on medium type, fetch id and title
  let id;
  let rootMediumId;
  let title;
  switch (mediumType) {
    // Request movie title
    case mediumTypes.MOVIE:
      const { body: movieBody } = await get(authenticationToken, locale, `${baseUrl}/v004/media/movies/${mediumId}`);
      id = movieBody.uuid;
      rootMediumId = id;
      title = movieBody.localeData[0].title;
      break;
    // Request episode title
    case mediumTypes.EPISODE:
      const { body: serieEpisodeBody } = await get(authenticationToken, locale, `${baseUrl}/v004/media/serieEpisodes/${mediumId}`);
      id = serieEpisodeBody.uuid;
      rootMediumId = serieEpisodeBody.serie.uuid;
      title = serieEpisodeBody.localeData[0].title;
      break;
    // Request commercial title
    case mediumTypes.COMMERCIAL:
      const { body: commercialBody } = await get(authenticationToken, locale, `${baseUrl}/v004/media/commercials/${mediumId}`);
      id = commercialBody.uuid;
      rootMediumId = id;
      title = commercialBody.localeData[0].title;
      break;
  }
  const { body: { data: characters } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/castMembers`);
  // Done. return.
  return { characters: characters.map(({ uuid }) => ({ id: uuid })), id, rootMediumId, title, mediumType };
}
