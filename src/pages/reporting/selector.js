import { createSelector, createStructuredSelector } from 'reselect';
import { Map } from 'immutable';
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
import { locationSelector } from '../../selectors/global';
import { ageConfig, genderConfig, timelineConfig } from './defaultHighchartsConfig';
import { LAZY, isLoading } from '../../constants/statusTypes';

export const ageDataSelector = (state) => state.getIn([ 'reporting', 'ageData' ]);
export const genderDataSelector = (state) => state.getIn([ 'reporting', 'genderData' ]);
export const timelineDataSelector = (state) => state.getIn([ 'reporting', 'timelineData' ]);

export const filterQuerySelector = (state) => state.getIn([ 'reporting', 'filterQuery' ]);

function createInfiniteListSelector (dataSelector) {
  return createSelector(
    dataSelector,
    (pageHasData) => {
      let i = 0;
      let result = [];
      let status = LAZY;
      while (true) {
        const data = pageHasData.get(i++);
        if (data) {
          if (data.get('data')) {
            result = result.concat(data.get('data'));
          }
          if (data.get('_status')) {
            status = data.get('_status');
          }
        } else {
          break;
        }
      }
      return Map({ _status: status, data: result });
    }
  );
}

export const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);

export const brandSubscriptionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'brandSubscriptions' ]));
export const characterSubscriptionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'characterSubscriptions' ]));
export const mediumSubscriptionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'mediumSubscriptions' ]));
export const mediumSyncsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'mediumSyncs' ]));
export const productViewsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'productViews' ]));
export const productImpressionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'productImpressions' ]));

export const currentBrandSubscriptionsPageSelector = (state) => state.getIn([ 'reporting', 'currentBrandSubscriptionsPage' ]);
export const currentCharacterSubscriptionsPageSelector = (state) => state.getIn([ 'reporting', 'currentCharacterSubscriptionsPage' ]);
export const currentMediumSubscriptionsPageSelector = (state) => state.getIn([ 'reporting', 'currentMediumSubscriptionsPage' ]);
export const currentMediumSyncsPageSelector = (state) => state.getIn([ 'reporting', 'currentMediumSyncsPage' ]);
export const currentProductImpressionsPageSelector = (state) => state.getIn([ 'reporting', 'currentProductImpressionsPage' ]);
export const currentProductViewsPageSelector = (state) => state.getIn([ 'reporting', 'currentProductViewsPage' ]);

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

function createQueryStringArraySelector (field) {
  return createSelector(
    locationSelector,
    ({ query }) => typeof query[field] === 'string' ? [ query[field] ] : (query[field] || [])
  );
}

export const currentAgesSelector = createQueryStringArraySelector('ages');
export const currentGendersSelector = createQueryStringArraySelector('genders');
export const currentMediaSelector = createQueryStringArraySelector('media');

export const rankingsFilterSelector = createStructuredSelector({
  ages: agesSelector,
  agesById: agesEntitiesSelector,
  genders: gendersSelector,
  gendersById: gendersEntitiesSelector
});

export const rankingsSelector = createStructuredSelector({
  brandSubscriptions: brandSubscriptionsSelector,
  currentBrandSubscriptionsPage: currentBrandSubscriptionsPageSelector,
  currentCharacterSubscriptionsPage: currentCharacterSubscriptionsPageSelector,
  currentMediumSubscriptionsPage: currentMediumSubscriptionsPageSelector,
  currentMediumSyncsPage: currentMediumSyncsPageSelector,
  currentProductImpressionsPage: currentProductImpressionsPageSelector,
  currentProductViewsPage: currentProductViewsPageSelector,
  characterSubscriptions: characterSubscriptionsSelector,
  mediumSubscriptions: mediumSubscriptionsSelector,
  mediumSyncs: mediumSyncsSelector,
  productImpressions: productImpressionsSelector,
  productViews: productViewsSelector
});
