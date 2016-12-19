import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import DatePicker from 'react-datepicker';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';
import './styles/customDatePicker.css';

@Radium
export default class DateInput extends Component {

  static propTypes = {
    content: PropTypes.node,
    dateFormat: PropTypes.string,
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    meta: PropTypes.object,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onChange = :: this.onChange;
  }

  onChange (date) {
    const { input, onChange } = this.props;
    input.onChange && input.onChange(date);
    onChange && onChange(date);
  }

  static styles = {
    error: {
      color: colors.errorColor,
      border: `1px solid ${colors.errorColor}`
    },
    text: {
      base: {
        border: `1px solid ${colors.lightGray2}`,
        borderRadius: 2,
        cursor: 'pointer',
        // fontSize: '1em',
        width: '100%',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: '0.625em',
        paddingRight: '0.625em',
        lineHeight: '30px',
        fontSize: '0.688em',
        color: colors.veryDarkGray
      },
      disabled: {
        backgroundColor: colors.lightGray4,
        color: colors.lightGray3
      }
    },
    theme: {
      DateRange: {
        background: 'transparent'
      }
    },
    padTop: {
      paddingTop: '1.25em'
    },
    popup: {
      position: 'absolute',
      top: '2.7em',
      right: 0,
      zIndex: 1
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      content, dateFormat, disabled, first, input, label, labelStyle, meta,
      placeholder, required, style
    } = this.props;

    // Format date.
    const format = dateFormat || 'DD/MM/YYYY';
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} style={labelStyle} text={label} />}
        {content}
        <div style={{ position: 'relative', width: '100%' }}>
          <DatePicker
            customInput={<input
              readOnly
              ref='input'
              style={[
                styles.text.base,
                disabled && styles.text.disabled,
                meta && meta.touched && meta.error && styles.error
              ]}
              type='text'
              value={input.value}/>}
            dateFormat={format}
            disabled={disabled}
            placeholderText={placeholder}
            // Expects object, but redux form will force a render, even when data isn't fetched yet.
            // So redux form will set input.value on '' (empty string). We do a check if input.value is empty,
            // if so, we give null to DatePicker.
            selected={input.value || null}
            style={{ width: '100%' }}
            onChange={this.onChange}/>
        </div>
        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
