import { del, get, post } from './request';
import { transformPaging, transformUser } from './transformers';

export async function login (baseUrl, { authenticationToken, email, password }) {
  try {
    // TODO: localize! Server should return proper error message to display to the user.
    const { body } = await post(null, 'nl', `${baseUrl}/v003/security/login`, { authenticationToken, userName: email, password, roles: [ 'APPTVATE_USER' ] });
    return {
      authenticationToken: body.authenticationToken,
      user: {
        username: body.userName,
        roles: body.roles.map(({ role }) => role)
      }
    };
  } catch (error) {
    if (error.body.httpStatus === 401) {
      /* eslint-disable no-throw-literal */
      throw 'incorrect';
    }
    throw error;
  }
}

export async function forgotPassword (baseUrl, authenticationToken, locale, { email }) {
  try {
    return await post(authenticationToken, 'en', `${baseUrl}/v003/user/password/reset`, { email });
  } catch (error) {
    if (error.name === 'BadRequestError' && error.body) {
      if (error.body.message === 'user already has a reset token') {
        throw 'alreadySendMail';
      }
      throw 'invalidEmail';
    }
    throw error;
  }
}

export async function resetPassword (baseUrl, authenticationToken, locale, { password, token }) {
  await post(authenticationToken, locale, `${baseUrl}/v003/user/password/change`, { password, token });
}

export async function fetchUsers (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/user/users?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  const result = transformPaging(body);
  result.data = body.data.map(transformUser);
  return result;
}

export async function fetchUser (baseUrl, authenticationToken, locale, { userId }) {
  const url = `${baseUrl}/v004/user/users/${userId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformUser(body);
}

export async function persistUser (baseUrl, authenticationToken, locale, { id, name }) {
  let broadcaster;
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${id}`);
    broadcaster = body;
    // console.log('body', body);
  }
  const url = `${baseUrl}/v004/media/broadcasters`;
  await post(authenticationToken, locale, url, { ...broadcaster, uuid: id, name });
}

export async function deleteUser (baseUrl, authenticationToken, locale, { userId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/user/users/${userId}`);
}

export async function deleteUsers (baseUrl, authenticationToken, locale, { userIds }) {
  for (const userId of userIds) {
    await deleteUser(baseUrl, authenticationToken, locale, { userId });
  }
}
