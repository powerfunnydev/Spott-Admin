export const apiBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'api' ]);
export const apptvateWebsiteBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'apptvateWebsite' ]);
export const authenticationTokenSelector = (state) => state.getIn([ 'global', 'authentication', 'authenticationToken' ]);
export const cmsBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'cms' ]);
export const cmsNextBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'cmsNext' ]);
export const currentLocaleSelector = (state) => state.getIn([ 'global', 'configuration', 'currentLocale' ]);
export const currentModalSelector = (state) => state.getIn([ 'global', 'currentModal' ]);
export const isAuthenticatedSelector = (state) => Boolean(state.getIn([ 'global', 'authentication', 'authenticationToken' ]));
export const taggerBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'tagger' ]);
export const usernameSelector = (state) => state.getIn([ 'global', 'username' ]);
export const versionSelector = (state) => state.getIn([ 'global', 'configuration', 'version' ]);

export const welcomeSelector = (state) => ({
  currentModal: currentModalSelector(state)
});
