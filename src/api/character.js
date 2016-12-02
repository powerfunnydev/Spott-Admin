// import { del, get, post, postFormData } from './request';
import { transformCharacter } from './transformers';

export function searchCharacters (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  /* let url = `${baseUrl}/v004/media/broadcasters?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformBroadcaster);
  return body;*/

  const characters = [
    { uuid: 'louis', name: 'Louis', image: { url: 'https://spott-cms-rest-tst.appiness.mobi:443/apptvate/rest/v004/image/images/06d2d037-612d-4d2a-a00f-1a5242e9cfc0?height=203&width=360' } },
    { uuid: 'jos', name: 'Jos', image: { url: 'https://spott-cms-rest-tst.appiness.mobi:443/apptvate/rest/v004/image/images/06d2d037-612d-4d2a-a00f-1a5242e9cfc0?height=203&width=360' } }
  ];
  return characters.map(transformCharacter);
}
