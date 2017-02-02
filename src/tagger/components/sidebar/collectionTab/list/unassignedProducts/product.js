/* eslint-disable react/no-set-state */
/* eslint-disable no-return-assign */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push as routerPush } from 'react-router-redux';
import { downloadFile } from '../../../../../../utils';
import { colors } from '../../../../../../pages/_common/styles';
import Dropdown, { styles as dropdownStyles } from '../../../../../../pages/_common/components/actionDropdown';
import DollarSVG from '../../../../../../pages/_common/images/dollar';
import { UNASSIGNED_PRODUCT } from '../../../../../constants/itemTypes';

const productSource = {
  // Here we construct an item, which contains id of the unassigned product.
  beginDrag (props) {
    return {
      sourceProductId: props.product.get('id'),
      sourceProductRelevance: props.product.get('relevance')
    };
  },

  endDrag (props, monitor) {
    const { sourceProductId, sourceProductRelevance } = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult && dropResult.targetCollectionId) {
      console.warn('sourceProductId', sourceProductId, ' collectionId', dropResult.targetCollectionId);
      // Persist, move collection.
      props.onAddProductToCollection({
        collectionId: dropResult.targetCollectionId,
        productId: sourceProductId,
        relevance: sourceProductRelevance
      });
      // props.persistMoveCollection({
      //   before,
      //   sourceCollectionId,
      //   targetCollectionId
      // });
    }
  }
};

@DragSource(UNASSIGNED_PRODUCT, productSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@connect(null, (dispatch) => ({
  routerPush: bindActionCreators(routerPush, dispatch)
}))
@Radium
export default class Product extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    product: ImmutablePropTypes.map.isRequired,
    routerPush: PropTypes.func.isRequired,
    onAddProductToCollection: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = { hover: false };
  }

  static styles = {
    affiliate: {
      position: 'absolute',
      top: 8,
      left: 8
    },
    container: {
      backgroundColor: colors.white,
      height: 50,
      width: 50,
      marginRight: 8,
      marginBottom: 8,
      position: 'relative',
      borderRadius: 2
    },
    dragging: {
      backgroundColor: 'transparent',
      border: `dashed 1px ${colors.lightGray2}`
    },
    dropdown: {
      position: 'absolute',
      right: 8,
      top: 8
    },
    image: {
      height: 50,
      objectFit: 'scale-down',
      width: 50
    },
    relevance: {
      base: {
        height: 6,
        width: 6,
        borderRadius: '100%',
        position: 'absolute',
        bottom: 8,
        left: 8
      },
      EXACT: {
        backgroundColor: colors.lightGreen
      },
      MEDIUM: {
        backgroundColor: colors.lightGold
      },
      LOW: {
        backgroundColor: colors.red
      }
    }
  }

  render () {
    const styles = this.constructor.styles;
    const {
      connectDragSource, isDragging, product
    } = this.props;
    const productImageUrl = product.getIn([ 'logo', 'url' ]);

    const component =
      (<div ref={(c) => this._wrapper = c}>
        {isDragging
          ? <div style={[ styles.container, styles.dragging ]} />
          : (
            <div
              style={styles.container}
              title={product.get('shortName')}
              onMouseEnter={() => { this.setState({ hover: true }); }}
              onMouseLeave={() => { this.setState({ hover: false }); }}>
            {this.state.hover &&
              <Dropdown style={styles.dropdown}>
                {productImageUrl &&
                  <div key='downloadImage' style={dropdownStyles.floatOption} onClick={() => downloadFile(productImageUrl)}>Download</div>}
                {productImageUrl && <div style={dropdownStyles.line}/>}
                <div key='onEdit' style={dropdownStyles.floatOption} onClick={(e) => {
                  e.preventDefault();
                  this.props.routerPush(`/content/products/edit/${product.get('id')}`);
                }}>Edit</div>
              </Dropdown>}
            {product.get('affiliate') &&
              <DollarSVG style={styles.affiliate}/>}
            {productImageUrl &&
              <Link to={`/content/products/read/${product.get('id')}`}><img src={`${productImageUrl}?height=150&width=150`} style={styles.image} /></Link>}
            <span style={[ styles.relevance.base, styles.relevance[product.get('relevance')] ]} />
          </div>)}
        </div>);

    return connectDragSource(component);
  }
}
