import { usernameSelector } from '../selectors/global';

/**
 * Extracts the name of the current user from the state tree.
 * @returnExample {
 *   username: '...'
 * }
 */
export default (state) => {
  const username = usernameSelector(state);
  return {
    username
  };
};
