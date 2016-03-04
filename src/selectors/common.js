export const createMediaJobNameSelector = (state) => state.getIn([ 'media', 'createMediaJobName' ]);
export const createMediaProgressSelector = (state) => state.getIn([ 'media', 'createMediaProgress' ]);
export const createMediaRemainingTimeSelector = (state) => state.getIn([ 'media', 'createMediaRemainingTime' ]);
export const createMediaStatusSelector = (state) => state.getIn([ 'media', 'createMediaStatus' ]);
export const currentCreateMediaMediaTypeSelector = (state) => state.getIn([ 'media', 'currentCreateMediaMediaType' ]);
export const currentCreateMediaTabSelector = (state) => state.getIn([ 'media', 'currentCreateMediaTab' ]);
