import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

@Radium
export default class Checkbox extends Component {

  static propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick () {
    this.props.input.onChange(!this.props.input.value);
  }

  static styles = {
    input: {
      position: 'absolute',
      opacity: 0
    },
    checkbox: {
      border: '1px solid rgb(220, 222, 223)',
      borderRadius: 3,
      color: 'rgb(32, 142, 59)',
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: '16px',
      height: 20,
      lineHeight: '20px',
      textShadow: '1px 1px 1px rgba(0, 0, 0, .2)',
      width: 20
    },
    label: {
      color: 'rgb(123, 129, 134)',
      cursor: 'pointer',
      display: 'inline-block',
      fontFamily: 'Rubik-Regular',
      fontSize: '16px',
      fontWeight: 'normal',
      marginRight: 15,
      paddingLeft: 15
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { input, label, style } = this.props;

    return (
      <div style={style}>
        <input
          {...input}
          style={styles.input}
          type='checkbox' />
        <span style={styles.checkbox} onClick={this.onClick}>
          &nbsp;{input.value && '✓'}</span>
        <label htmlFor={input.name} style={styles.label} onClick={this.onClick}>{label}</label>
      </div>
    );
  }
}
