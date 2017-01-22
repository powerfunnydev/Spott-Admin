import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import CreateCollectionItem from './createCollectionItem';
import { downloadFile } from '../../../../../../utils';
import { colors } from '../../../../../_common/styles';
import Dropdown, { styles as dropdownStyles } from '../../../../../_common/components/actionDropdown';
import DollarSVG from '../../../../../_common/images/dollar';

const collectionItemSource = {
  beginDrag (props) {
    console.warn('collectionItemSource beginDrag', {
      index: props.index,
      collectionId: props.collectionId,
      collectionItem: props.collectionItem
    });
    return {
      index: props.index,
      collectionId: props.collectionId,
      collectionItem: props.collectionItem
    };
  },

  endDrag (props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    console.warn('collectionItemSource endDrag', item);

    // Remove myself from my parent collection.
    if (dropResult && dropResult.collectionId !== item.collectionId) {
      props.removeCollectionItem(item.index);
    }
  }
};

const collectionItemTarget = {
  hover (props, monitor, component) {
    const item = monitor.getItem();
    const dragIndex = item.index;
    const { collectionItem: hoverCollectionItem, index: hoverIndex } = props;
    const sourceCollectionId = monitor.getItem().collectionId;

		// Don't replace items with themselves.
    if (dragIndex === hoverIndex) {
      return;
    }

		// Determine rectangle on the screen.
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get horizontal middle of the item.
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

		// Determine mouse position on the screen.
    const clientOffset = monitor.getClientOffset();

		// Get pixels to the left of the item.
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

		// Only perform the move when the mouse has crossed half of the items width.
		// When dragging rightwards, only move when the cursor is below 50%.
		// When dragging leftwards, only move when the cursor is above 50%.

		// Dragging rightwards
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      item.before = false;
      return;
    }

		// Dragging leftwards.
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      item.before = true;
      return;
    }

		// Time to actually perform the action.
    if (props.collectionId === sourceCollectionId) {
      props.moveCollectionItem(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
      item.index = hoverIndex;
      item.targetCollectionItem = hoverCollectionItem;
    }
  }
};

@DropTarget('COLLECTION_ITEM', collectionItemTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('COLLECTION_ITEM', collectionItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
class CollectionItem extends Component {

  static propTypes = {
    collectionItem: ImmutablePropTypes.map.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
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
      position: 'relative',
      borderRadius: 2
    },
    dragging: {
      border: `dashed 1px ${colors.lightGray2}`
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
    const {
      collectionItem, connectDragSource, connectDropTarget, isDragging,
      onCollectionItemDelete, onCollectionItemEdit
    } = this.props;
    const productImageUrl = collectionItem.getIn([ 'product', 'logo', 'url' ]);

    const component = isDragging
      ? <div style={[ styles.container, styles.dragging ]} />
      : (<div
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
    </div>);

    return connectDragSource(connectDropTarget(component));
  }
}

export default class CollectionItems extends Component {

  static propTypes = {
    collectionId: PropTypes.string.isRequired,
    collectionItems: ImmutablePropTypes.map.isRequired,
    moveCollectionItem: PropTypes.func.isRequired,
    removeCollectionItem: PropTypes.func.isRequired,
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
      collectionId, collectionItems, moveCollectionItem, removeCollectionItem,
      onCollectionItemCreate, onCollectionItemDelete, onCollectionItemEdit
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
            removeCollectionItem={removeCollectionItem}
            onCollectionItemDelete={onCollectionItemDelete.bind(this, item.get('id'))}
            onCollectionItemEdit={onCollectionItemEdit.bind(this, item.get('id'))}/>)
        )}
        <CreateCollectionItem onCollectionItemCreate={onCollectionItemCreate}/>
      </div>
    );
  }
}
