import { createSelector, createStructuredSelector } from 'reselect';
import { formValueSelector } from 'redux-form/immutable';
import {
  createEntityIdsByRelationSelector,
  createEntitiesByListSelector,
  eventsEntitiesSelector,
  eventsListSelector,
  searchStringHasMediaRelationsSelector,
  mediaEntitiesSelector,
  gendersListSelector,
  gendersEntitiesSelector,
  agesListSelector,
  agesEntitiesSelector
} from '../../selectors/data';
import { ageConfig, timelineConfig } from './defaultHighchartsConfig';

export const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);
export const ageDataSelector = (state) => state.getIn([ 'reporting', 'ageData' ]);
export const genderDataSelector = (state) => state.getIn([ 'reporting', 'genderData' ]);
export const timelineDataSelector = (state) => state.getIn([ 'reporting', 'timelineData' ]);

export const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);

const eventsSelector = createEntitiesByListSelector(eventsListSelector, eventsEntitiesSelector);
const gendersSelector = createEntitiesByListSelector(gendersListSelector, gendersEntitiesSelector);
const agesSelector = createEntitiesByListSelector(agesListSelector, agesEntitiesSelector);

// Header
// //////

export const mediaFilterSelector = createStructuredSelector({
  mediaById: mediaEntitiesSelector,
  searchedMediumIds: searchedMediumIdsSelector
});

// Activity tab
// ////////////

export const eventsFilterSelector = createStructuredSelector({
  events: eventsSelector,
  eventsById: eventsEntitiesSelector
});

const reportingMediaFilterSelector = formValueSelector('reportingMediaFilter');
const reportingActivityFilterSelector = formValueSelector('reportingActivityFilter');

function mediumIdsSelector (state) {
  return reportingMediaFilterSelector(state, 'media') || [];
}

function eventIdSelector (state) {
  return reportingActivityFilterSelector(state, 'event');
}

const eventSelector = createSelector(
  eventsEntitiesSelector,
  eventIdSelector,
  (eventsById, eventId) => eventsById.get(eventId)
);

const timelineConfigSelector = createSelector(
  eventSelector,
  mediaEntitiesSelector,
  mediumIdsSelector,
  timelineDataSelector,
  (event, mediaById, mediumIds, timelineData) => {
    const series = [];
    let eventType = '';
    if (event) {
      eventType = event.get('description');
      for (const mediumId of mediumIds) {
        const d = timelineData.get(mediumId) || [];
        // There should be data available, otherwise Highcharts will crash.
        if (d.length > 0) {
          series.push({
            data: d.map(({ timestamp, value }) => ([ new Date(timestamp).getTime(), value ])),
            name: mediaById.getIn([ mediumId, 'title' ])
          });
        }
      }
    }

    return timelineConfig
      .setIn([ 'tooltip', 'headerFormat' ], timelineConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventType))
      .set('series', series)
      .toJS();
  }
);

const ageConfigSelector = createSelector(
  eventSelector,
  mediaEntitiesSelector,
  mediumIdsSelector,
  ageDataSelector,
  (event, mediaById, mediumIds, ageData) => {
    const series = [];
    let eventType = '';
    if (event) {
      eventType = event.get('description');
      for (const mediumId of mediumIds) {
        const d = ageData.get(mediumId) || [];
        // There should be data available, otherwise Highcharts will crash.
        if (d.length > 0) {
          series.push({
            data: d.map(({ value }) => value),
            name: mediaById.getIn([ mediumId, 'title' ])
          });
        }
      }
    }

    return ageConfig
      .setIn([ 'tooltip', 'headerFormat' ], ageConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventType))
      .set('series', series)
      .toJS();
  }
);

export const activitySelector = createStructuredSelector({
  ageConfig: ageConfigSelector,
  genderConfig: ageConfigSelector,
  mediaById: mediaEntitiesSelector,
  mediumIds: mediumIdsSelector,
  timelineConfig: timelineConfigSelector
});

// Rankings tab
// ////////////

export const rankingsFilterSelector = createStructuredSelector({
  ages: agesSelector,
  agesById: agesEntitiesSelector,
  genders: gendersSelector,
  gendersById: gendersEntitiesSelector
});
