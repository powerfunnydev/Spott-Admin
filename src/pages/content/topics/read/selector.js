import { createStructuredSelector } from 'reselect';
import {
  topicsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentTopicIdSelector = (state, props) => { return props.params.topicId; };

export const currentTopicSelector = createEntityByIdSelector(topicsEntitiesSelector, currentTopicIdSelector);

export default createStructuredSelector({
  currentTopic: currentTopicSelector
});
