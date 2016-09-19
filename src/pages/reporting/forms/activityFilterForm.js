import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { reduxForm, Field } from 'redux-form/immutable';
import DateInput from '../../_common/inputs/dateInput';
import SelectInput from '../../_common/inputs/selectInput';
import { FETCHING } from '../../../constants/statusTypes';
import * as actions from '../actions';
import { eventsFilterSelector } from '../selector';

@connect(eventsFilterSelector, (dispatch) => ({
  // TODO UPDATE
  searchEvents: bindActionCreators(actions.searchMedia, dispatch)
}))
@reduxForm({
  destroyOnUnmount: false,
  form: 'reportingActivityFilter',
  initialValues: {
    dateFrom: moment().startOf('day').subtract(1, 'months').date(1).toDate(),
    dateTo: moment().toDate()
  }
})
@Radium
export default class ActivityFilterForm extends Component {

  static propTypes = {
    eventsById: ImmutablePropTypes.map,
    searchEvents: PropTypes.func.isRequired,
    searchedEventIds: ImmutablePropTypes.map.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  static styles = {
    container: {
      marginRight: '-0.75em',
      marginLeft: '-0.75em'
    },
    col6: {
      display: 'inline-block',
      width: '50%',
      paddingLeft: '0.75em',
      paddingRight: '0.75em'
    },
    dates: {
      alignItems: 'center',
      display: 'flex',
      float: 'right'
    },
    dateInput: {
      paddingTop: 0,
      width: '6em'
    },
    event: {
      paddingTop: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { eventsById, searchEvents, searchedEventIds, style, onChange } = this.props;
    return (
      <form style={[ styles.container, style ]}>
        <div style={styles.col6}>
          <Field
            component={SelectInput}
            getItemText={(id) => eventsById.getIn([ id, 'title', eventsById.getIn([ id, 'defaultLocale' ]) ])}
            getOptions={searchEvents}
            isLoading={searchedEventIds.get('_status') === FETCHING}
            name='event'
            options={searchedEventIds.get('data').toJS()}
            placeholder='Event'
            style={styles.event}
            onChange={onChange.bind(null, 'event')} />
        </div>
        <div style={styles.col6}>
          <div style={styles.dates}>
            <Field
              component={DateInput}
              name='dateFrom'
              placeholder={'reporting.activity.dateFrom'}
              style={styles.dateInput}
              onChange={onChange.bind(null, 'dateFrom')} />
            <div>&nbsp;-&nbsp;</div>
            <Field
              component={DateInput}
              name='dateTo'
              placeholder={'reporting.activity.dateTo'}
              style={styles.dateInput}
              onChange={onChange.bind(null, 'dateTo')} />
          </div>
        </div>
      </form>
    );
  }
}
