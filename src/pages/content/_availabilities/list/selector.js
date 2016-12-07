import { createStructuredSelector } from 'reselect';
import { countriesSelector } from '../../../../selectors/global';
import {
  availabilitiesEntitiesSelector,
  createEntitiesByRelationSelector,
  mediumHasAvailabilitiesRelationsSelector
} from '../../../../selectors/data';

const currentMediumIdSelector = (state, props) => props.mediumId;

const availabilitiesSelector = createEntitiesByRelationSelector(
  mediumHasAvailabilitiesRelationsSelector,
  currentMediumIdSelector,
  availabilitiesEntitiesSelector
);
export default createStructuredSelector({
  availabilities: availabilitiesSelector,
  countries: countriesSelector
});
