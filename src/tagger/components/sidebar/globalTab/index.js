import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import tabStyle from '../tabStyle';
import ProductSearch from './search';
import PureRender from '../../_helpers/pureRenderDecorator';
import globalTab from '../../../selectors/globalTab';
import * as appearanceActions from '../../../actions/appearance';
import * as sidebarActions from '../../../actions/sidebar';
import Product from './product';
import colors from '../../colors';

@connect(globalTab, {
  hoverAppearance: appearanceActions.hover,
  leaveAppearance: appearanceActions.leave,
  removeAppearance: sidebarActions.deleteGlobalProduct,
  searchProducts: sidebarActions.searchGlobalProducts,
  selectAppearance: appearanceActions.select,
  toggleSelectAppearance: appearanceActions.toggleSelect,
  loadGlobalProducts: sidebarActions.loadGlobalProducts,
  onSubmit: sidebarActions.createGlobalProduct
})
@Radium
@PureRender
export default class GlobalTab extends Component {

  static propTypes = {
    hoverAppearance: PropTypes.func.isRequired,
    hoveredAppearance: PropTypes.string,
    leaveAppearance: PropTypes.func.isRequired,
    loadGlobalProducts: PropTypes.func.isRequired,
    productSearchResult: ImmutablePropTypes.map.isRequired,
    // The list of global product appearances.
    productTuples: ImmutablePropTypes.list.isRequired,
    products: ImmutablePropTypes.map.isRequired,
    removeAppearance: PropTypes.func.isRequired,
    searchProducts: PropTypes.func.isRequired,
    selectAppearance: PropTypes.func.isRequired,
    selectedAppearance: PropTypes.string,
    style: PropTypes.object,
    toggleSelectAppearance: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onProductSelect = ::this.onProductSelect;
  }

  componentWillMount () {
    this.props.loadGlobalProducts();
  }

  onProductSelect (product) {
    if (product) {
      this.props.onSubmit({
        productId: product.get('id'),
        relevance: 'EXACT'
      });
    }
  }

  static styles = {
    description: {
      base: {
        backgroundColor: colors.black2,
        color: colors.warmGray,
        fontSize: '13px',
        fontStyle: 'italic',
        padding: '13px 20px'
      },
      emph: {
        textDecoration: 'underline'
      }
    },
    searchBox: {
      padding: '13px 20px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { hoverAppearance, hoveredAppearance, leaveAppearance, productSearchResult, productTuples, removeAppearance, searchProducts, selectAppearance, selectedAppearance, toggleSelectAppearance } = this.props;

    return (
      <div role='tabpanel' style={this.props.style}>
        <div style={tabStyle.title}>
          Pinned products <span style={tabStyle.count}>{productTuples.size}</span>
        </div>

        <div style={styles.description.base}>
          These products will be visible on <span style={styles.description.emph}>every</span> frame before any other product is shown.
        </div>

        <form noValidate style={styles.searchBox}>
          <ProductSearch
            options={productSearchResult.get('data').toArray()}
            search={searchProducts}
            onOptionSelected={this.onProductSelect} />
        </form>

        <ul style={tabStyle.list}>
          {productTuples.map((productTuple, index) => {
            const appearanceId = productTuple.getIn([ 'videoProduct', 'appearanceId' ]);
            return (
              <Product
                appearanceId={appearanceId}
                brand={productTuple.get('brand')}
                hovered={hoveredAppearance === appearanceId}
                key={index}
                product={productTuple.get('product')}
                selected={selectedAppearance === appearanceId}
                videoProduct={productTuple.get('videoProduct')}
                onHover={hoverAppearance.bind(this, appearanceId)}
                onLeave={leaveAppearance}
                onRemove={removeAppearance}
                onSelect={selectAppearance.bind(this, appearanceId)}
                onToggleSelect={toggleSelectAppearance.bind(this, appearanceId)} />
            );
          })}
        </ul>
      </div>
    );
  }

}
