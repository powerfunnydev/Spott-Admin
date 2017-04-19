import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
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
import Scene from './scene';

import * as actions from '../actions';
import { persistCropSelector } from '../selector';

function renderScene ({ appearances, imageUrl, input, tags, onChange }) {
  const region = input.value && input.value.toJS ? input.value.toJS() : input.value;
  return (
    <Scene
      appearances={appearances}
      imageUrl={imageUrl}
      region={region}
      onSelectionRegion={(newRegion) => {
        onChange(newRegion);
        input.onChange(newRegion);
      }}/>
  );
}

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, region, sceneId, title } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!region) { validationErrors.region = t('common.errors.required'); }
  if (!sceneId) { validationErrors.sceneId = t('common.errors.required'); }
  if (title && !title[_activeLocale]) {
    validationErrors.title = validationErrors.title || {};
    validationErrors.title[_activeLocale] = t('common.errors.required');
  }
  console.warn('errors', validationErrors);
  // Done
  return validationErrors;
}

@localized
@connect(persistCropSelector, (dispatch) => ({
  loadAppearances: bindActionCreators(actions.loadAppearances, dispatch),
  loadCropTopics: bindActionCreators(actions.fetchCropTopics, dispatch),
  searchTopics: bindActionCreators(actions.searchTopics, dispatch)
}))
@reduxForm({
  form: 'cropPersist',
  validate
})
@Radium
export default class PersistCrop extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    currentScene: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadAppearances: PropTypes.func.isRequired,
    loadCropTopics: PropTypes.func.isRequired,
    scene: ImmutablePropTypes.map,
    searchTopics: PropTypes.func.isRequired,
    searchedTopicIds: ImmutablePropTypes.map.isRequired,
    submitButtonText: PropTypes.string,
    t: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    topicIds: PropTypes.array,
    topicsById: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
  }

  componentDidMount () {
    const { currentScene, loadAppearances } = this.props;
    loadAppearances(currentScene.get('id'));
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
      _activeLocale, appearances, currentScene, handleSubmit, loadCropTopics, searchTopics, searchedTopicIds,
      submitButtonText, title, topicsById, onClose
    } = this.props;
    console.warn('appearances', appearances && appearances.toJS());
    return (
      <PersistModal isOpen style={styles.modal} submitButtonText={submitButtonText} title={title} onClose={onClose} onSubmit={handleSubmit(this.submit)}>
        <div style={{ display: 'flex', marginTop: -1 }}>
          <div style={{ width: '65%' }}>
            <Section innerStyle={{ paddingBottom: 0, paddingTop: 0 }} style={{ backgroundColor: 'none', marginTop: 0, marginRight: -1 }}>
              <Field
                appearances={appearances}
                component={renderScene}
                imageUrl={currentScene.get('imageUrl')}
                name='region'
                onChange={async (region) => {
                  const { change, dispatch, loadCropTopics, topicIds } = this.props;
                  if (topicIds) {
                    // Load the topics inside the crop. Make sure these are selected.
                    const { data: topics } = await loadCropTopics({ region, sceneId: currentScene.get('id') });
                    for (const { id } of topics) {
                      if (topicIds.indexOf(id) === -1) {
                        topicIds.push(id);
                      }
                    }
                    dispatch(change('topicIds', topicIds));
                  }
                }}/>
            </Section>
          </div>
          <div style={{ width: '35%', display: 'flex', flexDirection: 'column' }}>
            <Section clearPopUpMessage={this.props.closePopUpMessage} innerStyle={{ paddingBottom: 0, paddingTop: 0 }} popUpObject={this.props.popUpMessage} style={{ backgroundColor: 'none', height: '100%' }}>
              <Field
                component={TextInput}
                first
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
                getItemText={(id) => `(${topicsById.getIn([ id, 'sourceType' ]) && topicsById.getIn([ id, 'sourceType' ]).toLowerCase()}) ${topicsById.getIn([ id, 'text' ])}`}
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
