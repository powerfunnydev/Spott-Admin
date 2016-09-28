import React, { Component } from 'react';
import Radium from 'radium';
const spinnerImage = require('./spinner.gif');

@Radium
export default class Spinner extends Component {

  render () {
    return (
      <img src={spinnerImage} />
    );
  }
}
