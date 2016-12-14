/**
 * Creates and returns a new debounced version of the passed function which
 * will postpone its execution until after wait milliseconds have elapsed since
 * the last time it was invoked. Useful for implementing 'search'. After we
 * stopped entering the search string, we want to perform a single search.
 * NOTE: based on underscore's debounce()
 * @param {function} func The function to be applied after a certain time.
 * @param {wait} number The number of milliseconds to wait until execution.
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
/* eslint-enable */

export function simpleCompare (fields, props, nextProps) {
  for (const field of fields) {
    if (props[field] !== nextProps[field]) {
      return true;
    }
  }
  return false;
}

// Destructive! Used for HotKeys
export function filterKeyEventsInInputFields (handlers) {
  for (const key in handlers) {
    const func = handlers[key];
    handlers[key] = function () {
      // Do nothing if we are in an input field.
      const focussedElement = document.activeElement;
      if (focussedElement && focussedElement.tagName.toLowerCase() === 'input') {
        return;
      }
      Reflect.apply(func, null, arguments);
    };
  }
  return handlers;
}
