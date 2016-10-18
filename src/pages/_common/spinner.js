import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
const spinnerImage = require('./spinner.gif');

@Radium
export default class Spinner extends Component {

  static propTypes = {
    style: PropTypes.object.isRequired
  }

  render () {
    const { style } = this.props;
    return (
      <img src={spinnerImage} style={style} />
    );
  }
}
