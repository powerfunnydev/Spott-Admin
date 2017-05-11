import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form/immutable';
import { MOVIE, EPISODE, COMMERCIAL, SERIE, SEASON } from './constants/mediumTypes';

// Cache form selectors.
const formSelectors = {};
export function createFormValueSelector (form, field) {
  if (!formSelectors[form]) {
    // Insert in cache.
    formSelectors[form] = getFormValues(form);
  }
  return createSelector(
    formSelectors[form],
    (f) => f && f.get(field)
  );
}

/**
 * Helper function to pad zeros.
 */
export function zeroPad (num, places = 2) {
  const zero = places - num.toString().length + 1;
  return Array(zero > 0 ? zero : 0).join('0') + num;
}

export function fileSizeToString (size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(Number(size / Math.pow(1024, i)).toFixed(2))}${[ 'B', 'kB', 'MB', 'GB', 'TB' ][i]}`;
}

export function arraysEqual (a, b) {
  if (a === b) { return true; }
  if (!a || !b) { return false; }
  if (a.length !== b.length) { return false; }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) { return false; }
  }
  return true;
}

/**
 * Creates and returns a new debounced version of the passed function which
 * will postpone its execution until after wait milliseconds have elapsed since
 * the last time it was invoked. Useful for implementing 'search'. After we
 * stopped entering the search string, we want to perform a single search.
 * NOTE: based on underscore's debounce()
 * @param {function} func The function to be applied after a certain time.
 * @param {number} wait The number of milliseconds to wait until execution.
 */
/* eslint-disable */
export function slowdown (func, wait, immediate) {
  let timeout;
	return function() {
		const context = this;
    const args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) {
        func.apply(context, args);
      }
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
      func.apply(context, args);
    }
	};
}

export function downloadFile (url) {
  const userAgentString = navigator.userAgent.toLowerCase();
  // Chrome and Safari support a virtual link being clicked
  if (userAgentString.indexOf('chrome') > -1 || userAgentString.indexOf('safari') > -1) {
    // Create a-tag, if HTML5's download attribute is supported, we use it
    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.download = 'download';
    if (linkEl.download) { linkEl.download = url.substring(url.lastIndexOf('/') + 1, url.length); }
    // Click the link
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      linkEl.dispatchEvent(e);
      return true;
    }
  }
  // Failback method
  // Why does the file shows up in the same tab on Windows Phone 8?
  // Here is why: http://stackoverflow.com/questions/12201436/how-to-open-a-new-window-or-tab-via-javascript-in-windows-phone-7-browser
  window.location.href = url;
}

/* eslint-enable */

// Creates an action creator which takes a searchString
export function createSearchAction (dataAction, startActionType, errorActionType, selector) {
  return (searchString = '', extraArgs = {}) => {
    return async (dispatch, getState) => {
      const lowerCaseSearchString = searchString.toLowerCase();
      const payload = selector ? selector(getState()) : extraArgs;
      try {
        dispatch({ searchString: lowerCaseSearchString, type: startActionType, ...payload });
        return await dispatch(dataAction({ searchString: lowerCaseSearchString, ...payload }));
      } catch (error) {
        dispatch({ error, searchString: lowerCaseSearchString, type: errorActionType, ...payload });
      }
    };
  };
}

export function getMediumReadUrl (medium) {
  switch (medium.get('type')) {
    case COMMERCIAL:
      return `/content/commercials/read/${medium.get('id')}`;
    case EPISODE:
      return `/content/series/read/${medium.getIn([ 'serie', 'id' ])}/seasons/read/${medium.getIn([ 'season', 'id' ])}/episodes/read/${medium.get('id')}`;
    case MOVIE:
      return `/content/movies/read/${medium.get('id')}`;
    case SEASON:
      return `/content/series/read/${medium.getIn([ 'serie', 'id' ])}/seasons/read/${medium.get('id')}`;
    case SERIE:
      return `/content/series/read/${medium.get('id')}`;
  }
}
