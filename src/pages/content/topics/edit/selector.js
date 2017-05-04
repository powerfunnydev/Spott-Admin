import { createStructuredSelector } from 'reselect';
import {
  topicsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

const formName = 'topicEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const currentTopicIdSelector = (state, props) => { return props.params.topicId; };
const currentTopicSelector = createEntityByIdSelector(topicsEntitiesSelector, currentTopicIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'topics', 'edit', 'popUpMessage' ]);

export default createStructuredSelector({
  currentTopic: currentTopicSelector,
  errors: formErrorsSelector,
  popUpMessage: popUpMessageSelector
});
