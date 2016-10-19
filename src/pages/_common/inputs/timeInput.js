/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import TimePicker from 'rc-time-picker';
import { colors } from '../styles';
import Label from './_label';
import 'rc-time-picker/assets/index.css';
import './styles/timeInput.css';

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
      border: `1px solid ${colors.darkGray}`,
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: '16px',
      height: 38,
      padding: 6,
      width: '100%'
    },
    theme: {
      DateRange: {
        background: 'transparent'
      }
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

    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <TimePicker
          placeholder='hh:mm'
          showSecond={false}
          value={input.value}
          onChange={this.onChange}/>
      </div>
    );
  }

}
