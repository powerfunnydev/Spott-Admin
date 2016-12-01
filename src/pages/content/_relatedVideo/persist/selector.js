import { createStructuredSelector } from 'reselect';
import { countriesSelector } from '../../../../selectors/global';

export const videoHasProgressSelector = (state) => state.getIn([ '_relatedVideo', 'videoHasProgress' ]);

export default createStructuredSelector({
  countries: countriesSelector
});
