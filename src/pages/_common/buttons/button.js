import React, { Component, PropTypes } from 'react';
import { buttonStyles } from '../styles';
import Radium from 'radium';

@Radium
export default class Button extends Component {
  static propTypes = {
    first: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    onClick: PropTypes.func
  }

  static styles = {
    marginLeft: {
      marginLeft: '0px'
    }
  }
  render () {
    const { first, style, text, onClick } = this.props;
    const { styles } = this.constructor;
    return (
      <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue, first && styles.marginLeft, style ]} type={this.props.type} onClick={onClick} >{text}</button>
    );
  }
}
