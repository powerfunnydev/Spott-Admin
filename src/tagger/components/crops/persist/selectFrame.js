import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { EditTemplate, FormSubtitle } from '../../../../pages/_common/styles';
import Section from '../../../../pages/_common/section';
import SelectInput from '../../../../pages/_common/inputs/selectInput';
import RadioInput from '../../../../pages/_common/inputs/radioInput';
import TextInput from '../../../../pages/_common/inputs/textInput';
import localized from '../../../../pages/_common/decorators/localized';
import PersistModal, { dialogStyle } from '../../../../pages/_common/components/persistModal';
import { FETCHING } from '../../../../constants/statusTypes';
import { slowdown } from '../../../../utils';
import Frame from '../../_helpers/frame';
import { selectCropSelector } from '../selector';

import * as actions from '../actions';

function validate (values, { t }) {
  const validationErrors = {};
  const { currentSceneId } = values.toJS();
  if (!currentSceneId) { validationErrors.currentSceneId = t('common.errors.required'); }

  // Done
  return validationErrors;
}

const containerStyle = {
  height: 450,
  overflowY: 'auto'
};
function renderFrameSelect ({ input, scenes }) {
  const currentSceneId = input.value;
  return (
    <div style={containerStyle}>
      {scenes.map((frame, j) => (
        <Frame
          frame={frame}
          isSelected={currentSceneId === frame.get('id')}
          key={frame.get('id')}
          procentualHeightOfWidth={60}
          procentualWidth={100 / 6}
          size='small'
          onClickFrame={() => input.onChange(frame.get('id'))}/>
      ))}
    </div>
  );
}

@connect(selectCropSelector)
@localized
@reduxForm({
  form: 'selectFrame',
  validate
})
@Radium
export default class SelectFrame extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    scenes: ImmutablePropTypes.list.isRequired,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
  }

  async submit (form) {
    try {
      const { onSubmit } = this.props;
      await onSubmit(form.toJS());
      this.props.onClose();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    modal: {
      ...dialogStyle,
      content: {
        ...dialogStyle.content,
        maxHeight: '95%',
        maxWidth: '90%'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { handleSubmit, scenes, onClose } = this.props;
    return (
      <PersistModal isOpen style={styles.modal} submitButtonText='Next' title='Select a scene to crop' onClose={onClose} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={renderFrameSelect}
          name='sceneId'
          scenes={scenes}/>
      </PersistModal>
    );
  }

}
