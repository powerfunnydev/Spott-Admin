import { push } from 'react-router-redux';

/**
 * Action creator for manipulation of the history by means of push. The action creator
 * takes a location descriptor, which can be a url or a descriptive object
 * see (https://github.com/rackt/history/blob/master/docs/Glossary.md#locationdescriptor).
 */
export const updatePath = push;
