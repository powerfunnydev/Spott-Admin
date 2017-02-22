import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { FormDescription, FormSubtitle } from '../../../_common/styles';
import SelectInput from '../../../_common/inputs/selectInput';
import TextInput from '../../../_common/inputs/textInput';
import PersistModal from '../../../_common/components/persistModal';
import localized from '../../../_common/decorators/localized';
import { FETCHING } from '../../../../constants/statusTypes';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  // const { broadcasterId, endDate, endTime, startDate, startTime, timezone, noEndDate } = values.toJS();
  // if (!broadcasterId) { validationErrors.broadcasterId = t('common.errors.required'); }
  // if (!startDate) { validationErrors.startDate = t('common.errors.required'); }
  // if (!startTime) { validationErrors.startTime = t('common.errors.required'); }
  // if (!timezone) { validationErrors.timezone = t('common.errors.required'); }

  // Done
  return validationErrors;
}

@localized
@connect(selector)
@reduxForm({
  form: 'audience',
  validate
})
@Radium
export default class AudienceModal extends Component {

  static propTypes = {
    countriesById: ImmutablePropTypes.map.isRequired,
    edit: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    languagesById: ImmutablePropTypes.map.isRequired,
    searchCountries: PropTypes.func.isRequired,
    searchLanguages: PropTypes.func.isRequired,
    searchedCountryIds: ImmutablePropTypes.map.isRequired,
    searchedLanguageIds: ImmutablePropTypes.map.isRequired,
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
      countriesById, edit, handleSubmit, languagesById, searchCountries,
      searchLanguages, searchedCountryIds, searchedLanguageIds
    } = this.props;
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Audience' : 'Create Audience'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Name</FormSubtitle>
        <Field
          component={TextInput}
          name='name'
          placeholder='Name'
          required />
        <FormSubtitle>Locations</FormSubtitle>
        <FormDescription>Where is this content's target audience located?</FormDescription>
        <Field
          component={SelectInput}
          getItemText={(id) => countriesById.getIn([ id, 'name' ])}
          getOptions={searchCountries}
          isLoading={searchedCountryIds.get('_status') === FETCHING}
          label='Countries'
          multiselect
          name='countryIds'
          options={searchedCountryIds.get('data').toJS()}
          placeholder='Countries'/>
        <FormSubtitle>Languages</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(id) => languagesById.getIn([ id, 'name' ])}
          getOptions={searchLanguages}
          isLoading={searchedLanguageIds.get('_status') === FETCHING}
          label='Find a language'
          multiselect
          name='languageIds'
          options={searchedLanguageIds.get('data').toJS()}
          placeholder='Languages'/>
      </PersistModal>
    );
  }

}
