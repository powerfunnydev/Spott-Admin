import { createSelector, createStructuredSelector } from 'reselect';
import {
  createEntityIdsByRelationSelector,
  createEntitiesByListSelector,
  eventsEntitiesSelector,
  eventsListSelector,
  searchStringHasMediaRelationsSelector,
  listMediaEntitiesSelector,
  gendersListSelector,
  gendersEntitiesSelector,
  agesListSelector,
  agesEntitiesSelector
} from '../../selectors/data';
import { ageConfig, genderConfig, timelineConfig } from './defaultHighchartsConfig';
import { isLoading } from '../../constants/statusTypes';

export const ageDataSelector = (state) => state.getIn([ 'reporting', 'ageData' ]);
export const brandSubscriptionsSelector = (state) => state.getIn([ 'reporting', 'brandSubscriptions' ]);
export const characterSubscriptionsSelector = (state) => state.getIn([ 'reporting', 'characterSubscriptions' ]);
export const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);
export const genderDataSelector = (state) => state.getIn([ 'reporting', 'genderData' ]);
export const mediumSubscriptionsSelector = (state) => state.getIn([ 'reporting', 'mediumSubscriptions' ]);
export const mediumSyncsSelector = (state) => state.getIn([ 'reporting', 'mediumSyncs' ]);
export const productViewsSelector = (state) => state.getIn([ 'reporting', 'productViews' ]);
export const timelineDataSelector = (state) => state.getIn([ 'reporting', 'timelineData' ]);

export const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);

const eventsSelector = createEntitiesByListSelector(eventsListSelector, eventsEntitiesSelector);
const gendersSelector = createEntitiesByListSelector(gendersListSelector, gendersEntitiesSelector);
const agesSelector = createEntitiesByListSelector(agesListSelector, agesEntitiesSelector);

// Header
// //////

export const mediaFilterSelector = createStructuredSelector({
  mediaById: listMediaEntitiesSelector,
  searchedMediumIds: searchedMediumIdsSelector
});

// Activity tab
// ////////////

export const eventsFilterSelector = createStructuredSelector({
  events: eventsSelector,
  eventsById: eventsEntitiesSelector
});

function mediumIdsSelector (state, props) {
  const query = props.location && props.location.query;
  return typeof query.media === 'string' ? [ query.media ] : (query.media || []);
}

function eventIdSelector (state, props) {
  const query = props.location && props.location.query;
  return query.event || '';
}

const eventSelector = createSelector(
  eventsEntitiesSelector,
  eventIdSelector,
  (eventsById, eventId) => eventsById.get(eventId)
);

const timelineConfigSelector = createSelector(
  eventSelector,
  listMediaEntitiesSelector,
  mediumIdsSelector,
  timelineDataSelector,
  (event, mediaById, mediumIds, timelineData) => {
    const series = [];
    let eventType = '';
    if (event) {
      eventType = event.get('description');
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
      .setIn([ 'tooltip', 'headerFormat' ], timelineConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventType))
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

const isLoadingTimelineSelector = createSelector(mediumIdsSelector, timelineDataSelector, isLoadingReducer);
const isLoadingAgeSelector = createSelector(mediumIdsSelector, ageDataSelector, isLoadingReducer);
const isLoadingGenderSelector = createSelector(mediumIdsSelector, genderDataSelector, isLoadingReducer);

const ageConfigSelector = createSelector(
  eventSelector,
  listMediaEntitiesSelector,
  mediumIdsSelector,
  ageDataSelector,
  (event, mediaById, mediumIds, ageData) => {
    const series = [];
    let eventType = '';
    let d;
    if (event) {
      eventType = event.get('description');
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
      .setIn([ 'tooltip', 'headerFormat' ], ageConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventType))
      .set('series', series)
      .toJS();
  }
);

const genderConfigSelector = createSelector(
  eventSelector,
  listMediaEntitiesSelector,
  mediumIdsSelector,
  genderDataSelector,
  gendersEntitiesSelector,
  (event, mediaById, mediumIds, genderData, gendersById) => {
    let series = [ { name: 'Male', data: [] }, { name: 'Female', data: [] } ];
    let eventType = '';

    if (event) {
      eventType = event.get('description');
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
      .setIn([ 'tooltip', 'headerFormat' ], genderConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventType))
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

export const rankingsSelector = createStructuredSelector({
  brandSubscriptions: brandSubscriptionsSelector,
  characterSubscriptions: characterSubscriptionsSelector,
  mediumSubscriptions: mediumSubscriptionsSelector,
  mediumSyncs: mediumSyncsSelector,
  productViews: productViewsSelector
});
