export const authenticationTokenSelector = (state) => state.getIn([ 'global', 'authenticationToken' ]);
export const usernameSelector = (state) => state.getIn([ 'global', 'username' ]);
export const currentModalSelector = (state) => state.getIn([ 'global', 'currentModal' ]);

export const welcomeSelector = (state) => ({
  currentModal: currentModalSelector(state)
});
