import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

const plusIcon = require('../../../assets/images/plus.svg');

@Radium
export default class PlusButton extends Component {
  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { style, text, onClick } = this.props;
    return (
      <button style={style} onClick={onClick} ><span style={{ paddingRight: '9px' }}><img src={plusIcon}/></span>{text}</button>
    );
  }
}
