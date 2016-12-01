import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import DateInput from '../../../_common/inputs/dateInput';
import TimeInput from '../../../_common/inputs/timeInput';
import SelectInput from '../../../_common/inputs/selectInput';
import PersistModal from '../../../_common/persistModal';
import localized from '../../../_common/localized';
import timezones, { timezoneKeys } from '../../../../constants/timezones';
import videoStatusTypes from '../../../../constants/videoStatusTypes';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { countryId, videoStatus } = values.toJS();
  if (!countryId) { validationErrors.countryId = t('common.errors.required'); }
  if (!videoStatus) { validationErrors.videoStatus = t('common.errors.required'); }
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
    countries: ImmutablePropTypes.map.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
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
    col2: {
      display: 'flex',
      flexDirection: 'row'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { countries, edit, handleSubmit } = this.props;
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
          placeholder='Timezone' />
        <div style={styles.col2}>
          <Field
            component={DateInput}
            label='Start'
            name='startDate'
            placeholder='DD/MM/YYYY'
            style={{ flex: 1, paddingRight: '0.313em' }} />
          <Field
            component={TimeInput}
            name='startTime'
            style={{ flex: 1, paddingLeft: '0.313em' }} />
        </div>
        <div style={styles.col2}>
          <Field
            component={DateInput}
            label='End'
            name='endDate'
            placeholder='DD/MM/YYYY'
            style={{ flex: 1, paddingRight: '0.313em' }} />
          <Field
            component={TimeInput}
            name='endTime'
            style={{ flex: 1, paddingLeft: '0.313em' }} />
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
