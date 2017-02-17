import { createStructuredSelector } from 'reselect';
import {
  countriesEntitiesSelector,
  languagesEntitiesSelector
} from '../../../../selectors/data';

export default createStructuredSelector({
  countriesById: countriesEntitiesSelector,
  languagesById: languagesEntitiesSelector
});
