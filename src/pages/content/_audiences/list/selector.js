import { createStructuredSelector } from 'reselect';
import {
  audiencesEntitiesSelector,
  mediumHasAudiencesRelationsSelector,
  createEntitiesByRelationSelector
} from '../../../../selectors/data';

const currentMediumIdSelector = (state, props) => props.mediumId;

const audiencesSelector = createEntitiesByRelationSelector(
  mediumHasAudiencesRelationsSelector,
  currentMediumIdSelector,
  audiencesEntitiesSelector
);
export default createStructuredSelector({
  audiences: audiencesSelector
});
