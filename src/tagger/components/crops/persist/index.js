/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { colors } from '../../../../pages/_common/styles';
import CreateLanguageModal from '../../../../pages/content/_languageModal/create';
import LanguageBar from '../../../../pages/_common/components/languageBar';
import Section from '../../../../pages/_common/section';
import SelectInput from '../../../../pages/_common/inputs/selectInput';
import TextInput from '../../../../pages/_common/inputs/textInput';
import localized from '../../../../pages/_common/decorators/localized';
import PersistModal, { dialogStyle } from '../../../../pages/_common/components/persistModal';
import { FETCHING } from '../../../../constants/statusTypes';
import Scene from './scene';

import * as actions from '../actions';
import { persistCropSelector } from '../selector';

function renderScene ({ appearances, imageUrl, input, tags, onChange }) {
  const region = input.value && input.value.toJS ? input.value.toJS() : input.value || null;
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
  if (!title || !title[_activeLocale]) {
    validationErrors.title = validationErrors.title || {};
    validationErrors.title[_activeLocale] = t('common.errors.required');
  }
  // Done
  return validationErrors;
}

@localized
@connect(persistCropSelector, (dispatch) => ({
  loadAppearances: bindActionCreators(actions.loadAppearances, dispatch),
  loadCropTopics: bindActionCreators(actions.fetchCropTopics, dispatch),
  persistTopic: bindActionCreators(actions.persistTopic, dispatch),
  searchTopics: bindActionCreators(actions.searchTopics, dispatch)
}))
@reduxForm({
  form: 'cropPersist',
  validate
})
@Radium
export default class PersistCrop extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    appearances: ImmutablePropTypes.list,
    change: PropTypes.func.isRequired,
    currentScene: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadAppearances: PropTypes.func.isRequired,
    loadCropTopics: PropTypes.func.isRequired,
    persistTopic: PropTypes.func.isRequired,
    scene: ImmutablePropTypes.map,
    searchTopics: PropTypes.func.isRequired,
    searchedTopicIds: ImmutablePropTypes.map.isRequired,
    submitButtonText: PropTypes.string,
    supportedLocales: PropTypes.any,
    t: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    topicIds: PropTypes.array,
    topicsById: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.languageAdded = ::this.languageAdded;
    this.removeLanguage = ::this.removeLanguage;
    this.submit = ::this.submit;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
    this.onCreateTopic = ::this.onCreateTopic;
  }

  componentDidMount () {
    const { currentScene, loadAppearances } = this.props;
    loadAppearances(currentScene.get('id'));
  }

  languageAdded (form) {
    const { language } = form && form.toJS();
    const { dispatch, change, supportedLocales } = this.props;
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      dispatch(change('locales', newSupportedLocales));
      dispatch(change('_activeLocale', language));
    }
    this.setState({ modal: null });
  }

  removeLanguage () {
    const { dispatch, change, supportedLocales, _activeLocale, defaultLocale } = this.props;
    if (_activeLocale) {
      const newSupportedLocales = supportedLocales.delete(supportedLocales.indexOf(_activeLocale));
      dispatch(change('locales', newSupportedLocales));
      dispatch(change('_activeLocale', defaultLocale));
    }
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

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
  }

  async onCreateTopic (text) {
    const { change, dispatch, persistTopic, topicIds = [] } = this.props;
    const { id } = await persistTopic({ text });
    console.warn('id:', id);
    console.log('topics:', topicIds);
    const newTopicIds = [ ...topicIds ];
    newTopicIds.push(id);
    dispatch(change('topicIds', newTopicIds));
  }

  static styles = {
    languageSection: {
      backgroundColor: colors.lightGray4,
      borderBottom: `1px solid ${colors.lightGray2}`
    },
    languageSectionInner: {
      paddingBottom: 0,
      paddingTop: 0
    },
    modal: {
      ...dialogStyle,
      content: {
        ...dialogStyle.content,
        maxHeight: '95%',
        maxWidth: '90%'
      }
    },
    modalContent: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      _activeLocale, appearances, currentScene, defaultLocale, errors, handleSubmit,
      searchTopics, searchedTopicIds, supportedLocales,
      submitButtonText, title, topicsById, onClose
    } = this.props;
    const currentModal = this.state.modal;
    return (
      <PersistModal contentStyle={styles.modalContent} isOpen style={styles.modal} submitButtonText={submitButtonText} title={title} onClose={onClose} onSubmit={handleSubmit(this.submit)}>
        {currentModal === 'createLanguage' &&
          <CreateLanguageModal
            supportedLocales={supportedLocales}
            onCloseClick={() => this.setState({ modal: null })}
            onCreate={this.languageAdded}/>}
        <div style={{ display: 'flex' }}>
          <div style={{ width: '60%', padding: '1.5em', borderRight: `1px solid ${colors.lightGray2}` }}>
            <Section innerStyle={{ paddingBottom: 0, paddingTop: 0 }} style={{ backgroundColor: 'none', marginTop: 0 }}>
              <Field
                appearances={appearances}
                component={renderScene}
                imageUrl={currentScene.get('imageUrl')}
                name='region'
                onChange={async (region) => {
                  const { change, dispatch, loadCropTopics, topicIds = [] } = this.props;
                  // Load the topics inside the crop. Make sure these are selected.
                  const { data: topics } = await loadCropTopics({ region, sceneId: currentScene.get('id') });
                  // Here we create a new Array, otherwise redux-form won't update the form.
                  const newTopicIds = [ ...topicIds ];
                  for (const { id } of topics) {
                    if (newTopicIds.indexOf(id) === -1) {
                      newTopicIds.push(id);
                    }
                  }
                  dispatch(change('topicIds', newTopicIds));
                }}/>
            </Section>
          </div>
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
            <Section innerStyle={styles.languageSectionInner} style={styles.languageSection}>
              <LanguageBar
                _activeLocale={_activeLocale}
                defaultLocale={defaultLocale}
                errors={errors}
                openCreateLanguageModal={() => this.setState({ modal: 'createLanguage' })}
                removeLanguage={this.removeLanguage}
                supportedLocales={supportedLocales}
                onSetDefaultLocale={this.onSetDefaultLocale}/>
            </Section>
            <Section innerStyle={{ paddingLeft: 22.5, paddingRight: 22.5, paddingBottom: 15, paddingTop: 15 }} style={{ backgroundColor: 'none', height: '100%' }}>
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
                getItemImage={(id) => topicsById.getIn([ id, 'icon', 'url' ])}
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
