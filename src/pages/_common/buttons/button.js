import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { buttonStyles } from '../styles';

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
      marginLeft: 0
    }
  };

  render () {
    const { styles } = this.constructor;
    const { first, style, text, onClick } = this.props;

    return (
      <button
        style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue, first && styles.marginLeft, style ]}
        type={this.props.type}
        onClick={onClick} >
        {text}
      </button>
    );
  }
}
