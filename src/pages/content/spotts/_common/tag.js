import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { ContextMenuLayer } from 'react-contextmenu';
import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';
import { MarkerContainer } from '../../../../tagger/components/sceneEditor/marker';

const tagSource = {
  beginDrag ({ appearanceId, appearanceType }, monitor, component) {
    console.warn('Begin drag');
    const { offsetLeft: left, offsetTop: top } = ReactDOM.findDOMNode(component._wrapper);
    return { appearanceId, appearanceType, left, top };
  },
  // When moving the marker on the Scene, we calculate the difference with the initial offset,
  // received from the 'drop' function of Scene component.
  endDrag ({ appearanceId, appearanceType, relativeLeft, relativeTop, onMove }, monitor) {
    console.warn('END DRAG');
    const dropResult = monitor.getDropResult();
    // Check if we dropped on a Scene, otherwise ignore.
    // dropResult is the difference from initial offset in percentiles.
    if (dropResult && typeof dropResult.x === 'number' && typeof dropResult.y === 'number') {
      // Ignore the momevement of the marker, if it's outside the Scene.
      const x = relativeLeft + dropResult.x;
      const y = relativeTop + dropResult.y;
      if (0 <= x && x <= 100 && 0 <= y && y <= 100) {
        onMove({ x, y });
      }
    }
    // Return the appearanceId and appearanceType, to add appearances to the quickiesbar.
    return { appearanceId, appearanceType };
  }
};

// appearanceId: PropTypes.string.isRequired,
// appearanceType: PropTypes.string.isRequired,
// // Hidden markers are shown as dashed lines
// hidden: PropTypes.bool,
// hovered: PropTypes.bool.isRequired,
// point: ImmutablePropTypes.map,
// region: ImmutablePropTypes.map,
// selected: PropTypes.bool.isRequired,
// onCopy: PropTypes.func.isRequired,
// onEdit: PropTypes.func.isRequired,
// onHover: PropTypes.func.isRequired,
// onLeave: PropTypes.func.isRequired,
// onMove: PropTypes.func.isRequired,
// onRemove: PropTypes.func.isRequired,
// onSelect: PropTypes.func.isRequired,
// onToggleSelect: PropTypes.func.isRequired
export default ContextMenuLayer('TEST', (props) => {
  return {
    onEdit: props.onEdit,
    onRemove: props.onRemove
  };
})(DragSource('TAG', tagSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Radium(MarkerContainer)));
