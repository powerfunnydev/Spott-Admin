import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { reduxForm, Field, Fields } from 'redux-form/immutable';
// import DateInput from '../../_common/inputs/dateInput';
import SelectInput from '../../_common/inputs/selectInput';
import DateRangeInput from '../../_common/inputs/dateRangeInput';
import { FETCHING } from '../../../constants/statusTypes';
import * as actions from '../actions';
import { eventsFilterSelector } from '../selector';

@connect(eventsFilterSelector, (dispatch) => ({
  loadEvents: bindActionCreators(actions.loadEvents, dispatch),
  searchEvents: bindActionCreators(actions.searchMedia, dispatch)
}))
@reduxForm({
  destroyOnUnmount: false,
  form: 'reportingActivityFilter',
  initialValues: {
    endDate: moment(),
    startDate: moment().startOf('day').subtract(1, 'months').date(1)
  }
})
@Radium
export default class ActivityFilterForm extends Component {

  static propTypes = {
    events: ImmutablePropTypes.map,
    eventsById: ImmutablePropTypes.map,
    loadEvents: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  async componentDidMount () {
    const events = await this.props.loadEvents();
    const firstEvent = events && events[0] && events[0].id;
    if (firstEvent) {
      this.props.dispatch(this.props.change('event', firstEvent));
      this.props.onChange('event', firstEvent);
    }
  }

  static styles = {
    container: {
      display: 'flex'
    },
    col6: {
      width: '100%'

    },
    eventContainer: {
      paddingRight: '1.5em'
    },
    field: {
      paddingTop: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { events, eventsById, style, onChange } = this.props;

    return (
      <form style={[ styles.container, style ]}>
        <div style={[ styles.col6, styles.eventContainer ]}>
          <Field
            component={SelectInput}
            getItemText={(id) => eventsById.getIn([ id, 'description' ])}
            isLoading={events.get('_status') === FETCHING}
            name='event'
            options={events.get('data').map((e) => e.get('id')).toJS()}
            placeholder='Event'
            style={styles.field}
            onChange={onChange.bind(null, 'event')} />
        </div>
        <div style={styles.col6}>
          <Fields
            component={DateRangeInput}
            names={[ 'endDate', 'startDate' ]}
            style={styles.field}
            onChange={onChange.bind(null, 'dateRange')} />
        </div>
      </form>
    );
  }
}
