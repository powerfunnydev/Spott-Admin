import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import DateInput from '../../../_common/inputs/dateInput';
import TimeInput from '../../../_common/inputs/timeInput';
import SelectInput from '../../../_common/inputs/selectInput';
import CheckboxInput from '../../../_common/inputs/checkbox';
import PersistModal from '../../../_common/persistModal';
import localized from '../../../_common/localized';
import timezones, { timezoneKeys } from '../../../../constants/timezones';
import videoStatusTypes from '../../../../constants/videoStatusTypes';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { countryId, endDate, endTime, startDate, startTime, timezone, noEndDate, videoStatus } = values.toJS();
  if (!countryId) { validationErrors.countryId = t('common.errors.required'); }
  if (!startDate) { validationErrors.startDate = t('common.errors.required'); }
  if (!startTime) { validationErrors.startTime = t('common.errors.required'); }
  if (!timezone) { validationErrors.timezone = t('common.errors.required'); }
  if (!videoStatus) { validationErrors.videoStatus = t('common.errors.required'); }

  // If there is an end date both date and time should be filled in.
  if (!noEndDate) {
    if (!endDate) { validationErrors.endDate = t('common.errors.required'); }
    if (!endTime) { validationErrors.endTime = t('common.errors.required'); }
  }
  // Done
  return validationErrors;
}

@localized
@connect(selector)
@reduxForm({
  form: 'availability',
  validate
})
@Radium
export default class AvailabilityModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    countries: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    noEndDate: PropTypes.bool,
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
    const { change, countries, dispatch, edit, handleSubmit, noEndDate } = this.props;
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Availability' : 'Add Availability'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          first
          getItemText={(countryId) => countries.getIn([ countryId, 'name' ])}
          label='Country'
          name='countryId'
          options={countries.keySeq().toArray()}
          placeholder='Country'
          required />
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
        <Field
          component={SelectInput}
          getItemText={(videoStatus) => videoStatusTypes[videoStatus]}
          label='Sync state'
          name='videoStatus'
          options={Object.keys(videoStatusTypes)}
          placeholder='Sync state'
          required />
      </PersistModal>
    );
  }

}
