import { del, get, post, postFormData } from './request';
import { transformPaging, transformUser } from './transformers';
import { ACTIVE, ADMIN, CONTENT_MANAGER, CONTENT_PRODUCER, BROADCASTER } from '../constants/userRoles';

export async function login (baseUrl, { authenticationToken, email, password }) {
  try {
    // TODO: localize! Server should return proper error message to display to the user.
    const { body } = await post(null, 'nl', `${baseUrl}/v004/security/login`, { authenticationToken, userName: email, password, roles: [ 'APPTVATE_USER' ] });
    return {
      authenticationToken: body.authenticationToken,
      user: {
        username: body.user.userName,
        roles: body.user.roles.map(({ role }) => role)
      }
    };
  } catch (error) {
    /* eslint-disable no-throw-literal */
    if (error.body.httpStatus === 401) {
      throw 'incorrect';
    }
    throw error;
  }
}

export async function forgotPassword (baseUrl, authenticationToken, locale, { email }) {
  try {
    return await post(authenticationToken, 'en', `${baseUrl}/v004/user/password/reset`, { email });
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
  await post(authenticationToken, locale, `${baseUrl}/v004/user/password/change`, { password, token });
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

/**
 * broadcaster, contentProducer, contentManager and sysAdmin are bools (from checkboxes).
 * broadcasters and contentproducers are arrays of Ids of broadcasters and contentproducers
 * respectively.
 */
export async function persistUser (baseUrl, authenticationToken, locale, { dateOfBirth, disabledReason,
    userStatus, userId, userName, email, firstName, lastName, gender, languages,
    contentProducer, contentProducers, contentManager, broadcaster, broadcasters, sysAdmin }) {
  const roles = [];
  if (broadcaster) {
    broadcasters.map((broadcasterId) => {
      roles.push({ role: BROADCASTER, context: { uuid: broadcasterId } });
    });
  }
  if (contentProducer) {
    contentProducers.map((contentProducerId) => {
      roles.push({ role: CONTENT_PRODUCER, context: { uuid: contentProducerId } });
    });
  }
  if (contentManager) { roles.push({ role: CONTENT_MANAGER }); }
  if (sysAdmin) { roles.push({ role: ADMIN }); }

  let user = { };
  const url = `${baseUrl}/v004/user/users`;
  if (userId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/user/users/${userId}`);
    user = body;
  }

  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.disabled = userStatus === ACTIVE || user.disabled || false;
  user.userName = userName;
  user.gender = gender || user.gender;
  user.disabledReason = disabledReason || user.disabledReason;
  // Only use date, no timezone.
  user.dateOfBirth = (dateOfBirth && dateOfBirth.local().format('YYYY-MM-DD')) || user.dateOfBirth;
  user.languages = languages || user.languages;
  user.roles = roles || user.roles;
  // user.roles = [ { role: 'CONTENT_MANAGER' } ];
  const response = await post(authenticationToken, locale, url, user);
  const transformedResponse = transformUser(response.body);
  return transformedResponse;
}

export async function deleteUser (baseUrl, authenticationToken, locale, { userId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/user/users/${userId}`);
}

export async function deleteUsers (baseUrl, authenticationToken, locale, { userIds }) {
  for (const userId of userIds) {
    await deleteUser(baseUrl, authenticationToken, locale, { userId });
  }
}

// Used for autocompletion.
export async function searchUsers (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/user/users?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformUser);
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { userId, image, callback }) {
  const formData = new FormData();
  formData.append('uuid', userId);
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/user/users/${userId}/profileImage`, formData, callback);
}

export async function uploadBackgroundImage (baseUrl, authenticationToken, locale, { userId, image, callback }) {
  const formData = new FormData();
  formData.append('uuid', userId);
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/user/users/${userId}/avatarImage`, formData, callback);
}
