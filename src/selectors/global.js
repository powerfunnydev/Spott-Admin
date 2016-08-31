export const authenticationTokenSelector = (state) => state.getIn([ 'global', 'authentication', 'authenticationToken' ]);
export const usernameSelector = (state) => state.getIn([ 'global', 'username' ]);
export const currentModalSelector = (state) => state.getIn([ 'global', 'currentModal' ]);

export const isAuthenticatedSelector = (state) => !state.getIn([ 'global', 'authentication', 'authenticationToken' ]);

export const currentLocaleSelector = (state) => state.getIn([ 'global', 'configuration', 'currentLocale' ]);
export const apiBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'api' ]);
export const apptvateWebsiteBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'apptvateWebsite' ]);
export const cmsBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'cms' ]);
export const cmsNextBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'cmsNext' ]);
export const taggerBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'tagger' ]);

export const welcomeSelector = (state) => ({
  currentModal: currentModalSelector(state)
});
