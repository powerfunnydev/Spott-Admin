import { createSelector } from 'reselect';

export const apiBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'api' ]);
export const apptvateWebsiteBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'apptvateWebsite' ]);
export const authenticationTokenSelector = (state) => state.getIn([ 'global', 'authentication', 'authenticationToken' ]);
export const cmsBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'cms' ]);
export const cmsNextBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'cmsNext' ]);
export const countriesSelector = (state) => state.getIn([ 'global', 'configuration', 'countries' ]);
export const currenciesSelector = (state) => state.getIn([ 'global', 'configuration', 'currencies' ]);
export const currentLocaleSelector = (state) => state.getIn([ 'global', 'configuration', 'currentLocale' ]);
export const currentModalSelector = (state) => state.getIn([ 'global', 'currentModal' ]);
export const isAuthenticatedSelector = (state) => Boolean(state.getIn([ 'global', 'authentication', 'authenticationToken' ]));
export const locationSelector = (state) => state.get('router').locationBeforeTransitions;
export const taggerBaseUrlSelector = (state) => state.getIn([ 'global', 'configuration', 'urls', 'tagger' ]);
export const usernameSelector = (state) => state.getIn([ 'global', 'authentication', 'user', 'username' ]);
export const userRolesSelector = (state) => state.getIn([ 'global', 'authentication', 'user', 'roles' ]);
export const versionSelector = (state) => state.getIn([ 'global', 'configuration', 'version' ]);
export const gendersSelector = (state) => state.getIn([ 'global', 'configuration', 'genders' ]);
export const localeNamesSelector = (state) => state.getIn([ 'global', 'configuration', 'localeNames' ]);
export const localesSelector = (state) => state.getIn([ 'global', 'configuration', 'locales' ]);

export function createQueryStringArraySelector (field) {
  return createSelector(
    locationSelector,
    ({ query }) => typeof query[field] === 'string' ? [ query[field] ] : (query[field] || [])
  );
}
