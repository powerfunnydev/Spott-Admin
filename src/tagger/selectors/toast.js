const currentToastSelector = (state) => state.getIn([ 'tagger', 'tagger', 'toast', 0 ]);

export default (state) => ({
  currentToast: currentToastSelector(state)
});
