import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../../../_common/styles';
import DateInput from '../../../../../_common/inputs/dateInput';
import TimeInput from '../../../../../_common/inputs/timeInput';
import SelectInput from '../../../../../_common/inputs/selectInput';
import CheckboxInput from '../../../../../_common/inputs/checkbox';
import PersistModal from '../../../../../_common/components/persistModal';
import localized from '../../../../../_common/decorators/localized';
import timezones, { timezoneKeys } from '../../../../../../constants/timezones';
import { FETCHING } from '../../../../../../constants/statusTypes';
import selector from './selector';
import * as actions from './actions';

function validate (values, { t }) {
  const validationErrors = {};
  const { broadcasterId, endDate, endTime, startDate, startTime, timezone, noEndDate } = values.toJS();
  if (!broadcasterId) { validationErrors.broadcasterId = t('common.errors.required'); }
  if (!startDate) { validationErrors.startDate = t('common.errors.required'); }
  if (!startTime) { validationErrors.startTime = t('common.errors.required'); }
  if (!timezone) { validationErrors.timezone = t('common.errors.required'); }

  // If there is an end date both date and time should be filled in.
  if (!noEndDate) {
    if (!endDate) { validationErrors.endDate = t('common.errors.required'); }
    if (!endTime) { validationErrors.endTime = t('common.errors.required'); }
  }

  if (!noEndDate && !validationErrors.startDate && !validationErrors.startTime && !validationErrors.endDate && !validationErrors.endTime) {
    const start = startDate.clone().hours(startTime.hours()).minutes(startTime.minutes());
    const end = endDate.clone().hours(endTime.hours()).minutes(endTime.minutes());

    // Date/time is wrong! End before start.
    if (start.isSameOrAfter(end)) {
      // Check date.
      if (startDate.isAfter(endDate)) {
        // Date is wrong.
        validationErrors.endDate = 'End date must be after start date.';
      } else {
        // Date is oké, time is wrong.
        validationErrors.endTime = 'End time must be after start time.';
      }
    }
  }

  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  searchBroadcasterChannels: bindActionCreators(actions.searchBroadcasterChannels, dispatch),
  searchBroadcasterMedia: bindActionCreators(actions.searchBroadcasterMedia, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch)
}))
@reduxForm({
  form: 'scheduleEntry',
  validate
})
@Radium
export default class ScheduleEntryModal extends Component {

  static propTypes = {
    broadcastChannelsById: ImmutablePropTypes.map.isRequired,
    broadcasterId: PropTypes.string,
    broadcastersById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    mediaById: ImmutablePropTypes.map.isRequired,
    noEndDate: PropTypes.bool,
    searchBroadcasterChannels: PropTypes.func.isRequired,
    searchBroadcasterMedia: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchedBroadcasterChannelIds: ImmutablePropTypes.map.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedBroadcasterMediumIds: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async submit (form) {
    try {
      await this.props.onSubmit(form.toJS());
      this.onCloseClick();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.onClose();
  }

  static styles = {
    checkbox: {
      paddingBottom: '0.438em'
    },
    checkboxLabel: {
      paddingBottom: '0.7em'
    },
    col2: {
      display: 'flex',
      flexDirection: 'row'
    },
    dateInput: {
      flex: 1,
      paddingRight: '0.313em'
    },
    timeInput: {
      alignSelf: 'flex-end',
      flex: 1,
      paddingLeft: '0.313em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      broadcasterId, broadcastChannelsById, broadcastersById, change, dispatch, edit, handleSubmit,
      mediaById, noEndDate,
      searchBroadcasterChannels, searchBroadcasterMedia, searchBroadcasters, searchedBroadcasterChannelIds,
      searchedBroadcasterIds, searchedBroadcasterMediumIds
    } = this.props;
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Schedule Entry' : 'Add to Schedule'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Period</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(timezoneKey) => timezones[timezoneKey]}
          label='Timezone'
          name='timezone'
          options={timezoneKeys}
          placeholder='Timezone'
          required />
        <div style={styles.col2}>
          <Field
            component={DateInput}
            label='Start'
            name='startDate'
            placeholder='DD/MM/YYYY'
            required
            style={styles.dateInput} />
          <Field
            component={TimeInput}
            name='startTime'
            required
            style={styles.timeInput} />
        </div>
        <div style={styles.col2}>
          <Field
            component={DateInput}
            content={
              <Field
                component={CheckboxInput}
                first
                label='Never ends'
                name='noEndDate'
                style={styles.checkbox}
                onChange={(value) => {
                  if (value) {
                    dispatch(change('endDate', null));
                    dispatch(change('endTime', null));
                  }
                }} />}
            disabled={noEndDate}
            label='End'
            labelStyle={styles.checkboxLabel}
            name='endDate'
            placeholder='DD/MM/YYYY'
            required
            style={styles.dateInput} />
          <Field
            component={TimeInput}
            disabled={noEndDate}
            name='endTime'
            required
            style={styles.timeInput} />
        </div>
        <FormSubtitle>Where</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(id) => broadcastersById.getIn([ id, 'name' ])}
          getOptions={searchBroadcasters}
          isLoading={searchedBroadcasterIds.get('_status') === FETCHING}
          label='Broadcaster'
          name='broadcasterId'
          options={searchedBroadcasterIds.get('data').toJS()}
          placeholder='Broadcaster'
          required
          // When the broadcaster was changed, we reset the mediumIds.
          onChange={() => {
            dispatch(change('broadcastChannelIds', []));
            dispatch(change('mediumIds', []));
          }}/>
        <Field
          component={SelectInput}
          disabled={!broadcasterId}
          getItemText={(id) => broadcastChannelsById.getIn([ id, 'name' ])}
          getOptions={searchBroadcasterChannels}
          isLoading={searchedBroadcasterChannelIds.get('_status') === FETCHING}
          label='Channels'
          multiselect
          name='broadcastChannelIds'
          options={searchedBroadcasterChannelIds.get('data').toJS()}
          placeholder='Channels'/>
        <Field
          component={SelectInput}
          disabled={!broadcasterId}
          getItemText={(id) => mediaById.getIn([ id, 'title' ])}
          getOptions={searchBroadcasterMedia}
          isLoading={searchedBroadcasterMediumIds.get('_status') === FETCHING}
          label='Content'
          multiselect
          name='mediumIds'
          options={searchedBroadcasterMediumIds.get('data').toJS()}
          placeholder='Content'/>
      </PersistModal>
    );
  }

}
