import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import CreateCollectionItem from './createCollectionItem';
import { downloadFile } from '../../../../../../utils';
import { colors } from '../../../../../_common/styles';
import Dropdown, { styles as dropdownStyles } from '../../../../../_common/components/actionDropdown';
import DollarSVG from '../../../../../_common/images/dollar';

@Radium
class CollectionItem extends Component {

  static propTypes = {
    collectionItem: ImmutablePropTypes.map.isRequired,
    onCollectionItemDelete: PropTypes.func.isRequired,
    onCollectionItemEdit: PropTypes.func.isRequired
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
      height: 80,
      width: 80,
      marginRight: 8,
      marginBottom: 8,
      position: 'relative'
    },
    dropdown: {
      position: 'absolute',
      right: 8,
      top: 8
    },
    image: {
      height: 80,
      objectFit: 'scale-down',
      width: 80
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
    const { collectionItem, onCollectionItemDelete, onCollectionItemEdit } = this.props;
    const productImageUrl = collectionItem.getIn([ 'product', 'logo', 'url' ]);
    return (
      <div
        style={styles.container}
        title={collectionItem.getIn([ 'product', 'shortName' ])}
        onMouseEnter={() => { this.setState({ hover: true }); }}
        onMouseLeave={() => { this.setState({ hover: false }); }}>
        {this.state.hover &&
          <Dropdown style={styles.dropdown}>
            {productImageUrl &&
              <div key='downloadImage' style={dropdownStyles.floatOption} onClick={() => downloadFile(productImageUrl)}>Download</div>}
            {productImageUrl && <div style={dropdownStyles.line}/>}
            <div key='onEdit' style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); onCollectionItemEdit(); }}>Edit</div>
            <div style={dropdownStyles.line}/>
            <div key='onDelete' style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); onCollectionItemDelete(); }}>Remove</div>
          </Dropdown>}
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
    onCollectionItemCreate: PropTypes.func.isRequired,
    onCollectionItemDelete: PropTypes.func.isRequired,
    onCollectionItemEdit: PropTypes.func.isRequired
  }

  static styles = {
    container: {
      display: 'flex'
    }
  }

  render () {
    const styles = this.constructor.styles;
    const { collectionItems, onCollectionItemCreate, onCollectionItemDelete, onCollectionItemEdit } = this.props;
    return (
      <div style={styles.container}>
        {collectionItems.get('data').map((item) => (
          <CollectionItem
            collectionItem={item}
            key={item.get('id')}
            onCollectionItemDelete={onCollectionItemDelete.bind(this, item.get('id'))}
            onCollectionItemEdit={onCollectionItemEdit.bind(this, item.get('id'))}/>)
        )}
        <CreateCollectionItem onCollectionItemCreate={onCollectionItemCreate}/>
      </div>
    );
  }
}
