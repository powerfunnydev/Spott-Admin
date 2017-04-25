import { createSelector, createStructuredSelector } from 'reselect';
import {
  agesEntitiesSelector, gendersEntitiesSelector, gendersListSelector, agesListSelector,
  createEntitiesByRelationSelector, createEntitiesByListSelector, brandDashboardEventsEntitiesSelector,
  filterHasTopMediaRelationsSelector, brandDashboardEventsListSelector,
  filterHasTopPeopleRelationsSelector, filterHasTopProductsRelationsSelector, topProductsEntitiesSelector,
  topMediaEntitiesSelector, topPeopleEntitiesSelector, languagesEntitiesSelector
} from '../../../selectors/data';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { serializeFilterHasTopMedia, serializeFilterHasTopPeople, serializeFilterHasTopProducts } from '../../../reducers/utils';
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

const topProductsFilterKeySelector = (state, props) => serializeFilterHasTopProducts({
  ...getInformationFromQuery(props.location.query, topProductsPrefix)
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

export const topProductsSelector = createEntitiesByRelationSelector(
  filterHasTopProductsRelationsSelector,
  topProductsFilterKeySelector,
  topProductsEntitiesSelector
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
    const colors = [];

    if (eventTypes && dateData.get('eventData') && dateData.get('userData')) {
      // Add the lines for each of the event types.
      for (const eventId of eventIds) {
        const eventData = dateData.getIn([ 'eventData', eventId ]);
        const d = (eventData && eventData.toJS()) || [];
        // There should be data available, otherwise Highcharts will crash.
        if (d.length > 0) {
          colors.push(eventsById.getIn([ eventId, 'color' ]));
          series.push({
            data: d.map(({ timestamp, value }) => ([ new Date(timestamp).getTime(), value ])),
            name: eventsById.getIn([ eventId, 'description' ]),
            type: 'spline',
            zIndex: 2
          });
        }
      }

      // Add columns for the user count.
      const d = dateData.get('userData').toJS();
      // Add user column color.
      colors.push('#eaeced');
      series.push({
        data: d.map(({ timestamp, value }) => ([ new Date(timestamp).getTime(), value ])),
        name: 'Users',
        type: 'column',
        yAxis: 1,
        zIndex: 1
      });
    }

    return dateDataConfig
      .set('colors', colors)
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
  topPeople: topPeopleSelector,
  topProducts: topProductsSelector
});
