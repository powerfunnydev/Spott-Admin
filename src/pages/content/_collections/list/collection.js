/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { colors, fontWeights, makeTextStyle } from '../../../_common/styles';
import Spinner from '../../../_common/components/spinner';
import CollectionItems from './collectionItems/list';
import EditButton from '../../../_common/components/buttons/editButton';
import RemoveButton from '../../../_common/components/buttons/removeButton';

const hamburgerImage = require('../../../_common/images/hamburger.svg');
const linkImage = require('../../../_common/images/link.svg');
const minimizeImage = require('../../../_common/images/minimize.svg');
const maximizeImage = require('../../../_common/images/maximize.svg');

@Radium
export default class Collection extends Component {

  static propTypes = {
    collection: ImmutablePropTypes.map.isRequired,
    contentStyle: PropTypes.object,
    isLoading: PropTypes.bool,
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
    this.onMinimizeClick = ::this.onMinimizeClick;
    this.onMaximizeClick = ::this.onMaximizeClick;
    this.state = { open: false };
  }

  onMinimizeClick (e) {
    e.preventDefault();
    this.setState({ open: false });
  }

  onMaximizeClick (e) {
    e.preventDefault();
    this.setState({ open: true });
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
      collection, contentStyle, isLoading, style, onCollectionItemCreate,
      onCollectionItemDelete, onCollectionItemEdit, onCollectionDelete, onCollectionEdit
    } = this.props;
    return (
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
                collectionItems={collection.get('collectionItems')}
                onCollectionItemCreate={onCollectionItemCreate}
                onCollectionItemDelete={onCollectionItemDelete}
                onCollectionItemEdit={onCollectionItemEdit}/>
            </div>}
        </div>
      </div>
    );
  }
}
