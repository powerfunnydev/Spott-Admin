/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { Calendar } from 'react-date-range';
import { colors } from '../styles';
import Label from './_label';

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
    this.openDatePicker = ::this.openDatePicker;
    this.closeDatePicker = ::this.closeDatePicker;
    this.onChange = ::this.onChange;
    this.state = { open: null };
  }

  closeDatePicker () {
    this.setState({ open: null });
  }

  openDatePicker () {
    this.setState({ open: true });
  }

  onChange (date) {
    const { input, onChange } = this.props;
    input.onChange(date);
    if (onChange) {
      onChange(date);
    }
    this.closeDatePicker();
  }

  static styles = {
    base: {
      border: `1px solid ${colors.lightGray2}`,
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: '1em',
      height: '2.375em',
      padding: '0.375em',
      width: '100%'
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
        <div style={{ position: 'relative', width: '100%' }}>
          {input.value.format && <input
            readOnly
            style={styles.base}
            type='text'
            value={`${input.value.format(format).toString()}`}
            onBlur={this.closeDatePicker}
            onFocus={this.openDatePicker} />}
        {this.state.open &&
          <div style={styles.popup} onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <Calendar
              date={input.value}
              theme={styles.theme}
              onChange={this.onChange}/>
          </div>}
        </div>
      </div>
    );
  }

}
