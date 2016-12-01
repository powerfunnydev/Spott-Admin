import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import SelectInput from '../../../../_common/inputs/selectInput';
import PersistModal from '../../../../_common/persistModal';

// function validate (values, { t }) {
//   const validationErrors = {};
//   const { defaultLocale, title } = values.toJS();
//   if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
//   if (!title) { validationErrors.title = t('common.errors.required'); }
//   // Done
//   return validationErrors;
// }

@reduxForm({
  form: 'availability'
  // TODO: validate
})
@Radium
export default class AvailabilityModal extends Component {

  static propTypes = {
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
    const { edit, handleSubmit } = this.props;
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Availability' : 'Add Availability'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)} />
    );
  }

}
