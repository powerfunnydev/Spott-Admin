import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import TextInput from '../../../_common/inputs/textInput';
import FileInput from '../../../_common/inputs/fileInput';
import CheckboxInput from '../../../_common/inputs/checkbox';
import PersistModal from '../../../_common/components/persistModal';
import localized from '../../../_common/decorators/localized';
import { FormDescription, FormSubtitle } from '../../../_common/styles';
import * as actions from './actions';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { description, file } = values.toJS();
  if (!description) { validationErrors.description = t('common.errors.required'); }
  if (!file) { validationErrors.file = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  createVideo: bindActionCreators(actions.createVideo, dispatch)
}))
@reduxForm({
  form: 'video',
  validate
})
@Radium
export default class VideoModal extends Component {

  static propTypes = {
    createVideo: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async submit (form) {
    try {
      this.onCloseClick();
      await this.props.createVideo(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.onClose();
  }

  static styles = {
    col3: {
      display: 'flex',
      flexDirection: 'row'
    },
    col: {
      width: `${100 / 3}%`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { edit, handleSubmit } = this.props;
    return (
      <PersistModal isOpen submitButtonText='Upload' title={edit ? 'Edit Interactive Video' : 'Add Interactive Video'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={TextInput}
          first
          label='Interactive video name'
          name='description'
          placeholder='Interactive video name'
          required />
        <FormSubtitle>Video file</FormSubtitle>
        <Field
          component={FileInput}
          label='Select file'
          name='file'
          placeholder='Select file (mp4/mov/avi/mxf)'
          required />
        <FormSubtitle>Processing options</FormSubtitle>
        <FormDescription>The more options you choose the longer the processing time</FormDescription>
        <div style={styles.col3}>
          <Field
            component={CheckboxInput}
            label='Process audio'
            name='processAudio'
            style={styles.col} />
          <Field
            component={CheckboxInput}
            label='Process scenes'
            name='processScenes'
            style={styles.col} />
        </div>
      </PersistModal>
    );
  }

}
