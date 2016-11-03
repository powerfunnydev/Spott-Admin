import React, { Component, PropTypes } from 'react';
import { buttonStyles } from '../styles';
import Radium from 'radium';

@Radium
export default class Button extends Component {
  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    onClick: PropTypes.func
  }

  render () {
    const { style, text, onClick } = this.props;
    return (
      <button style={[ buttonStyles.base, buttonStyles.small, style ]} type={this.props.type} onClick={onClick} >{text}</button>
    );
  }
}
