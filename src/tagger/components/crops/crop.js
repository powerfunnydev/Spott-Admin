import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import colors from '../colors';

@Radium
export default class Crop extends Component {

  static propTypes = {
    crop: ImmutablePropTypes.map.isRequired

  };

  static styles = {
    container: {
      display: 'inline-block',
      width: '12em',
      verticalAlign: 'top'
    },
    content: {
      padding: '1em'
    },
    image: {
      width: '100%'
    },
    comment: {
      color: colors.warmGray,
      fontSize: '0.75em'
    },
    title: {
      color: 'white',
      fontSize: '0.875em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { crop } = this.props;
    return (
      <div style={styles.container}>
        <img src={crop.getIn([ 'image', 'url' ])} style={styles.image}/>
        <div style={styles.content}>
          <h2 style={styles.title}>{crop.get('title')}</h2>
          {crop.get('comment') &&
          <div style={styles.comment}>{crop.get('comment')}</div>}
        </div>
      </div>
    );
  }

}
