import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ContextMenuLayer } from 'react-contextmenu';
import { quickyStyle } from './styles';
import { PRODUCT_QUICKY } from '../../../../../constants/itemTypes';
import colors from '../../../colors';

const productQuickySource = {
  beginDrag ({ quicky }) {
    // This object is the product appearance template and will be accessible by
    // the scene component in the DragTarget via monitor.getItem().
    return {
      characterId: quicky.get('characterId'),
      markerHidden: quicky.get('markerHidden'),
      productId: quicky.get('productId'),
      relevance: quicky.get('relevance')
    };
  }
};

@ContextMenuLayer('quickiesBar-quicky', (props) => {
  return {
    onRemove: props.onRemove
  };
})
@DragSource(PRODUCT_QUICKY, productQuickySource, (connector, monitor) => ({
  connectDragSource: connector.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
export default class ProductQuicky extends Component {

  static propTypes = {
    character: ImmutablePropTypes.map,
    // Call this function inside render() to let React DnD handle the drag events.
    connectDragSource: PropTypes.func.isRequired,
    product: ImmutablePropTypes.map,
    quicky: ImmutablePropTypes.map.isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  shouldComponentUpdate (newProps) {
    const { character, product, quicky, selected } = this.props;
    return character !== newProps.character || product !== newProps.product || quicky !== newProps.quicky || selected !== newProps.selected;
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick();
  }

  static styles = {
    base: {
      borderRadius: 2
    },
    selected: {
      boxShadow: `0px 0px 0px 2px ${colors.vividOrange}`
    }
  };

  render () {
    const { styles } = this.constructor;
    const { connectDragSource, product, selected } = this.props;

    return (
      connectDragSource(
        <div
          style={[
            quickyStyle,
            styles.base,
            selected && styles.selected,
            product && product.get('imageUrl') && { backgroundImage: `url('${product.get('imageUrl')}?width=70&height=70')` }
          ]}
          title={product && product.get('shortName')}
          onClick={this.onClick}>
        </div>
      )
    );
  }

}
