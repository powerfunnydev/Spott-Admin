import { createSelector, createStructuredSelector } from 'reselect';
import { Map } from 'immutable';
import {
  createEntitiesByListSelector,
  gendersListSelector,
  gendersEntitiesSelector,
  agesListSelector,
  agesEntitiesSelector
} from '../../../selectors/data';
import { createQueryStringArraySelector } from '../../../selectors/global';
import { LAZY } from '../../../constants/statusTypes';

// Used in actions
export const currentAgesSelector = createQueryStringArraySelector('ages');
export const currentEventsSelector = createQueryStringArraySelector('events');
export const currentGendersSelector = createQueryStringArraySelector('genders');
export const currentMediaSelector = createQueryStringArraySelector('media');

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

const brandSubscriptionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'brandSubscriptions' ]));
const characterSubscriptionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'characterSubscriptions' ]));
const mediumSubscriptionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'mediumSubscriptions' ]));
const mediumSyncsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'mediumSyncs' ]));
const productBuysSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'productBuys' ]));
const productViewsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'productViews' ]));
const productImpressionsSelector = createInfiniteListSelector((state) => state.getIn([ 'reporting', 'productImpressions' ]));

const currentBrandSubscriptionsPageSelector = (state) => state.getIn([ 'reporting', 'currentBrandSubscriptionsPage' ]);
const currentCharacterSubscriptionsPageSelector = (state) => state.getIn([ 'reporting', 'currentCharacterSubscriptionsPage' ]);
const currentMediumSubscriptionsPageSelector = (state) => state.getIn([ 'reporting', 'currentMediumSubscriptionsPage' ]);
const currentMediumSyncsPageSelector = (state) => state.getIn([ 'reporting', 'currentMediumSyncsPage' ]);
const currentProductBuysPageSelector = (state) => state.getIn([ 'reporting', 'currentProductBuysPage' ]);
const currentProductImpressionsPageSelector = (state) => state.getIn([ 'reporting', 'currentProductImpressionsPage' ]);
const currentProductViewsPageSelector = (state) => state.getIn([ 'reporting', 'currentProductViewsPage' ]);

const gendersSelector = createEntitiesByListSelector(gendersListSelector, gendersEntitiesSelector);
const agesSelector = createEntitiesByListSelector(agesListSelector, agesEntitiesSelector);

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
  currentBrandSubscriptionsPage: currentBrandSubscriptionsPageSelector,
  currentCharacterSubscriptionsPage: currentCharacterSubscriptionsPageSelector,
  currentMediumSubscriptionsPage: currentMediumSubscriptionsPageSelector,
  currentMediumSyncsPage: currentMediumSyncsPageSelector,
  currentProductBuysPage: currentProductBuysPageSelector,
  currentProductImpressionsPage: currentProductImpressionsPageSelector,
  currentProductViewsPage: currentProductViewsPageSelector,
  characterSubscriptions: characterSubscriptionsSelector,
  mediumSubscriptions: mediumSubscriptionsSelector,
  mediumSyncs: mediumSyncsSelector,
  productBuys: productBuysSelector,
  productImpressions: productImpressionsSelector,
  productViews: productViewsSelector
});
