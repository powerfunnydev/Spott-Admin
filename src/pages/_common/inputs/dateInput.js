/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import DatePicker from 'react-datepicker';
import { colors } from '../styles';
import Label from './_label';
require('./styles/customDatePicker.css');

@Radium
export default class DateInput extends Component {

  static propTypes = {
    dateFormat: PropTypes.string,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
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
    base: {
      border: `1px solid ${colors.lightGray2}`,
      borderRadius: 2,
      cursor: 'pointer',
      fontSize: '1em',
      width: '100%',
      paddingTop: 0,
      paddingBottom: 0
    },
    text: {
      paddingLeft: '10px',
      paddingRight: '10px',
      lineHeight: '30px',
      fontSize: '0.688em',
      color: colors.veryDarkGray
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
    const { dateFormat, first, input, label, required, style } = this.props;

    // Format date.
    const format = dateFormat || 'DD/MM/YYYY';
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <div style={{ position: 'relative', width: '100%', height: '30px' }}>
          <DatePicker
            customInput={<input
              readOnly
              ref='input'
              style={[ styles.base, styles.text ]}
              type='text'
              value={input.value && `${input.value.format(format).toString()}`}/>}
            dateFormat={format}
            selected={input.value}
            style={{ width: '100%' }}
            onChange={this.onChange}/>
        </div>
      </div>
    );
  }

}
