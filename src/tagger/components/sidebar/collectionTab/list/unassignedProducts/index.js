/* eslint-disable react/no-set-state */
// False positive on the arguments of an async function.
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { colors } from '../../../../../../pages/_common/styles';
import tabStyle from '../../../tabStyle';
import * as actions from '../actions';
import selector from './selector';
import Product from './product';

@connect(selector, (dispatch) => ({
  loadCollectionItems: bindActionCreators(actions.fetchCollectionItems, dispatch),
  loadUnassignedProducts: bindActionCreators(actions.loadUnassignedProducts, dispatch),
  persistCollectionItem: bindActionCreators(actions.persistCollectionItem, dispatch)
}))
@Radium
export default class UnassignedProducts extends Component {

  static propTypes = {
    loadUnassignedProducts: PropTypes.func.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistCollectionItem: PropTypes.func.isRequired,
    unassignedProducts: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.onAddProductToCollection = ::this.onAddProductToCollection;
  }

  componentDidMount () {
    const { loadUnassignedProducts, mediumId } = this.props;
    loadUnassignedProducts({ mediumId });
  }

  async onAddProductToCollection ({ collectionId, productId, relevance }) {
    const { loadCollectionItems, loadUnassignedProducts, mediumId, persistCollectionItem } = this.props;
    await persistCollectionItem({ collectionId, productId, relevance });
    await loadCollectionItems({ collectionId });
    await loadUnassignedProducts({ mediumId });
  }

  static styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    editButton: {
      marginRight: '0.75em'
    },
    image: {
      width: '2em',
      height: '2em',
      objectFit: 'scale-down'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '0px',
      minHeight: '30px'
    },
    paddingLeft: {
      paddingLeft: '11px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    floatRight: {
      marginLeft: 'auto'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    },
    section: {
      backgroundColor: colors.black1,
      border: `solid 2px ${colors.black1}`,
      borderRadius: 2,
      marginBottom: 20
    },
    sectionContent: {
      paddingBottom: '1em',
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingTop: '1em'
    },
    description: {
      color: colors.warmGray,
      fontSize: '0.75em',
      lineHeight: 1.25,
      marginTop: 4,
      marginBottom: 20
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { unassignedProducts } = this.props;
    return (
      <div style={styles.section}>
        <div style={styles.sectionContent}>
          <h3 style={[ tabStyle.title, { padding: 0 } ]}>Unassigned products</h3>
          <div style={styles.description}>
            Tagged products that aren’t part of a collection yet
          </div>
          <div style={styles.container}>
            {unassignedProducts.get('data').map((product) => (
              <Product key={product.get('id')} product={product} onAddProductToCollection={this.onAddProductToCollection}/>)
            )}
          </div>
        </div>
      </div>
    );
  }
}
