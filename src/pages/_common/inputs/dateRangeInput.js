/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../styles';
import { Calendar } from 'react-date-range';

@Radium
export default class DateRangeInput extends Component {

  static propTypes = {
    endDate: PropTypes.object.isRequired,
    startDate: PropTypes.object.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.openDateRangePicker = ::this.openDateRangePicker;
    this.closeDateRangePicker = ::this.closeDateRangePicker;
    this.state = { open: null };
  }

  closeDateRangePicker () {
    this.setState({ open: null });
  }

  openDateRangePicker (openInputField) {
    this.setState({ open: openInputField });
  }

  onChange (field, date) {
    const { startDate: { input: startDateInput }, endDate: { input: endDateInput }, onChange } = this.props;
    let startDate = startDateInput.value;
    let endDate = endDateInput.value;

    if (field === 'startDate') {
      startDateInput.onChange(date);
      startDate = date;
    } else {
      endDateInput.onChange(date);
      endDate = date;
    }

    if (onChange) {
      onChange({ endDate, startDate });
    }
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
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { startDate, endDate, style } = this.props;
    // Format date.
    const dateFormat = 'D MMMM YYYY';

    return (
      <div style={style}>
        <div style={styles.wrapper}>
          <div style={{ position: 'relative', paddingRight: '0.75em', width: '100%' }}>
            <input
              readOnly
              style={styles.base}
              type='text'
              value={`${startDate.input.value.format(dateFormat).toString()}`}
              onBlur={this.closeDateRangePicker}
              onFocus={this.openDateRangePicker.bind(this, 'startDate')} />
            {this.state.open === 'startDate' &&
              <div style={styles.popup} onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
                <Calendar
                  date={startDate.input.value}
                  theme={styles.theme}
                  onChange={this.onChange.bind(this, 'startDate')}/>
              </div>}
          </div>
          -
          <div style={{ position: 'relative', paddingLeft: '0.75em', width: '100%' }}>
            <input
              readOnly
              style={styles.base}
              type='text'
              value={`${endDate.input.value.format(dateFormat).toString()}`}
              onBlur={this.closeDateRangePicker}
              onFocus={this.openDateRangePicker.bind(this, 'endDate')} />
            {this.state.open === 'endDate' &&
              <div style={styles.popup} onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
                <Calendar
                  date={endDate.input.value}
                  theme={styles.theme}
                  onChange={this.onChange.bind(this, 'endDate')}/>
              </div>}
          </div>
        </div>
      </div>
    );
  }

}
