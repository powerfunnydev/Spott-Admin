/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import TimePicker from 'rc-time-picker';
import { errorTextStyle } from '../styles';
import Label from './_label';
import 'rc-time-picker/assets/index.css';
import './styles/timeInput.css';

@Radium
export default class TimeInput extends Component {

  static propTypes = {
    dateFormat: PropTypes.string,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object,
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

  onChange (time) {
    const { input, onChange } = this.props;
    if (input.onChange) {
      input.onChange(time);
    }
    if (onChange) {
      onChange(time);
    }
    this.closeDatePicker();
  }

  static styles = {
    padTop: {
      paddingTop: '1.25em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { first, input, label, meta, required, style } = this.props;

    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label ? <Label required={required} text={label} /> : <Label />}
        <TimePicker
          placeholder='hh:mm'
          showSecond={false}
          value={typeof input.value === 'object' ? input.value : null}
          onChange={this.onChange}/>
        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
