import { SubmissionError } from 'redux-form/immutable';
import * as actions from '../../actions/users';

export function login (values) {
  console.log('values login-----', values);
  return async (dispatch, getState) => {
    const { email, password } = values.toJS();
    console.log(email, ' ', password);
    try {
      await dispatch(actions.login({ email, password }));
    } catch (e) {
      if (e === 'incorrect') {
        throw new SubmissionError({ _error: 'login.errors.incorrect' });
      }
      console.warn('Login error', e);
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
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
