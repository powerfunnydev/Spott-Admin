import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { makeTextStyle, fontWeights, colors, errorTextStyle } from '../styles';
import Label from './_label';
import { Checkbox } from './checkbox';
import { Field } from 'redux-form/immutable';

@Radium
export default class TextInput extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    copyFromBase: PropTypes.bool,
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired,
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
    checkboxText: {
      ...makeTextStyle(fontWeights.regular, '11px'),
      color: colors.darkGray2,
      paddingLeft: '8px'
    },
    checkboxRow: {
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: '10px'
    },
    checkBox: {
      display: 'inline-block'
    },
    checkboxWithText: {
      display: 'flex',
      flexDirection: 'row',
      paddingRight: '10px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { placeholder, disabled, first, input, label, meta, required, style,
        type, _activeLocale } = this.props;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        {(_activeLocale) && <div style={styles.checkboxRow}>
          { _activeLocale && <div style={styles.checkboxWithText}>
            <Field
              component={Checkbox}
              name={`hasTitle.${_activeLocale}`}/>
            <div style={styles.checkboxText}>
              Custom title
            </div>
          </div>}
        </div>}
        {type !== 'multiline' &&
          <input
            {...input}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            style={[ styles.base, disabled && styles.disabled, meta.touched && meta.error && styles.error, styles.text, styles.lineHeight, style ]}
            type={type}
            onChange={this.onChange} />}
        {type === 'multiline' &&
          <textarea
            {...input}
            cols={4}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            style={[ styles.base, styles.textArea, disabled && styles.disabled, meta.touched && meta.error && styles.error, styles.text, style ]}
            onChange={this.onChange} />}
        {meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
