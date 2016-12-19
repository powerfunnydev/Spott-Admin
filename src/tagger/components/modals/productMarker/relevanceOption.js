import Radium from 'radium';
import React, { Component, PropTypes } from 'react';

@Radium
export default class RelevanceOption extends Component {

  static propTypes = {
    checked: PropTypes.bool.isRequired,
    checkedColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    this.props.input.onChange(this.props.value);
  }

  static styles = {
    container: {
      display: 'flex'
    },
    input: {
      cursor: 'pointer',
      opacity: 0,
      position: 'absolute'
    },
    radioButton: {
      borderRadius: 8,
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: '30px',
      height: 16,
      width: 16
    },
    label: {
      cursor: 'pointer',
      display: 'inline-block',
      fontFamily: 'Rubik-Regular',
      fontSize: '13px',
      marginRight: 15,
      paddingLeft: 15
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, checkedColor, color, label, value } = this.props;

    const radioButtonStyle = [ styles.radioButton ];
    const labelStyle = [ styles.label ];

    if (checked) {
      radioButtonStyle.push({
        boxShadow: `inset 0px 0px 0px 4px ${checkedColor}`,
        backgroundColor: 'white'
      });
      labelStyle.push({ color: 'rgb(45, 48, 50)' });
    } else {
      radioButtonStyle.push({
        backgroundColor: color
      });
      labelStyle.push({ color: 'rgb(123, 129, 134)' });
    }

    return (
      <label style={styles.container}>
        <input
          checked={checked}
          id={value}
          style={styles.input}
          type='radio'
          onChange={this.onClick} />
        <span style={radioButtonStyle} onClick={this.onClick} />
        <span htmlFor={value} style={labelStyle} onClick={this.onClick}>{label}</span>
      </label>
    );
  }
}
