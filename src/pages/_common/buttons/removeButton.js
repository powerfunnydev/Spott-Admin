import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

const removeIcon = require('../../../assets/images/garbage.svg');

@Radium
export default class RemoveButton extends Component {
  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { style, text, onClick } = this.props;
    return (
      <button style={style} onClick={onClick} ><span><img src={removeIcon}/></span>{text}</button>
    );
  }
}
