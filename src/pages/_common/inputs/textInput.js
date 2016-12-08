import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';

@Radium
export default class TextInput extends Component {

  static propTypes = {
    content: PropTypes.node,
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    meta: PropTypes.object,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    type: PropTypes.string,
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
      fontSize: '0.688em',
      color: colors.veryDarkGray
    },
    lineHeight: {
      lineHeight: '30px'
    },
    textArea: {
      paddingTop: '8px',
      height: '60px'
    },
    // checkboxText: {
    //   ...makeTextStyle(fontWeights.regular, '11px'),
    //   color: colors.darkGray2,
    //   paddingLeft: '8px'
    // },
    checkboxRow: {
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: '10px'
    },
    checkBox: {
      display: 'inline-block'
    }
    // checkboxWithText: {
    //   display: 'flex',
    //   flexDirection: 'row',
    //   paddingRight: '10px'
    // }
  };

  render () {
    const styles = this.constructor.styles;
    const { content, placeholder, disabled, first, input, label, labelStyle,
      meta, required, style, type } = this.props;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} style={labelStyle} text={label} />}
        {content}
        {type !== 'multiline' &&
          <input
            {...input}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            style={[
              styles.base,
              disabled && styles.disabled,
              meta && meta.touched && meta.error && styles.error,
              styles.text,
              styles.lineHeight
            ]}
            type={type}
            onChange={this.onChange} />}
        {type === 'multiline' &&
          <textarea
            {...input}
            cols={4}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            style={[
              styles.base,
              styles.textArea,
              disabled && styles.disabled,
              meta && meta.touched && meta.error && styles.error,
              styles.text
            ]}
            onChange={this.onChange} />}
        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
