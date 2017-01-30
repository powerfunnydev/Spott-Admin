/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { colors, fontWeights, makeTextStyle } from '../../../../../pages/_common/styles';
import Spinner from '../../../../../pages/_common/components/spinner';
import CollectionItems from './collectionItems/list';
import EditButton from '../../../../../pages/_common/components/buttons/editButton';
import RemoveButton from '../../../../../pages/_common/components/buttons/removeButton';
import { COLLECTION_ITEM } from '../../../../constants/itemTypes';

import MaximizeSVG from '../../../../../pages/_common/images/maximize';
import MinimizeSVG from '../../../../../pages/_common/images/minimize';

const hamburgerImage = require('../../../../../pages/_common/images/hamburger.svg');
const linkImage = require('../../../../../pages/_common/images/link.svg');

const collectionTarget = {
  drop (props) {
    // Return the drop result, which will be used in the endDrag to
    // remove it from the source collection if the collection has changed.
    return {
      targetCollectionId: props.collection.get('id')
    };
  },
  hover (props, monitor, component) {
    const itemType = monitor.getItemType();

    // If we hover a collection, update the state.
    if (itemType === 'COLLECTION') {
      const item = monitor.getItem();
      const { sourceCollectionId, sourceIndex: dragIndex } = item;
      const { collection: hoverCollection, index: hoverIndex } = props;

      // Don't replace items with themselves.
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on the screen.
      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

      // Get verticale middle of the item.
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position on the screen.
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top of the item.
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height.
      // When dragging downwards, only move when the cursor is below 50%.
      // When dragging upwards, only move when the cursor is above 50%.

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        item.before = false;
        return;
      }

      // Dragging upwards.
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        item.before = true;
        return;
      }

      // Time to actually perform the action.
      if (hoverCollection !== sourceCollectionId) {
        // Locally, mutates state, not directly persisted to server!
        console.warn('MOVE COLLECTION', dragIndex, hoverIndex);
        props.moveCollection(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.sourceIndex = hoverIndex;
        item.targetCollectionId = hoverCollection.get('id');
      }
    }
  }
};

const collectionSource = {
  // Here we construct an item, which contains the index of the collection which is dragged
  beginDrag (props) {
    return {
      sourceIndex: props.index,
      sourceCollectionId: props.collectionId
    };
  },

  endDrag (props, monitor) {
    const { before, sourceCollectionId, targetCollectionId } = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult && targetCollectionId && targetCollectionId !== sourceCollectionId) {
      // Persist, move collection.
      props.persistMoveCollection({
        before,
        sourceCollectionId,
        targetCollectionId
      });
    }
  }
};

@DropTarget([ 'COLLECTION', COLLECTION_ITEM ], collectionTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@DragSource('COLLECTION', collectionSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
export default class Collection extends Component {

  static propTypes = {
    collection: ImmutablePropTypes.map.isRequired,
    collectionId: PropTypes.string.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    contentStyle: PropTypes.object,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    isOver: PropTypes.bool.isRequired,
    // Move in state.
    moveCollection: PropTypes.func.isRequired,
    persistMoveCollection: PropTypes.func.isRequired,
    persistMoveCollectionItem: PropTypes.func.isRequired,
    persistMoveCollectionItemToOtherCollection: PropTypes.func.isRequired,
    style: PropTypes.object,
    onCollectionDelete: PropTypes.func.isRequired,
    onCollectionEdit: PropTypes.func.isRequired,
    onCollectionItemCreate: PropTypes.func.isRequired,
    onCollectionItemDelete: PropTypes.func.isRequired,
    onCollectionItemEdit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.renderTitle = ::this.renderTitle;
    this.moveCollectionItem = ::this.moveCollectionItem;
    this.onMinimizeClick = ::this.onMinimizeClick;
    this.onMaximizeClick = ::this.onMaximizeClick;
    this.state = {
      collectionItems: props.collection.get('collectionItems'),
      open: false
    };
  }

  componentWillReceiveProps (newProps) {
    if (this.props.collection.get('collectionItems') !== newProps.collection.get('collectionItems') && newProps.collection.getIn([ 'collectionItems', '_status' ]) === 'loaded') {
      this.setState({
        ...this.state,
        collectionItems: newProps.collection.get('collectionItems')
      });
    }
  }

  // Locally mutate the state, move a collection item in the same collection.
  moveCollectionItem (dragIndex, hoverIndex) {
    const { collectionItems } = this.state;
    const collectionItemsData = collectionItems.get('data');
    const dragCollectionItem = collectionItemsData.get(dragIndex);

    // Remove and add (= move) collection item.
    const newData = collectionItemsData
      .remove(dragIndex)
      .splice(hoverIndex, 0, dragCollectionItem);

    this.setState({
      ...this.state,
      collectionItems: collectionItems.set('data', newData)
    });
  }

  onMinimizeClick (e) {
    e.preventDefault();
    this.setState({ ...this.state, open: false });
  }

  onMaximizeClick (e) {
    e.preventDefault();
    this.setState({ ...this.state, open: true });
  }

  static styles = {
    container: {
      base: {
        backgroundColor: colors.black20,
        borderRadius: 2,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'transparent'
      },
      isOver: {
        borderColor: colors.lightGray2
      },
      open: {
        backgroundColor: colors.black4
      }
    },
    content: {
      base: {
        paddingTop: '1em',
        paddingBottom: '0.5em',
        paddingLeft: '1em',
        paddingRight: '1em'
      },
      isOver: {
        opacity: 0.5
      }
    },
    header: {
      base: {
        backgroundColor: colors.black20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '2em',
        paddingLeft: '1em',
        paddingRight: '1em'
      },
      open: {
        backgroundColor: colors.black4
      }
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: colors.warmGray,
      marginRight: '0.625em'
    },
    headerContainer: {
      alignItems: 'center',
      display: 'flex'
    },
    wrapper: {
      width: '100%',
      marginTop: 2
    },
    roundImage: {
      borderRadius: '100%',
      height: 15,
      width: 15,
      objectFit: 'scale-down',
      marginRight: '0.625em'
    },
    marginRight: {
      marginRight: '0.625em'
    },
    linkContainer: {
      alignItems: 'center',
      display: 'flex',
      marginRight: '0.625em'
    },
    link: {
      display: 'flex'
    },
    badge: {
      base: {
        ...makeTextStyle(fontWeights.bold, '0.688em'),
        textAlign: 'center',
        height: '1.6em',
        lineHeight: '1.6em',
        paddingLeft: '0.6em',
        paddingRight: '0.6em',
        borderRadius: '0.125em'
      },
      count: {
        backgroundColor: colors.black5,
        color: colors.warmGray
      },
      none: {
        backgroundColor: colors.red,
        color: '#fff'
      }
    }
  };

  renderTitle () {
    const styles = this.constructor.styles;
    const { collection } = this.props;
    const count = collection.getIn([ 'collectionItems', 'data' ]).size;

    return [
      <img key='hamburger' src={hamburgerImage} style={styles.marginRight} />,
      <h2 key='title' style={styles.title}>{collection.get('title')}</h2>,
      collection.get('brand') &&
        <span key='brand' style={styles.linkContainer}>
          <img key='link' src={linkImage} style={styles.marginRight} />
          {collection.getIn([ 'brand', 'logo' ]) &&
            <Link style={styles.link} to={`/content/brands/read/${collection.getIn([ 'brand', 'id' ])}`}>
              <img src={`${collection.getIn([ 'brand', 'logo', 'url' ])}?height=70&width=70`} style={styles.roundImage} />
            </Link>}
        </span>,
      collection.get('character') &&
        <span key='character' style={styles.linkContainer}>
          <img key='link' src={linkImage} style={styles.marginRight} />
          {collection.getIn([ 'character', 'portraitImage' ]) &&
            <Link style={styles.link} to={`/content/characters/read/${collection.getIn([ 'character', 'id' ])}`}>
              <img src={`${collection.getIn([ 'character', 'portraitImage', 'url' ])}?height=70&width=70`} style={styles.roundImage} />
            </Link>}
        </span>,
      <div key='count' style={[ styles.badge.base, count > 0 ? styles.badge.count : styles.badge.none ]}>{count}</div>
    ];
  }

  render () {
    const styles = this.constructor.styles;
    const { open } = this.state;
    const {
      collection, connectDragSource, connectDropTarget, contentStyle, isDragging, isLoading, isOver, style, onCollectionItemCreate,
      onCollectionItemDelete, onCollectionItemEdit, onCollectionDelete, onCollectionEdit,
      moveCollection, persistMoveCollection, persistMoveCollectionItem, persistMoveCollectionItemToOtherCollection
    } = this.props;

    return (
      connectDragSource(connectDropTarget(
        <div style={[ styles.wrapper, style, isDragging && { opacity: 0.5 } ]}>
          <div style={[ styles.container.base, open && styles.container.open, isOver && styles.container.isOver ]}>
            <div style={[ styles.header.base, open && styles.header.open ]}>
              <div style={styles.headerContainer}>
                {this.renderTitle()}&nbsp;&nbsp;&nbsp;{isLoading && <Spinner size='small' />}
              </div>
              <div style={styles.headerContainer}>
                <EditButton style={styles.marginRight} onClick={onCollectionEdit} />
                <RemoveButton cross style={styles.marginRight} onClick={onCollectionDelete}/>
                {this.state.open
                  ? <button title='Minimize' onClick={this.onMinimizeClick}>
                      <MinimizeSVG color={colors.warmGray} hoverColor={colors.white}/>
                    </button>
                  : <button title='Maximize' onClick={this.onMaximizeClick}>
                      <MaximizeSVG color={colors.warmGray} hoverColor={colors.white}/>
                    </button>}
              </div>
            </div>
            {this.state.open &&
              <div style={[ styles.content.base, contentStyle, isOver && styles.content.isOver ]}>
                <CollectionItems
                  collectionId={collection.get('id')}
                  collectionItems={this.state.collectionItems}
                  moveCollection={moveCollection}
                  moveCollectionItem={this.moveCollectionItem}
                  persistMoveCollection={persistMoveCollection}
                  persistMoveCollectionItem={persistMoveCollectionItem}
                  persistMoveCollectionItemToOtherCollection={persistMoveCollectionItemToOtherCollection}
                  onCollectionItemCreate={onCollectionItemCreate}
                  onCollectionItemDelete={onCollectionItemDelete}
                  onCollectionItemEdit={onCollectionItemEdit}/>
              </div>}
          </div>
        </div>
      )
    ));
  }
}
