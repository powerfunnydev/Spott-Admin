import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';

@DragLayer((monitor) => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialClientOffset(),
  differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component {
  static propTypes = {
    differenceFromInitialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired
    // item: PropTypes.object,
    // itemType: PropTypes.string
  };

  getStyle () {
    const { differenceFromInitialOffset, initialOffset } = this.props;
    if (!differenceFromInitialOffset) {
      return {
        display: 'none'
      };
    }

    const { x, y } = differenceFromInitialOffset;
    const transform = `translate(${x}px, ${y}px)`;

    return {
      ...this.constructor.styles.marker,
      top: initialOffset.y,
      left: initialOffset.x,
      zIndex: 100,
      transform,
      WebkitTransform: transform
    };
  }

  static styles = {
    layer: {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    },
    marker: {
      background: 'rgba(255,255,255,.15)',
      border: '2px solid rgba(255,255,255,.7)',
      borderRadius: '50%',
      cursor: 'move',
      height: 36,
      marginLeft: -18,
      marginTop: -18,
      pointerEvents: 'none', // We do not want to drop on the draglayer itself...
      position: 'fixed',
      width: 36
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { isDragging } = this.props;

    if (!isDragging) {
      return null;
    }

    return (
      <div style={styles.layer}>
        <div style={this.getStyle()} />
      </div>
    );
  }
}
