import { post } from './request';

export async function login (baseUrl, { authenticationToken, email, password }) {
  try {
    // TODO: localize! Server should return proper error message to display to the user. 'APPTVATE_USER'
    const { body } = await post(null, 'nl', `${baseUrl}/v003/security/login`, { authenticationToken, userName: email, password, roles: [ ] });
    return {
      authenticationToken: body.authenticationToken,
      user: {
        username: body.userName,
        roles: body.roles
      }
    };
  } catch (error) {
    if (error.body.httpStatus === 401) {
      /* eslint-disable no-throw-literal */
      throw 'incorrect';
    }
    throw error.body.message;
  }
}

export function forgotPassword (baseUrl, authenticationToken, locale, { email }) {
  return post(authenticationToken, locale, `${baseUrl}/v003/user/password/reset`, { email });
}

export function resetPassword (baseUrl, authenticationToken, locale, { password, token }) {
  return post(authenticationToken, locale, `${baseUrl}/v003/user/password/change`, { password, token });
}
