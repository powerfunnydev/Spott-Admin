import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { DropTarget } from 'react-dnd';
import { PRODUCT } from '../../../../constants/appearanceTypes';
import { MARKER } from '../../../../constants/itemTypes';
import { quickyStyle } from './styles';

const plusIcon = require('../../images/plus.svg');

const itemBackgroundPulse = Radium.keyframes({
  '0%': { backgroundColor: 'rgb(60, 60, 60)' },
  '70%': { backgroundColor: 'rgb(80, 80, 80)' },
  '100%': { backgroundColor: 'rgb(60, 60, 60)' }
}, 'itemBackgroundPulse');

// On the product drop zone we can drop a product marker.
const productTarget = {
  canDrop (props, monitor) {
    return monitor.getItemType() === MARKER && monitor.getItem().appearanceType === PRODUCT;
  },
  drop (props, monitor, component) {
    const itemType = monitor.getItemType();
    switch (itemType) {
      case MARKER: {
        const { appearanceId, appearanceType } = monitor.getItem();
        if (appearanceType === PRODUCT) {
          props.onDropProduct({ appearanceId, appearanceType });
        }
      }
    }
  }
};

@DropTarget([ MARKER ], productTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop()
}))
@Radium
export default class ProductDropZone extends Component {

  static propTypes = {
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDropProduct: PropTypes.func.isRequired
  };

  static styles = {
    container: {
      base: {
        animation: 'none',
        backgroundColor: 'none',
        backgroundImage: `url('${plusIcon}')`,
        backgroundSize: 'initial',
        border: '1px solid white',
        borderRadius: 2,
        cursor: 'auto'
      },
      canDrop: {
        animation: 'x 0.7s infinite',
        animationName: itemBackgroundPulse,
        cursor: 'copy'
      }
    }
  };

  render () {
    const { styles } = this.constructor;
    const { canDrop, connectDropTarget } = this.props;

    return (
      connectDropTarget(
        <div style={[ quickyStyle, styles.container.base, canDrop && styles.container.canDrop ]} />
      )
    );
  }

}
