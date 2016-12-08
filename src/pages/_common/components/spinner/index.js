import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import './style.css';

@Radium
export default class Spinner extends Component {

  static propTypes = {
    size: PropTypes.string,
    style: PropTypes.object.isRequired
  };

  render () {
    const { size = 'medium', style } = this.props;
    return (
      <div className={`loading ${size}`} style={style}>
        <div className='inner' />
      </div>
    );
  }
}
