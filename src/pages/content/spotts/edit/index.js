/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import { Root, FormDescription, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { SPOTT_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import { FETCHING } from '../../../../constants/statusTypes';
import CreateLanguageModal from '../../_languageModal/create';
import selector from './selector';
import LanguageBar from '../../../_common/components/languageBar';
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Audiences from '../../_audiences/list';
import Header from '../../../app/multiFunctionalHeader';
import SelectInput from '../../../_common/inputs/selectInput';
import Checkbox from '../../../_common/inputs/checkbox';
import CreateTag from './tags/create';
import Scene from './scene';

const spottCount = 1;

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  // if (!name) { validationErrors.name = t('common.errors.required'); }

// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  loadSpott: bindActionCreators(actions.loadSpott, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchAudienceCountries: bindActionCreators(actions.searchAudienceCountries, dispatch),
  searchAudienceLanguages: bindActionCreators(actions.searchAudienceLanguages, dispatch),
  searchTopics: bindActionCreators(actions.searchTopics, dispatch),
  submit: bindActionCreators(actions.submit, dispatch)
}))
@reduxForm({
  form: 'spottEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditSpott extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentSpott: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    // deleteLogoImage: PropTypes.func.isRequired,
    // deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadSpott: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchAudienceCountries: PropTypes.func.isRequired,
    searchAudienceLanguages: PropTypes.func.isRequired,
    searchTopics: PropTypes.func.isRequired,
    searchedAudienceCountryIds: ImmutablePropTypes.map.isRequired,
    searchedAudienceLanguageIds: ImmutablePropTypes.map.isRequired,
    searchedTopicIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    tags: ImmutablePropTypes.list,
    topicsById: ImmutablePropTypes.map.isRequired,
    onBeforeChangeTab: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
    this.openCreateLanguageModal = :: this.openCreateLanguageModal;
    this.languageAdded = :: this.languageAdded;
    this.removeLanguage = :: this.removeLanguage;
    this.onCreateTag = ::this.onCreateTag;
    this.onSelectionRegion = ::this.onSelectionRegion;
  }

  async componentWillMount () {
    if (this.props.params.spottId) {
      const editObj = await this.props.loadSpott(this.props.params.spottId);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale,
        tags: [], // TODO
        topicIds: editObj.topics.map(({ id }) => id)
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/spotts', true);
  }

  languageAdded (form) {
    const { language, title } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        _activeLocale: language,
        locales: newSupportedLocales.toJS(),
        title: { ...formValues.title, [language]: title }
      }));
    }
    closeModal();
  }

  removeLanguage () {
    const { dispatch, change, supportedLocales, _activeLocale, defaultLocale } = this.props;
    if (_activeLocale) {
      const newSupportedLocales = supportedLocales.delete(supportedLocales.indexOf(_activeLocale));
      dispatch(change('locales', newSupportedLocales));
      dispatch(change('_activeLocale', defaultLocale));
    }
  }

  openCreateLanguageModal () {
    if (this.props.onBeforeChangeTab()) {
      this.props.openModal(SPOTT_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    const { initialize, params: { spottId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        spottId
      });
      await initialize(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
  }

  onCreateTag (tag) {
    const { change, dispatch, tags } = this.props;
    console.warn('Created new tag', tag);
    const newTags = tags.push(tag);
    dispatch(change('tags', newTags));
    console.warn('Tags', newTags.toJS());
  }

  onSelectionRegion (point, region) {
    this.setState({ ...this.state, point, region, modal: 'createTag' });
  }

  static styles = {
    selectInput: {
      paddingTop: 0,
      width: '180px'
    },
    background: {
      backgroundColor: colors.lightGray4
    },
    paddingTop: {
      paddingTop: '1.25em'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    backgroundRoot: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    paddingLeftUploadImage: {
      paddingLeft: '24px'
    },
    description: {
      marginBottom: '1.25em'
    },
    imageDropzone: {
      width: '100%',
      height: '100px'
    },
    faceImagesContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: '20px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      _activeLocale, errors, currentModal, closeModal, supportedLocales, defaultLocale,
      currentSpott, location, handleSubmit, location: { query: { tab } },
      searchAudienceCountries, searchAudienceLanguages, searchedAudienceCountryIds, searchedAudienceLanguageIds,
      searchTopics, searchedTopicIds, topicsById
    } = this.props;

    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
            { title: 'Spotts', url: '/content/spotts' },
            { title: currentSpott.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          {currentModal === SPOTT_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}>
              <Field
                component={TextInput}
                label='Title'
                name='title'
                placeholder='Title'
                required />
            </CreateLanguageModal>}
          {this.state.modal === 'createTag' &&
            <CreateTag
              initialValues={{
                entityType: 'PRODUCT',
                point: this.state.point,
                region: this.state.region,
                relevance: 'EXACT'
              }}
              onClose={() => this.setState({ ...this.state, modal: null })}
              onSubmit={this.onCreateTag}/>}
          <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs activeTab={tab} showPublishStatus onBeforeChange={this.props.onBeforeChangeTab} onChange={this.props.onChangeTab}>
              <Tab title='Details'>
                <div style={{ display: 'flex', marginTop: -1 }}>
                  <div style={{ width: '40%' }}>
                    <Section style={{ marginTop: 0, marginRight: -1 }}>
                      {currentSpott.get('image') &&
                        <Scene
                          imageUrl={currentSpott.getIn([ 'image', 'url' ])}
                          onSelectionRegion={this.onSelectionRegion}/>}
                    </Section>
                  </div>
                  <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                    <Section noPadding style={[ styles.background, { marginTop: 0 } ]}>
                      <LanguageBar
                        _activeLocale={_activeLocale}
                        defaultLocale={defaultLocale}
                        errors={errors}
                        openCreateLanguageModal={this.openCreateLanguageModal}
                        removeLanguage={this.removeLanguage}
                        supportedLocales={supportedLocales}
                        onSetDefaultLocale={this.onSetDefaultLocale}/>
                    </Section>
                    <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage} style={{ height: '100%' }}>
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
                        placeholder='Topics'/>
                  </Section>
                </div>
              </div>
            </Tab>
            <Tab title='Promote'>
              <Section>
                <FormSubtitle first>Promote this spott</FormSubtitle>
                <FormDescription style={styles.description}>When you promote a spott, users that are in the target audience will see this on the homepage. Promoted spotts will have a label “Promoted” on them.</FormDescription>
                <Field
                  component={Checkbox}
                  first
                  label='Promote this spott'
                  name='promoted'/>
              </Section>
            </Tab>
            <Tab title='Audience'>
              <Audiences
                mediumId={this.props.params.spottId}
                mediumType='spott'
                searchCountries={searchAudienceCountries}
                searchLanguages={searchAudienceLanguages}
                searchedCountryIds={searchedAudienceCountryIds}
                searchedLanguageIds={searchedAudienceLanguageIds}/>
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    </SideMenu>
    );
  }

}
