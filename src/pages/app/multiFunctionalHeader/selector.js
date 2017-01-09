import { createStructuredSelector } from 'reselect';
import { usernameSelector } from '../../../selectors/global';

export default createStructuredSelector({
  username: usernameSelector
});
