import { post } from '../../api/request';

/**
 * Performs POST /security/login
 * Login with username and password
 */
export async function postLogin ({ username, password }) {
  const { body: { authenticationToken } } = await post(null, 'en', '/v003/security/login', { userName: username, password, roles: [ 'CONTENT_MANAGER', 'SYS_ADMIN' ] });
  return authenticationToken;
}
