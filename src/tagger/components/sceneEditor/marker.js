import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';
import DefaultAppearanceBehavior from '../_helpers/defaultAppearanceBehavior';
import { ContextMenuLayer } from 'react-contextmenu';
import { MARKER } from '../../constants/itemTypes';

const markerSource = {
  beginDrag ({ appearanceId, appearanceType, pos }, monitor, component) {
    const { offsetLeft: left, offsetTop: top } = ReactDOM.findDOMNode(component._wrapper);
    return { appearanceId, appearanceType, left, top };
  },
  // When moving the marker on the Scene, we calculate the difference with the initial offset,
  // received from the 'drop' function of Scene component.
  endDrag ({ appearanceId, appearanceType, relativeLeft, relativeTop, onMove }, monitor) {
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

const markerBackgroundPulse = Radium.keyframes({
  '0%': { backgroundColor: 'rgba(255,255,255,.25)' },
  '70%': { backgroundColor: 'rgba(255,255,255,.40)' },
  '100%': { backgroundColor: 'rgba(255,255,255,.25)' }
}, 'markerBackgroundPulse');

export class MarkerContainer extends Component {

  static propTypes = {
    appearanceId: PropTypes.string.isRequired,
    appearanceType: PropTypes.string.isRequired,
    // Call this function inside render() to let React DnD handle the drag events.
    connectDragSource: PropTypes.func.isRequired,
    // Hidden markers are shown as dashed lines
    hidden: PropTypes.bool,
    hovered: PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired,
    // Procentual location of the marker
    relativeLeft: PropTypes.number.isRequired,
    relativeTop: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  getStyle () {
    const styles = this.constructor.styles;
    const { hovered, hidden, isDragging, relativeLeft, relativeTop, selected } = this.props;

    return [
      styles.me.base,
      hidden && styles.me.hidden,
      hovered && styles.me.hovered,
      selected && styles.me.selected,
      // IE fallback: hide the real node using CSS when dragging
      // because IE will ignore our custom "empty image" drag preview.
      isDragging ? { opacity: 0, height: 0 } : { opacity: 1 },
      {
        left: `${relativeLeft}%`,
        top: `${relativeTop}%`
      }
    ];
  }

  static styles = {
    me: {
      base: {
        background: 'rgba(255,255,255,.15)',
        border: '2px solid rgba(255,255,255,.7)',
        borderRadius: '50%',
        cursor: 'move',
        height: 36,
        marginLeft: -18,
        marginTop: -18,
        opacity: 0.7,
        position: 'absolute',
        width: 36,
        pointerEvents: 'all'
      },
      hidden: {
        border: '2px dashed #fff'
      },
      hovered: {
        animation: 'x 0.7s infinite',
        animationName: markerBackgroundPulse
      },
      selected: {
        // Override hovered animation
        animation: 'none',
        // Set background color
        background: 'rgba(255,255,255,.50)'
      }
    },
    dot: {
      border: '2px solid rgba(255,255,255,.7)',
      borderRadius: '50%',
      height: 4,
      marginLeft: 14,
      marginTop: 14,
      position: 'absolute',
      width: 4
    }
  };

  render () {
    const { styles } = this.constructor;
    const { appearanceId, connectDragSource, onSelect, onToggleSelect, onHover, onLeave } = this.props;
    // TODO: remove span, add div
    return connectDragSource(
      <div>
        <DefaultAppearanceBehavior
          appearanceId={appearanceId}
          ref={(c) => { this._wrapper = c; }}
          style={this.getStyle()}
          onHover={onHover}
          onLeave={onLeave}
          onSelect={onSelect}
          onToggleSelect={onToggleSelect}>
          <div style={styles.dot} />
        </DefaultAppearanceBehavior>
      </div>
    );
  }

}

export default ContextMenuLayer('sceneEditor-marker', (props) => {
  return {
    onCopy: props.onCopy,
    onEdit: props.onEdit,
    onRemove: props.onRemove
  };
})(DragSource(MARKER, markerSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Radium(MarkerContainer)));
