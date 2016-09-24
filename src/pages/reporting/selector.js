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
import { ageConfig, genderConfig, timelineConfig } from './defaultHighchartsConfig';

export const ageDataSelector = (state) => state.getIn([ 'reporting', 'ageData' ]);
export const brandSubscriptionsSelector = (state) => state.getIn([ 'reporting', 'brandSubscriptions' ]);
export const characterSubscriptionsSelector = (state) => state.getIn([ 'reporting', 'characterSubscriptions' ]);
export const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);
export const genderDataSelector = (state) => state.getIn([ 'reporting', 'genderData' ]);
export const mediumSubscriptionsSelector = (state) => state.getIn([ 'reporting', 'mediumSubscriptions' ]);
export const productViewsSelector = (state) => state.getIn([ 'reporting', 'productViews' ]);
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
    let d;
    if (event) {
      eventType = event.get('description');
      for (const mediumId of mediumIds) {
        d = ageData.get(mediumId) || [];
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
  mediaEntitiesSelector,
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
        const d = genderData.get(mediumId) || [];

        if (d.length === 3) {
          const unknown = d[0].value;
          const male = d[1].value;
          const female = d[2].value;
          const total = unknown + male + female;
          // Unknown = 50% male and 50% female.
          series[0].data.push(100 * (male + (unknown / 2)) / total);
          series[1].data.push(100 * (female + (unknown / 2)) / total);
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

export const rankingsSelector = createStructuredSelector({
  brandSubscriptions: brandSubscriptionsSelector,
  characterSubscriptions: characterSubscriptionsSelector,
  mediumSubscriptions: mediumSubscriptionsSelector,
  productViews: productViewsSelector
});
