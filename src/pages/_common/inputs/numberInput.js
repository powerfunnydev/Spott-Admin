import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';

@Radium
export default class NumberInput extends Component {

  static propTypes = {
    content: PropTypes.node,
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    max: PropTypes.number,
    meta: PropTypes.object,
    min: PropTypes.number,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange (e) {
    const { input, onChange } = this.props;
    input.onChange(e.target.value);
    if (onChange) {
      onChange(e.target.value);
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
      fontSize: '0.688em',
      color: colors.veryDarkGray
    },
    lineHeight: {
      lineHeight: '30px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      content, disabled, first, input, label, labelStyle,
      max, meta, min, placeholder, required, style
    } = this.props;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} style={labelStyle} text={label} />}
        {content}
        <input
          {...input}
          disabled={disabled}
          max={max}
          min={min}
          placeholder={placeholder}
          required={required}
          style={[
            styles.base,
            disabled && styles.disabled,
            meta && meta.touched && meta.error && styles.error,
            styles.text,
            styles.lineHeight
          ]}
          type='number'
          onChange={this.onChange} />
        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
