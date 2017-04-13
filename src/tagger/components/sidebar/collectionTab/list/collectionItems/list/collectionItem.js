/* eslint-disable react/no-set-state */
/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { downloadFile } from '../../../../../../utils';
import { colors } from '../../../../../../../pages/_common/styles';
import Dropdown, { styles as dropdownStyles } from '../../../../../../../pages/_common/components/actionDropdown';
import DollarSVG from '../../../../../../../pages/_common/images/dollar';
import { COLLECTION_ITEM } from '../../../../../../constants/itemTypes';

const collectionItemSource = {
  // Here we construct an item, which contains the index of the item which is dragged
  // + the source collection id + the source collection item.
  beginDrag (props) {
    return {
      sourceIndex: props.index,
      sourceCollectionId: props.collectionId,
      // Used when dropping on a scene.
      sourceCollectionItem: props.collectionItem,
      sourceCollectionItemId: props.collectionItem.get('id')
    };
  },

  endDrag (props, monitor) {
    const dropResult = monitor.getDropResult();

    // Ignore if we are dropping on a scene. There is no targetCollectionId then.
    // Remove myself from my parent collection.
    if (dropResult && dropResult.targetCollectionId) {
      const { targetCollectionId } = dropResult;
      const { before, sourceCollectionId, sourceCollectionItemId, targetCollectionItemId } = monitor.getItem();

      // If we move an item in the same collection, just move it.
      if (sourceCollectionId === targetCollectionId) {
        // Persist the item move.
        props.persistMoveCollectionItem({
          before,
          sourceCollectionId,
          sourceCollectionItemId,
          targetCollectionItemId
        });
      } else {
        // Persist, move item to other collection.
        props.persistMoveCollectionItemToOtherCollection({
          sourceCollectionId,
          sourceCollectionItemId,
          targetCollectionId: dropResult.targetCollectionId
        });
      }
    }
  }
};

const collectionItemTarget = {
  hover (props, monitor, component) {
    const item = monitor.getItem();
    const { sourceCollectionId, sourceIndex: dragIndex } = item;
    const { collectionItem: hoverCollectionItem, index: hoverIndex } = props;

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
      // Locally, mutates state, not directly persisted to server!
      props.moveCollectionItem(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
      item.sourceIndex = hoverIndex;
      item.targetCollectionItemId = hoverCollectionItem.get('id');
    }
  }
};

@DropTarget(COLLECTION_ITEM, collectionItemTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(COLLECTION_ITEM, collectionItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
export default class CollectionItem extends Component {

  static propTypes = {
    collectionItem: ImmutablePropTypes.map.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    moveCollectionItem: PropTypes.func.isRequired,
    persistMoveCollectionItem: PropTypes.func.isRequired,
    persistMoveCollectionItemToOtherCollection: PropTypes.func.isRequired,
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
      collectionItem, connectDragSource, connectDropTarget, isDragging,
      onCollectionItemDelete, onCollectionItemEdit
    } = this.props;
    const productImageUrl = collectionItem.getIn([ 'product', 'logo', 'url' ]);

    const component =
      (<div ref={(c) => this._wrapper = c}>
        {isDragging
          ? <div style={[ styles.container, styles.dragging ]} />
          : (
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
            <span style={[ styles.relevance.base, styles.relevance[collectionItem.get('relevance')] ]} />
          </div>)}
        </div>);

    return connectDragSource(connectDropTarget(component));
  }
}
