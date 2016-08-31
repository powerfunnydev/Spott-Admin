import { post } from './request';

export async function login (baseUrl, { email, password }) {
  try {
    // TODO: localize! Server should return proper error message to display to the user.
    const { body } = await post(null, 'nl', `${baseUrl}/v003/security/login`, { userName: email, password });
    return {
      authenticationToken: body.authenticationToken,
      user: {
        email: body.userName,
        roles: body.roles
      }
    };
  } catch (error) {
    if (error.body.httpStatus === 401) {
      throw 'incorrect';
    }
    throw error.body.message;
  }
}

export function register (baseUrl, { email, firstname, lastname, password, dateOfBirth, gender }) {
  return post(null, null, `${baseUrl}/v003/user/users/register/username`, { email, firstName: firstname, lastName: lastname, password, dateOfBirth, gender });
}

export function forgotPassword (baseUrl, authenticationToken, locale, { email }) {
  return { email };
  //post(null, null, `${baseUrl}/v003/user/users/register/username`, { email });
}
