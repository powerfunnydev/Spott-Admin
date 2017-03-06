import { createSelector, createStructuredSelector } from 'reselect';
import {
  createEntitiesByListSelector,
  eventsEntitiesSelector,
  eventsListSelector,
  listMediaEntitiesSelector,
  gendersEntitiesSelector
} from '../../../selectors/data';
import { isLoading } from '../../../constants/statusTypes';
import { locationSelector } from '../../../selectors/global';
import { ageConfig, genderConfig, timelineConfig } from './defaultHighchartsConfig';

function createQueryStringArraySelector (field) {
  return createSelector(
    locationSelector,
    ({ query }) => typeof query[field] === 'string' ? [ query[field] ] : (query[field] || [])
  );
}

const ageDataSelector = (state) => state.getIn([ 'reporting', 'ageData' ]);
const genderDataSelector = (state) => state.getIn([ 'reporting', 'genderData' ]);
const timelineDataSelector = (state) => state.getIn([ 'reporting', 'timelineData' ]);

const eventsSelector = createEntitiesByListSelector(eventsListSelector, eventsEntitiesSelector);

// Activity tab
// ////////////

export const currentEventsSelector = createQueryStringArraySelector('events');
export const currentMediaSelector = createQueryStringArraySelector('media');

export const eventsFilterSelector = createStructuredSelector({
  events: eventsSelector,
  eventsById: eventsEntitiesSelector
});

const _eventsSelector = createSelector(
  eventsEntitiesSelector,
  currentEventsSelector,
  (eventsById, eventIds) => eventIds.map((eventId) => eventsById.get(eventId)).filter((event) => event)
);

const timelineConfigSelector = createSelector(
  _eventsSelector,
  listMediaEntitiesSelector,
  currentMediaSelector,
  timelineDataSelector,
  (events, mediaById, mediumIds, timelineData) => {
    const series = [];
    const eventTypes = events.map((event) => event.get('description')).join(', ');
    if (eventTypes) {
      for (const mediumId of mediumIds) {
        const d = timelineData.getIn([ mediumId, 'data' ]) || [];
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
      .setIn([ 'tooltip', 'headerFormat' ], timelineConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventTypes))
      .set('series', series)
      .toJS();
  }
);

function isLoadingReducer (mediumIds, data) {
  // If one of the mediumI
  for (const mediumId of mediumIds) {
    const loading = isLoading(data.get(mediumId));
    if (loading) {
      return true;
    }
  }
  return false;
}

const isLoadingTimelineSelector = createSelector(currentMediaSelector, timelineDataSelector, isLoadingReducer);
const isLoadingAgeSelector = createSelector(currentMediaSelector, ageDataSelector, isLoadingReducer);
const isLoadingGenderSelector = createSelector(currentMediaSelector, genderDataSelector, isLoadingReducer);

const ageConfigSelector = createSelector(
  _eventsSelector,
  listMediaEntitiesSelector,
  currentMediaSelector,
  ageDataSelector,
  (events, mediaById, mediumIds, ageData) => {
    const series = [];
    const eventTypes = events.map((event) => event.get('description')).join(', ');
    let d;
    if (eventTypes) {
      for (const mediumId of mediumIds) {
        d = ageData.getIn([ mediumId, 'data' ]) || [];
        // There should be data available, otherwise Highcharts will crash.
        if (d.length > 0) {
          const total = d.reduce((t, { value }) => t + value, 0);
          series.push({
            data: d.map(({ value }) => 100 * value / total),
            name: mediaById.getIn([ mediumId, 'title' ])
          });
        }
      }
    }

    return ageConfig
      .setIn([ 'xAxis', 'categories' ], (d && d.map(({ label }) => label)) || [])
      .setIn([ 'tooltip', 'headerFormat' ], ageConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventTypes))
      .set('series', series)
      .toJS();
  }
);

const genderConfigSelector = createSelector(
  _eventsSelector,
  listMediaEntitiesSelector,
  currentMediaSelector,
  genderDataSelector,
  gendersEntitiesSelector,
  (events, mediaById, mediumIds, genderData, gendersById) => {
    let series = [ { name: 'Male', data: [] }, { name: 'Female', data: [] } ];
    const eventTypes = events.map((event) => event.get('description')).join(', ');

    if (eventTypes) {
      series[0].name = gendersById.getIn([ 'MALE', 'description' ]);
      series[1].name = gendersById.getIn([ 'FEMALE', 'description' ]);

      // Aggregate data, there are three series, one for each gender.
      // We skip unknown gender for now.
      for (const mediumId of mediumIds) {
        const d = genderData.getIn([ mediumId, 'data' ]) || [];

        if (d.length === 3) {
          const male = d[1].value;
          const female = d[2].value;
          const total = male + female;
          // Unknown gender is ignored.
          series[0].data.push(100 * male / total);
          series[1].data.push(100 * female / total);
        }
      }
    }

    // If there is no data, don't show the legend.
    if (series[0].data.length === 0) {
      series = [];
    }

    return genderConfig
      // x-axis = categories = media names.
      .setIn([ 'xAxis', 'categories' ], mediumIds.map((mediumId) => mediaById.getIn([ mediumId, 'title' ])))
      .setIn([ 'tooltip', 'headerFormat' ], genderConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventTypes))
      .set('series', series)
      .toJS();
  }
);

export const activitySelector = createStructuredSelector({
  ageConfig: ageConfigSelector,
  genderConfig: genderConfigSelector,
  isLoadingAge: isLoadingAgeSelector,
  isLoadingGender: isLoadingGenderSelector,
  isLoadingTimeline: isLoadingTimelineSelector,
  mediaById: listMediaEntitiesSelector,
  mediumIds: currentMediaSelector,
  timelineConfig: timelineConfigSelector
});
