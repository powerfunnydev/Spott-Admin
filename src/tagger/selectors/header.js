import { createSelector } from 'reselect';
import { currentMediumIdSelector, mediaEntitiesSelector } from './common';
import { activeTabSelector } from './global';

/**
 * Extracts the current episode from the state tree.
 * This is, the episode in data.entities.media[app.currentMediumId].
 */
export const currentMediumSelector = createSelector(
  activeTabSelector,
  currentMediumIdSelector,
  mediaEntitiesSelector,
  (activeTab, mediumId, mediaById) => ({
    activeTab,
    currentMedium: mediumId && mediaById.get(mediumId)
  })
);
