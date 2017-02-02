/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CreateCollectionItem from './createCollectionItem';
import CollectionItem from './collectionItem';

export default class CollectionItems extends Component {

  static propTypes = {
    collectionId: PropTypes.string.isRequired,
    collectionItems: ImmutablePropTypes.map.isRequired,
    moveCollectionItem: PropTypes.func.isRequired,
    persistMoveCollectionItem: PropTypes.func.isRequired,
    persistMoveCollectionItemToOtherCollection: PropTypes.func.isRequired,
    onCollectionItemCreate: PropTypes.func.isRequired,
    onCollectionItemDelete: PropTypes.func.isRequired,
    onCollectionItemEdit: PropTypes.func.isRequired
  }

  static styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  }

  render () {
    const styles = this.constructor.styles;
    const {
      collectionId, collectionItems, moveCollectionItem, persistMoveCollectionItemToOtherCollection,
      persistMoveCollectionItem, onCollectionItemCreate, onCollectionItemDelete, onCollectionItemEdit
    } = this.props;
    return (
      <div style={styles.container}>
        {collectionItems.get('data').map((item, i) => (
          <CollectionItem
            collectionId={collectionId}
            collectionItem={item}
            index={i}
            key={item.get('id')}
            moveCollectionItem={moveCollectionItem}
            persistMoveCollectionItem={persistMoveCollectionItem}
            persistMoveCollectionItemToOtherCollection={persistMoveCollectionItemToOtherCollection}
            onCollectionItemDelete={onCollectionItemDelete.bind(this, item.get('id'))}
            onCollectionItemEdit={onCollectionItemEdit.bind(this, item.get('id'))}/>)
        )}
        <CreateCollectionItem onCollectionItemCreate={onCollectionItemCreate}/>
      </div>
    );
  }
}
