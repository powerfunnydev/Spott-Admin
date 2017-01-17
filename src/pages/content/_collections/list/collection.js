import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../../../_common/styles';
import Spinner from '../../../_common/components/spinner';

const hamburgerImage = require('../../../_common/images/hamburger.svg');

@Radium
export default class Collection extends Component {

  static propTypes = {
    children: PropTypes.node,
    collection: ImmutablePropTypes.map.isRequired,
    contentStyle: PropTypes.object,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    onCollectionDelete: PropTypes.func.isRequired,
    onCollectionEdit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.renderTitle = ::this.renderTitle;
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
      paddingTop: '2em',
      paddingBottom: '2em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    },
    header: {
      backgroundColor: colors.lightGray4,
      display: 'flex',
      alignItems: 'center',
      height: '2em',
      paddingLeft: '1em',
      paddingRight: '1em',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.lightGray2
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: '#6d8791',
      marginRight: '0.5em',
      textTransform: 'uppercase'
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
    hamburger: {
      marginRight: '0.5em'
    },
    linkName: {
      alignItems: 'center',
      ...makeTextStyle(fontWeights.regular, '0.031em'),
      color: colors.lightGray3,
      display: 'flex',
      fontSize: '0.625em',
      marginRight: '0.625em'
    }
  };

  renderTitle () {
    const styles = this.constructor.styles;
    const { collection } = this.props;
    return [
      <img key='hamburger' src={hamburgerImage} style={styles.hamburger} />,
      <h2 key='title' style={styles.title}>{collection.get('title')}</h2>,
      collection.get('brand') &&
        <span key='brand' style={styles.linkName}>
          {collection.getIn([ 'brand', 'logo' ]) &&
            <img src={`${collection.getIn([ 'brand', 'logo', 'url' ])}?height=70&width=70`} style={styles.roundImage} />}
          {collection.getIn([ 'brand', 'name' ])}
        </span>,
      collection.get('character') && collection.getIn([ 'character', 'name' ])

    ];
  }

  render () {
    const styles = this.constructor.styles;
    const { children, collection, contentStyle, isLoading, style } = this.props;
    return (
      <div style={[ styles.wrapper, style ]}>
        <div style={styles.container}>
          <div style={styles.header}>
            {this.renderTitle()}&nbsp;&nbsp;&nbsp;{isLoading && <Spinner size='small' />}
          </div>
          <div style={[ styles.content, contentStyle ]}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
