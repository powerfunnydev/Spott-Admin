import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import SelectInput from '../../_common/inputs/selectInput';
import DateInput from '../../_common/inputs/dateInput';
import { FETCHING } from '../../../constants/statusTypes';
import * as actions from '../actions';
import { eventsFilterSelector } from '../selector';

// endDate: moment().startOf('day'),
// // We assume the ALL event will be always there.
// event: 'ALL',
// startDate: moment().startOf('day').subtract(1, 'months').date(1)

@connect(eventsFilterSelector, (dispatch) => ({
  loadEvents: bindActionCreators(actions.loadEvents, dispatch),
  searchEvents: bindActionCreators(actions.searchMedia, dispatch)
}))
@Radium
export default class ActivityFilterForm extends Component {

  static propTypes = {
    events: ImmutablePropTypes.map,
    eventsById: ImmutablePropTypes.map,
    fields: PropTypes.shape({
      endDate: PropTypes.object,
      events: PropTypes.array, // event ids
      startDate: PropTypes.object
    }).isRequired,
    loadEvents: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeEvents = ::this.onChangeEvents;
  }

  componentDidMount () {
    this.props.loadEvents();
  }

  // Perform some deselect logic. We can have 'ALL' selected and other
  // event types. ALL is one of the event types.
  onChangeEvents (newEvents) {
    const { fields: { events: prevEvents }, onChange } = this.props;

    // Deselect other options if we selected ALL.
    if (!prevEvents.includes('ALL') && newEvents.includes('ALL')) {
      return onChange('events', 'array', [ 'ALL' ]);
    }
    // ALL was selected but we (de)selected something else, unselect ALL.
    const allIndex = prevEvents.indexOf('ALL');
    if (allIndex > -1) {
      // Destructive change to array, remove 'ALL'.
      newEvents.splice(allIndex, 1);
      return onChange('events', 'array', newEvents);
    }
    onChange('events', 'array', newEvents);
  }

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    col6: {
      width: '100%'
    },
    eventContainer: {
      display: 'flex',
      paddingRight: '1.5em'
    },
    field: {
      flex: 5
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { events, eventsById, fields, style, onChange } = this.props;

    return (
      <form style={[ styles.container, style ]}>
        <SelectInput
          first
          getItemText={(id) => eventsById.getIn([ id, 'description' ])}
          input={{ value: fields.events }}
          isLoading={events.get('_status') === FETCHING}
          multiselect
          name='events'
          options={events.get('data').map((e) => e.get('id')).toJS()}
          placeholder='Events'
          style={[ styles.field, { paddingRight: '0.75em' } ]}
          onChange={this.onChangeEvents} />
        <DateInput
          dateFormat='D MMMM YYYY'
          first
          input={{ value: fields.startDate }}
          name='startDate'
          required
          style={{ flex: 2.25 }}
          onChange={onChange.bind(null, 'startDate', 'date')}/>
        <div style={{ flex: 0.3, display: 'flex', justifyContent: 'center' }}><p>-</p></div>
        <DateInput
          dateFormat='D MMMM YYYY'
          first
          input={{ value: fields.endDate }}
          name='endDate'
          required
          style={{ flex: 2.25 }}
          onChange={onChange.bind(null, 'endDate', 'date')}/>
      </form>
    );
  }
}
