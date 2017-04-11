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

import * as actions from '../actions';
import { persistCropSelector } from '../selector';

@localized
@connect(persistCropSelector, (dispatch) => ({
  searchTopics: bindActionCreators(actions.searchTopics, dispatch)
}))
@reduxForm({
  form: 'cropPersist',
  validate: () => ({})
})
@Radium
export default class PersistCrop extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    scene: ImmutablePropTypes.map,
    searchTopics: PropTypes.func.isRequired,
    searchedTopicIds: ImmutablePropTypes.map.isRequired,
    submitButtonText: PropTypes.string,
    t: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    topicsById: ImmutablePropTypes.map.isRequired,
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
    const {
      _activeLocale, currentScene, handleSubmit, searchTopics, searchedTopicIds,
      submitButtonText, title, topicsById, onClose
    } = this.props;
    return (
      <PersistModal isOpen style={styles.modal} submitButtonText={submitButtonText} title={title} onClose={onClose} onSubmit={handleSubmit(this.submit)}>
        <div style={{ display: 'flex', marginTop: -1 }}>
          <div style={{ width: '40%' }}>
            <Section style={{ backgroundColor: 'none', marginTop: 0, marginRight: -1 }}>
              {/* {currentSpott.get('image') &&
                <Scene
                  imageUrl={currentSpott.getIn([ 'image', 'url' ])}
                  tags={tags}
                  onChangeImage={this.onChangeImage}
                  onEditTag={this.onEditTag}
                  onMoveTag={this.onMoveTag}
                  onRemoveTag={this.onRemoveTag}
                  onSelectionRegion={this.onSelectionRegion}/>} */}
            </Section>
          </div>
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
            <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage} style={{ backgroundColor: 'none', height: '100%', paddingTop: 0 }}>
              <FormSubtitle first>General</FormSubtitle>
              <Field
                component={TextInput}
                label='Title'
                name={`title.${_activeLocale}`}
                placeholder='Title'
                required/>
              <Field
                component={TextInput}
                label='Comment'
                name={`comment.${_activeLocale}`}
                placeholder='Comment'/>
              <Field
                component={SelectInput}
                getItemText={(id) => topicsById.getIn([ id, 'text' ])}
                getOptions={searchTopics}
                isLoading={searchedTopicIds.get('_status') === FETCHING}
                label='Topics'
                multiselect
                name='topicIds'
                options={searchedTopicIds.get('data').toJS()}
                placeholder='Topics'
                onCreateOption={this.onCreateTopic}/>
              </Section>
            </div>
          </div>
      </PersistModal>
    );
  }

}
