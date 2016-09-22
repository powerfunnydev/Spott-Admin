/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../styles';
import { DateRange } from 'react-date-range';

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
    this.onChange = ::this.onChange;
    this.openDateRangePicker = ::this.openDateRangePicker;
    this.closeDateRangePicker = ::this.closeDateRangePicker;
    this.state = { open: false };
  }

  closeDateRangePicker () {
    this.setState({ open: false });
  }

  openDateRangePicker () {
    this.setState({ open: true });
  }

  onChange ({ endDate, startDate }) {
    const { startDate: { input: startDateInput }, endDate: { input: endDateInput }, onChange } = this.props;
    startDateInput.onChange(startDate);
    endDateInput.onChange(endDate);
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
      width: 300
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
    const { startDate, endDate, style } = this.props;
    // Format date.
    const dateFormat = 'D MMM. YYYY';

    return (
      <div style={[ { position: 'relative', width: '100%', textAlign: 'right' }, style ]}>
        <input
          readOnly
          style={styles.base}
          type='text'
          value={`${startDate.input.value.format(dateFormat).toString()} - ${endDate.input.value.format(dateFormat).toString()}`}
          onBlur={this.closeDateRangePicker}
          onFocus={this.openDateRangePicker} />
        {this.state.open &&
          <div style={styles.popup} onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <DateRange
              endDate={endDate.input.value}
              linkedCalendars
              startDate={startDate.input.value}
              theme={styles.theme}
              onChange={this.onChange}/>}
          </div>}
      </div>
    );
  }

}
