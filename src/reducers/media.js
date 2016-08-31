import { Map } from 'immutable';
import * as actions from '../actions/media';
import { LOCATION_CHANGE } from 'react-router-redux';
import { DESCRIPTION_TAB } from '../constants/createMediaTabTypes';
import { EPISODE } from '../constants/mediaTypes';

/**
 * The app reducer is responsible for storing the current open modal.
 *
 * app
 * -> currentCreateMediaMediaType
 * -> currentCreateMediaTab
 * -> createMediaStatus, one of: 'wizard', 'cancelled', 'progress', 'completed', 'failed'
 */
export default (state = Map({ currentCreateMediaMediaType: EPISODE, currentCreateMediaTab: DESCRIPTION_TAB }), action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      if (action.payload.pathname === '/media/upload') {
        return state.set('createMediaStatus', 'wizard')
          // Reset to default media type and tap.
          .set('currentCreateMediaMediaType', EPISODE)
          .set('currentCreateMediaTab', DESCRIPTION_TAB);
      }
      return state;
    case actions.CREATE_MEDIA_SELECT_MEDIA_TYPE:
      return state.set('currentCreateMediaMediaType', action.mediaType);
    case actions.CREATE_MEDIA_SELECT_TAB:
      return state.set('currentCreateMediaTab', action.tab);
    case actions.CREATE_MEDIA_CANCEL_WIZARD:
      return state.set('createMediaStatus', 'cancelled');
    case actions.CREATE_MEDIA_START:
      return state.set('createMediaStatus', 'progress')
        .set('createMediaJobName', action.jobName);
    case actions.UPLOAD_FILE_START:
      return state.set('createMediaProgress', 0)
        .set('createMediaStartTime', new Date().getTime());
    case actions.UPLOAD_FILE_PROGRESS:
      // Calculate progress as a percentage
      const progressPercentage = Math.round((action.currentBytes * 100) / action.totalBytes);
      // Calculate remaining time in seconds
      let remainingTime;
      const millisecsEllapsed = new Date().getTime() - state.get('createMediaStartTime');
      if (millisecsEllapsed < 3000) {
        // If there are less than 3 seconds ellapsed, we do not try to calculate
        // the time. We want some stability first...
        remainingTime = null;
      } else {
        const bytesPerSecond = action.currentBytes / millisecsEllapsed * 1000;
        const remainingBytes = (action.totalBytes - action.currentBytes);
        remainingTime = Math.ceil(remainingBytes / bytesPerSecond);
      }
      // Update state
      return state.set('createMediaProgress', progressPercentage)
        .set('createMediaRemainingTime', remainingTime);
    case actions.CREATE_MEDIA_SUCCESS:
      return state.set('createMediaStatus', 'completed');
    case actions.CREATE_MEDIA_ERROR:
      return state.set('createMediaStatus', 'failed');

    default:
      return state;
  }
};
