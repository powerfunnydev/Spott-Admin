import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

export default class Region extends Component {

  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  };

  static styles = {
    inner: {
      backgroundColor: 'transparent',
      border: '2px solid rgba(255,255,255,.7)',
      borderRadius: 4,
      width: '100%',
      height: '100%',
      float: 'left'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { height, width, x, y } = this.props;
    const boxStyle = {
      height: `${height}%`,
      left: `${x}%`,
      position: 'absolute',
      top: `${y}%`,
      width: `${width}%`
    };

    return (
      <div style={boxStyle}>
        <span style={styles.inner} />
      </div>
    );
  }

}
