import { login } from '../../actions/users';
import { closeModal } from '../../actions/global';

export function submit (values) {
  return async (dispatch, getState) => {
    const { email, password } = values.toJS();
    await dispatch(login({ email, password }));
    // dispatch(closeModal());
  };
}
