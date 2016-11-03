import * as actions from '../../actions/user';

export function loginWithAuthenticationToken (authenticationToken) {
  return async (dispatch, getState) => {
    try {
      await dispatch(actions.login({ authenticationToken }));
    } catch (e) {
      console.warn('Could not automatically login.');
    }
  };
}
