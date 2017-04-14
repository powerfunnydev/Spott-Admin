import { createSelector, createStructuredSelector } from 'reselect';
import {
  agesEntitiesSelector, gendersEntitiesSelector, gendersListSelector, agesListSelector,
  createEntitiesByRelationSelector, createEntitiesByListSelector, brandDashboardEventsEntitiesSelector,
  filterHasTopMediaRelationsSelector, brandDashboardEventsListSelector,
  filterHasTopPeopleRelationsSelector, topMediaEntitiesSelector, topPeopleEntitiesSelector, languagesEntitiesSelector
} from '../../../selectors/data';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { serializeFilterHasTopMedia, serializeFilterHasTopPeople } from '../../../reducers/utils';
import { createQueryStringArraySelector } from '../../../selectors/global';
import { dateDataConfig } from './defaultHighchartsConfig';

// Used in actions
export const currentAgesSelector = createQueryStringArraySelector('ages');
export const currentGendersSelector = createQueryStringArraySelector('genders');
export const currentLanguagesSelector = createQueryStringArraySelector('languages');
export const currentBrandActivityEventsSelector = createQueryStringArraySelector('brandActivityEvents');

// Filters
// ///////

const gendersSelector = createEntitiesByListSelector(gendersListSelector, gendersEntitiesSelector);
const agesSelector = createEntitiesByListSelector(agesListSelector, agesEntitiesSelector);

export const filtersSelector = createStructuredSelector({
  ages: agesSelector,
  agesById: agesEntitiesSelector,
  genders: gendersSelector,
  gendersById: gendersEntitiesSelector,
  languagesById: languagesEntitiesSelector
});

// Brand Dashboard
// ///////////////

export const topMediaPrefix = 'topMedia';
export const topPeoplePrefix = 'topPeople';
export const topProductsPrefix = 'topProducts';

const topMediaFilterKeySelector = (state, props) => serializeFilterHasTopMedia({
  ...getInformationFromQuery(props.location.query, topMediaPrefix)
  // brandId: 'BRAND_ID_PLACEHOLDER'
});

const topPeopleFilterKeySelector = (state, props) => serializeFilterHasTopPeople({
  ...getInformationFromQuery(props.location.query, topPeoplePrefix)
  // brandId: 'BRAND_ID_PLACEHOLDER'
});

export const topMediaSelector = createEntitiesByRelationSelector(
  filterHasTopMediaRelationsSelector,
  topMediaFilterKeySelector,
  topMediaEntitiesSelector
);

export const topPeopleSelector = createEntitiesByRelationSelector(
  filterHasTopPeopleRelationsSelector,
  topPeopleFilterKeySelector,
  topPeopleEntitiesSelector
);

const keyMetricsSelector = (state) => state.getIn([ 'brandDashboard', 'keyMetrics' ]);
const dateDataSelector = (state) => state.getIn([ 'brandDashboard', 'dateData' ]);

const brandDashboardEventsSelector = createEntitiesByListSelector(brandDashboardEventsListSelector, brandDashboardEventsEntitiesSelector);

const dateDataConfigSelector = createSelector(
  currentBrandActivityEventsSelector,
  brandDashboardEventsEntitiesSelector,
  dateDataSelector,
  (_eventIds, eventsById, dateData) => {
    const series = [];
    // Filter unknown types.
    const eventIds = _eventIds.filter((eventId) => eventsById.get(eventId));
    const eventTypes = eventIds.map((eventId) => eventsById.getIn([ eventId, 'description' ])).join(', ');
    if (eventTypes) {
      for (const eventId of eventIds) {
        const d = (dateData.get(eventId) && dateData.get(eventId).toJS()) || [];
        // There should be data available, otherwise Highcharts will crash.
        if (d.length > 0) {
          series.push({
            data: d.map(({ timestamp, value }) => ([ new Date(timestamp).getTime(), value ])),
            name: eventsById.getIn([ eventId, 'description' ]),
            type: 'spline'
          });
        }
      }
    }

    return dateDataConfig
      .setIn([ 'tooltip', 'headerFormat' ], dateDataConfig.getIn([ 'tooltip', 'headerFormat' ]).replace('{eventType}', eventTypes))
      .set('series', series)
      .toJS();
  }
);

export default createStructuredSelector({
  dateDataConfig: dateDataConfigSelector,
  events: brandDashboardEventsSelector,
  eventsById: brandDashboardEventsEntitiesSelector,
  keyMetrics: keyMetricsSelector,
  topMedia: topMediaSelector,
  topPeople: topPeopleSelector
});
