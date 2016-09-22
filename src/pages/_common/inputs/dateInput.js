import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, defaultSpacing, errorTextStyle } from '../styles';
import Label from './_label';
import moment from 'moment';

@Radium
export default class DateInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired,
    placeholder: PropTypes.string.isRequired,
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
    const value = e.target.value;
    // Was a valid string entered?
    if (!value || !/^(\d{4})-(\d{2})-(\d{2})$/.test(value)) {
      return input.onChange(value); // Set (invalid) string value
    }
    // Create a moment, and check validity.
    const m = moment(value, 'YYYY-MM-DD');
    if (!m.isValid()) {
      input.onChange(value); // Set (invalid) string value
      // Trigger change on field, with valid value.
      if (onChange) {
        onChange(value);
      }
    }
    input.onChange(m.toDate());
    // Set the constructed date object
    if (onChange) {
      onChange(m.toDate());
    }
  }

  onBlur (event, input) {
    event.target = { value: input.value };
    input.onBlur(event);
  }

  static styles = {
    padTop: {
      paddingTop: defaultSpacing * 0.75
    },
    base: {
      border: `1px solid ${colors.darkGray}`,
      borderRadius: 4,
      fontSize: '16px',
      height: 38,
      padding: 6,
      width: '100%'
    },
    disabled: {
      backgroundColor: colors.lightGray,
      color: colors.darkerGray
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { disabled, first, input, label, meta, placeholder, required, style } = this.props;
    const stringValue = input.value instanceof Date ? moment(input.value).format('YYYY-MM-DD') : input.value;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <input {...input}
          disabled={disabled} placeholder={placeholder} required={required}
          style={[ styles.base, disabled && styles.disabled ]} type='text'
          value={stringValue}
          onBlur={(event) => this.onBlur(event, input)}
          onChange={this.onChange} />
        {meta.touched && meta.error === 'required' && <div style={errorTextStyle}>This date is required.</div>}
      </div>
    );
  }

}
