import { SubmissionError } from 'redux-form/immutable';
import * as actions from '../../actions/users';
import { closeModal } from '../../actions/global';

export function login (values) {
  return async (dispatch, getState) => {
    const { email, password } = values.toJS();
    try {
      await dispatch(actions.login({ email, password }));
      dispatch(closeModal());
    } catch (e) {
      if (e === 'incorrect') {
        throw new SubmissionError({ _error: 'login.errors.incorrect' });
      }
      console.warn('Login error', e);
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  };
}

export function loginWithAuthenticationToken (authenticationToken) {
  return async (dispatch, getState) => {
    try {
      await dispatch(actions.login({ authenticationToken }));
    } catch (e) {
      console.warn('Could not automatically login.');
    }
  };
}

export const logout = actions.logout;

export function forgotPassword (values) {
  return async (dispatch, getState) => {
    const { email } = values.toJS();
    try {
      await dispatch(actions.forgotPassword({ email }));
      return { email };
    } catch (e) {
      console.warn('Error', e);
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  };
}

export function resetPassword (values) {
  return async (dispatch, getState) => {
    const { password, token } = values.toJS();
    try {
      await dispatch(actions.resetPassword({ password, token }));
    } catch (e) {
      throw new SubmissionError({ _error: 'forgotPassword.errors.failed' });
    }
  };
}
