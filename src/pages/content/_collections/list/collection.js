/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { DropTarget } from 'react-dnd';
import { colors, fontWeights, makeTextStyle } from '../../../_common/styles';
import Spinner from '../../../_common/components/spinner';
import CollectionItems from './collectionItems/list';
import EditButton from '../../../_common/components/buttons/editButton';
import RemoveButton from '../../../_common/components/buttons/removeButton';

const hamburgerImage = require('../../../_common/images/hamburger.svg');
const linkImage = require('../../../_common/images/link.svg');
const minimizeImage = require('../../../_common/images/minimize.svg');
const maximizeImage = require('../../../_common/images/maximize.svg');

const cardTarget = {
  drop (props, monitor, component) {
    const collection = props.collection;
    const collectionId = collection.get('id');
    const sourceItem = monitor.getItem();

    console.warn('Drop in collection', sourceItem);

    // If the collection is different, push it on the new collection.
    if (collectionId !== sourceItem.collectionId) {
      component.pushCollectionItem(sourceItem.collectionItem);
    } else {
      props.onCollectionItemMove(sourceItem);
    }
    // Return the drop result, which will be used in the endDrag to
    // remove it from the source collection if the collection has changed.
    return {
      collectionId
    };
  }
};

@DropTarget('COLLECTION_ITEM', cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
@Radium
export default class Collection extends Component {

  static propTypes = {
    collection: ImmutablePropTypes.map.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    contentStyle: PropTypes.object,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    onCollectionDelete: PropTypes.func.isRequired,
    onCollectionEdit: PropTypes.func.isRequired,
    onCollectionItemCreate: PropTypes.func.isRequired,
    onCollectionItemDelete: PropTypes.func.isRequired,
    onCollectionItemEdit: PropTypes.func.isRequired,
    onCollectionItemMove: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.renderTitle = ::this.renderTitle;
    this.pushCollectionItem = ::this.pushCollectionItem;
    this.removeCollectionItem = ::this.removeCollectionItem;
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

  pushCollectionItem (collectionItem) {
    const newData = this.state.collectionItems.get('data').push(collectionItem);
    this.setState({
      ...this.state,
      collectionItems: this.state.collectionItems.set('data', newData)
    });
  }

  removeCollectionItem (index) {
    const newData = this.state.collectionItems.get('data').remove(index);
    this.setState({
      ...this.state,
      collectionItems: this.state.collectionItems.set('data', newData)
    });
  }

  moveCollectionItem (dragIndex, hoverIndex) {
    const { collectionItems } = this.state;
    const collectionItemsData = collectionItems.get('data');
    const dragCollectionItem = collectionItemsData.get(dragIndex);

    console.warn('MOVE', dragIndex, hoverIndex);

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
      backgroundColor: 'white',
      borderRadius: 2,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.lightGray2
    },
    content: {
      paddingTop: '1em',
      paddingBottom: '0.5em',
      paddingLeft: '1em',
      paddingRight: '1em'
    },
    header: {
      base: {
        backgroundColor: colors.lightGray4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '2em',
        paddingLeft: '1em',
        paddingRight: '1em',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'transparent'
      },
      borderBottom: {
        borderBottomColor: colors.lightGray2
      }
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: '#6d8791',
      marginRight: '0.625em',
      textTransform: 'uppercase'
    },
    headerContainer: {
      alignItems: 'center',
      display: 'flex'
    },
    wrapper: {
      width: '100%',
      marginBottom: '0.75em'
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
      ...makeTextStyle(fontWeights.regular, '0.031em'),
      color: colors.lightGray3,
      fontSize: '0.625em',
      textDecoration: 'none'
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
        backgroundColor: colors.lightGray2,
        color: colors.darkGray3
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

    // console.warn('STATE', this.state, this.state.collectionItems.toJS());

    return [
      <img key='hamburger' src={hamburgerImage} style={styles.marginRight} />,
      <h2 key='title' style={styles.title}>{collection.get('title')}</h2>,
      collection.get('brand') &&
        <span key='brand' style={styles.linkContainer}>
          <img key='link' src={linkImage} style={styles.marginRight} />
          {collection.getIn([ 'brand', 'logo' ]) &&
            <img src={`${collection.getIn([ 'brand', 'logo', 'url' ])}?height=70&width=70`} style={styles.roundImage} />}
          <Link style={styles.link} to={`/content/brands/read/${collection.getIn([ 'brand', 'id' ])}`}>
            {collection.getIn([ 'brand', 'name' ])}
          </Link>
        </span>,
      collection.get('character') &&
        <span key='character' style={styles.linkContainer}>
          <img key='link' src={linkImage} style={styles.marginRight} />
          {collection.getIn([ 'character', 'portraitImage' ]) &&
            <img src={`${collection.getIn([ 'character', 'portraitImage', 'url' ])}?height=70&width=70`} style={styles.roundImage} />}
          <Link style={styles.link} to={`/content/characters/read/${collection.getIn([ 'character', 'id' ])}`}>
            {collection.getIn([ 'character', 'name' ])}
          </Link>
        </span>,
      <div key='count' style={[ styles.badge.base, count > 0 ? styles.badge.count : styles.badge.none ]}>{count}</div>
    ];
  }

  render () {
    const styles = this.constructor.styles;
    const {
      collection, connectDropTarget, contentStyle, isLoading, style, onCollectionItemCreate,
      onCollectionItemDelete, onCollectionItemEdit, onCollectionDelete, onCollectionEdit
    } = this.props;
    return (
      connectDropTarget(
        <div style={[ styles.wrapper, style ]}>
          <div style={styles.container}>
            <div style={[ styles.header.base, this.state.open && styles.header.borderBottom ]}>
              <div style={styles.headerContainer}>
                {this.renderTitle()}&nbsp;&nbsp;&nbsp;{isLoading && <Spinner size='small' />}
              </div>
              <div style={styles.headerContainer}>
                <EditButton style={styles.marginRight} onClick={onCollectionEdit} />
                <RemoveButton cross style={styles.marginRight} onClick={onCollectionDelete}/>
                {this.state.open
                  ? <button title='Minimize' onClick={this.onMinimizeClick}>
                      <img src={minimizeImage} />
                    </button>
                  : <button title='Maximize' onClick={this.onMaximizeClick}>
                      <img src={maximizeImage} />
                    </button>}
              </div>
            </div>
            {this.state.open &&
              <div style={[ styles.content, contentStyle ]}>
                <CollectionItems
                  collectionId={collection.get('id')}
                  collectionItems={this.state.collectionItems}
                  moveCollectionItem={this.moveCollectionItem}
                  removeCollectionItem={this.removeCollectionItem}
                  onCollectionItemCreate={onCollectionItemCreate}
                  onCollectionItemDelete={onCollectionItemDelete}
                  onCollectionItemEdit={onCollectionItemEdit}/>
              </div>}
          </div>
        </div>
      )
    );
  }
}
