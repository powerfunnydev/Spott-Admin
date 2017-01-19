import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import CreateCollectionItem from './createCollectionItem';
import { colors } from '../../../../../_common/styles';
import DollarSVG from '../../../../../_common/images/dollar';

@Radium
class CollectionItem extends Component {

  static propTypes = {
    collectionItem: ImmutablePropTypes.map.isRequired
  }

  static styles = {
    container: {
      height: 80,
      width: 80,
      marginRight: 8,
      marginBottom: 8,
      position: 'relative'
    },
    image: {
      height: 80,
      objectFit: 'scale-down',
      width: 80
    },
    affiliate: {
      position: 'absolute',
      top: 8,
      left: 8
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
    const { collectionItem } = this.props;
    return (
      <div style={styles.container} title={collectionItem.getIn([ 'product', 'shortName' ])}>
        {collectionItem.getIn([ 'product', 'affiliate' ]) &&
          <DollarSVG style={styles.affiliate}/>}
        {collectionItem.getIn([ 'product', 'logo' ]) &&
          <Link to={`/content/products/read/${collectionItem.getIn([ 'product', 'id' ])}`}><img src={`${collectionItem.getIn([ 'product', 'logo', 'url' ])}?height=150&width=150`} style={styles.image} /></Link>}
        <span style={[ styles.relevance.base, styles.relevance[collectionItem.get('relevance')] ]}/>
      </div>
    );
  }
}

export default class CollectionItems extends Component {

  static propTypes = {
    collectionItems: ImmutablePropTypes.map.isRequired,
    onCollectionItemCreate: PropTypes.func.isRequired
  }

  static styles = {
    container: {
      display: 'flex'
    }
  }

  render () {
    const styles = this.constructor.styles;
    const { collectionItems, onCollectionItemCreate } = this.props;
    return (
      <div style={styles.container}>
        {collectionItems.get('data').map((item) => <CollectionItem collectionItem={item} key={item.get('id')}/>)}
        <CreateCollectionItem onCollectionItemCreate={onCollectionItemCreate} />
      </div>
    );
  }
}
