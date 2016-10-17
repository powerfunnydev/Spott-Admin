import { createStructuredSelector } from 'reselect';

export const contentProducersSelector = (state) => state.getIn([ 'content', 'contentProducers', 'contentProducers' ]);
export const isSelectedSelector = (state) => state.getIn([ 'content', 'contentProducers', 'isSelected' ]);
export const sortDirectionsSelector = (state) => state.getIn([ 'content', 'contentProducers', 'sortDirections' ]);
export const sortFieldSelector = (state, sortField) => state.getIn([ 'content', 'contentProducers', 'sortDirections', sortField ]);

export default createStructuredSelector({
  contentProducers: contentProducersSelector,
  isSelected: isSelectedSelector,
  sortDirections: sortDirectionsSelector
});
