export const ID = 'UA-80435219-1';

/**
 * Initialize Google Analytics.
 *
 * This instatiates the download and execution of the Analytics.js script and prepares the ga()
 * command queue with the creation of a new tracker object.
 */
export function init () {
  // Ignore if already initialized
  if (window.ga) {
    return;
  }
  // Make the ga function
  window.ga = function () {
    (window.ga.q = window.ga.q || []).push(arguments);
  };
  window.ga.l = Number(new Date());
  // Create script tag for google analytics
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = '//www.google-analytics.com/analytics.js';
  // Append the tag to the head
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(gaScript);
  // Create a new tracker object
  window.ga('create', ID, 'auto');
}

/**
 * Send a new pageview to google analytics
 * @param {string} page - The path portion of the URL the page being tracked. This value should start with a slash (/) character.
 */
export function pageView (page) {
  // Set page
  window.ga('set', {
    page
  });
  console.log('Pageview ', page);
  // Send next pageview
  window.ga('send', 'pageview');
}
