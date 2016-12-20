import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CharacterQuicky from './characterQuicky';
import ProductQuicky from './productQuicky';
import ProductDropZone from './productDropZone';
import { CHARACTER_QUICKY, PRODUCT_QUICKY } from '../../../../constants/itemTypes';
import ScrollableDiv from '../../../_helpers/scrollableDiv';

@Radium
export default class ListOfQuickies extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.map.isRequired,
    products: ImmutablePropTypes.map.isRequired,
    quickies: ImmutablePropTypes.list.isRequired,
    selectedProductId: PropTypes.string,
    style: PropTypes.object,
    onDeleteCharacterQuicky: PropTypes.func.isRequired,
    onDeleteProductQuicky: PropTypes.func.isRequired,
     // Optional. Dropzone is rendered when present
    onDropProduct: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func
    ]),
    onSelectProduct: PropTypes.func.isRequired
  };

  static styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '14px 10px 14px 10px'
    }
  };

  render () {
    const { styles } = this.constructor;
    const {
      characters, products, quickies, selectedProductId, style, onDeleteCharacterQuicky,
      onDeleteProductQuicky, onDropProduct, onSelectProduct
    } = this.props;

    return (
      <ScrollableDiv style={[ styles.container, style ]}>
        {quickies.map((quicky, i) => {
          switch (quicky.get('type')) {
            case CHARACTER_QUICKY:
              return (
                <CharacterQuicky
                  character={characters.get(quicky.get('characterId'))}
                  key={i}
                  quicky={quicky}
                  onRemove={onDeleteCharacterQuicky.bind(null, i)} />
              );
            case PRODUCT_QUICKY:
              const productId = quicky.get('productId');
              return (
                <ProductQuicky
                  character={characters.get(quicky.get('characterId'))}
                  key={i}
                  product={products.get(productId)}
                  quicky={quicky}
                  selected={productId === selectedProductId}
                  onClick={onSelectProduct.bind(null, productId)}
                  onRemove={onDeleteProductQuicky.bind(null, i)} />
              );
          }
        })}
        {onDropProduct &&
          <ProductDropZone
            onDropProduct={this.props.onDropProduct} />}
      </ScrollableDiv>
    );
  }

}
