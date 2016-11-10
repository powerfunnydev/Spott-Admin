import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';

@Radium
export default class TextInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange (text) {
    const { disabled, input, onChange } = this.props;
    if (!disabled) {
      input.onChange(text);
      if (onChange) {
        onChange(text);
      }
    }
  }

  static styles = {
    padTop: {
      paddingTop: '1.25em'
    },
    base: {
      border: `1px solid ${colors.lightGray2}`,
      borderRadius: 2,
      cursor: 'pointer',
      fontSize: '1em',
      width: '100%',
      paddingTop: 0,
      paddingBottom: 0
    },
    error: {
      color: colors.errorColor,
      border: `1px solid ${colors.errorColor}`
    },
    disabled: {
      backgroundColor: colors.lightGray,
      color: colors.darkerGray
    },
    text: {
      paddingLeft: '10px',
      paddingRight: '10px',
      lineHeight: '30px',
      fontSize: '0.688em',
      color: colors.veryDarkGray
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { placeholder, disabled, first, input, label, meta, required, style } = this.props;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <input {...input} placeholder={placeholder} style={[ styles.base, disabled && styles.disabled, meta.touched && meta.error && styles.error, styles.text, style ]} onChange={this.onChange} />
        {meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
