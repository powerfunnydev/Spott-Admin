const currentToastSelector = (state) => state.getIn([ 'toast', 0 ]);

export default (state) => ({
  currentToast: currentToastSelector(state)
});
