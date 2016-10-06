import { post } from './request';

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
