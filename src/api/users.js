import { post } from './request';
import { transformUser } from './transformers';

export async function login (baseUrl, { email, password }) {
  console.warn(baseUrl);
  console.warn(`${baseUrl}/v003/security/login`);
  try {
    // TODO: localize! Server should return proper error message to display to the user.
    const { body } = await post(null, 'nl', `${baseUrl}/v003/security/login`, { userName: email, password });
    return {
      authenticationToken: body.authenticationToken,
      user: transformUser(body.user)
    };
  } catch (error) {
    if (error.body.message === 'verkeerde gebruikersnaam/password combinatie') {
      throw 'Email/password combination is incorrect.';
    }
    throw error.body.message;
  }
}

export function register (baseUrl, { email, firstname, lastname, password, dateOfBirth, gender }) {
  return post(null, null, `${baseUrl}/v003/user/users/register/username`, { email, firstName: firstname, lastName: lastname, password, dateOfBirth, gender });
}
