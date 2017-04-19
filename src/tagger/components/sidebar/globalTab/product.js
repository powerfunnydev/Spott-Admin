import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ContextMenuLayer } from 'react-contextmenu';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ItemStyleDecorator from '../_helpers/itemStyleDecorator';
import DefaultAppearanceBehavior from '../../_helpers/defaultAppearanceBehavior';
import { simpleCompare } from '../../_helpers/utils';

const threeLinesImage = require('../_helpers/images/threeLines.svg');

@ContextMenuLayer('sidebar-global-product', (props) => {
  return {
    appearanceId: props.appearanceId,
    onRemove: props.onRemove
  };
})

@Radium
@ItemStyleDecorator
export default class Product extends Component {

  static propTypes = {
    appearanceId: PropTypes.string.isRequired,
    brand: ImmutablePropTypes.map,
    hovered: PropTypes.bool.isRequired,
    product: ImmutablePropTypes.map,
    selected: PropTypes.bool.isRequired,
    style: PropTypes.object,
    onHover: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return simpleCompare([ 'appearanceId', 'brand', 'hovered', 'product', 'selected', 'style' ], this.props, nextProps);
  }

  render () {
    const styles = this.constructor.styles;
    const { brand, hovered, product, selected, onHover, onLeave, onSelect, onToggleSelect } = this.props;

    // Render the product if we have enough information to render it.
    if (product && product.get('shortName') && product.get('imageUrl')) {
      const brandName = (brand && brand.get('name')) || '';
      const title = brandName ? `${brandName} - ${product.get('shortName')}` : product.get('shortName');
      return (
        <li>
          <DefaultAppearanceBehavior
            style={[ styles.wrapper.base, hovered && styles.wrapper.hovered, selected && styles.wrapper.selected ]}
            onHover={onHover}
            onLeave={onLeave}
            onSelect={onSelect}
            onToggleSelect={onToggleSelect}>
            <div style={[ styles.image, { backgroundImage: `url('${product.get('imageUrl')}?width=96&height=96')` } ]}>&nbsp;</div>
            <div style={styles.text} title={title}>
              {brandName}&nbsp;
              <span style={styles.textRegular}>{product.get('shortName')}</span>
            </div>
            <div style={styles.threeLines}><img src={threeLinesImage} /></div>
          </DefaultAppearanceBehavior>
        </li>
      );
    }

    // Render placeholder product in case the product is not yet successfully fetched.
    return (
      <li>
        <div style={[ styles.wrapper.base, hovered && styles.wrapper.hovered, selected && styles.wrapper.selected ]}
          onHover={onHover} onLeave={onLeave} onSelect={onSelect} onToggleSelect={onToggleSelect}>
          <div style={styles.image}>&nbsp;</div>
          <div style={styles.text}>&nbsp;</div>
          <div style={styles.threeLines}><img src={threeLinesImage} /></div>
        </div>
      </li>
    );
  }

}
