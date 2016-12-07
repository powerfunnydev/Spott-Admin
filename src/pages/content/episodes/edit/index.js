import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FETCHING } from '../../../../constants/statusTypes';
import { makeTextStyle, fontWeights, Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { EPISODE_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import Dropzone from '../../../_common/dropzone/imageDropzone';
import Header from '../../../app/header';
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/decorators/localized';
import Section from '../../../_common/components/section';
import CheckboxInput from '../../../_common/inputs/checkbox';
import SelectInput from '../../../_common/inputs/selectInput';
import SpecificHeader from '../../header';
import TextInput from '../../../_common/inputs/textInput';
import LanguageBar from '../../../_common/components/languageBar';
import Availabilities from '../../_availabilities/list';
import RelatedVideo from '../../../content/_relatedVideo/read';
import * as actions from './actions';
import selector from './selector';
import Characters from '../../_helpers/_characters/list';
import BreadCrumbs from '../../../_common/components/breadCrumbs';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, seriesEntryId, seasonId, title, hasTitle } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!seriesEntryId) { validationErrors.seriesEntryId = t('common.errors.required'); }
  if (!seasonId) { validationErrors.seasonId = t('common.errors.required'); }
  if (hasTitle && title && hasTitle[_activeLocale] && !title[_activeLocale]) { validationErrors.title = validationErrors.title || {}; validationErrors.title[_activeLocale] = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  deletePosterImage: bindActionCreators(actions.deletePosterImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  loadEpisode: bindActionCreators(actions.loadEpisode, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  loadMediumCharacters: bindActionCreators(actions.searchMediumCharacters, dispatch),
  searchContentProducers: bindActionCreators(actions.searchContentProducers, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadPosterImage: bindActionCreators(actions.uploadPosterImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch)
}))
@reduxForm({
  form: 'episodeEdit',
  validate
})
@Radium
export default class EditEpisode extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    broadcastersById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    characters: ImmutablePropTypes.list,
    charactersById: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    contentProducersById: ImmutablePropTypes.map.isRequired,
    currentEpisode: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    currentSeasonId: PropTypes.string,
    currentSeriesEntryId: PropTypes.string,
    defaultLocale: PropTypes.string,
    deletePosterImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    episodeCharacterIds: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    hasTitle: ImmutablePropTypes.map,
    initialize: PropTypes.func.isRequired,
    loadEpisode: PropTypes.func.isRequired,
    loadMediumCharacters: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchContentProducers: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedContentProducerIds: ImmutablePropTypes.map.isRequired,
    searchedSeasonIds: ImmutablePropTypes.map.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seasonsById: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadPosterImage: PropTypes.func.isRequired,
    uploadProfileImage: PropTypes.func.isRequired

  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
    this.openCreateLanguageModal = :: this.openCreateLanguageModal;
    this.languageAdded = :: this.languageAdded;
    this.removeLanguage = :: this.removeLanguage;
    this.onChangeTab = ::this.onChangeTab;
  }

  async componentWillMount () {
    const { episodeId } = this.props.params;
    if (episodeId) {
      const editObj = await this.props.loadEpisode(episodeId);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/series', true);
  }

  languageAdded (form) {
    const { language } = form && form.toJS();
    const { closeModal, dispatch, change, supportedLocales } = this.props;
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      dispatch(change('locales', newSupportedLocales));
      dispatch(change('_activeLocale', language));
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
    this.props.openModal(EPISODE_CREATE_LANGUAGE);
  }

  async submit (form) {
    const { supportedLocales, params: { episodeId } } = this.props;
    try {
      await this.props.submit({
        locales: supportedLocales.toArray(),
        episodeId,
        ...form.toJS()
      });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onChangeTab (tab) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tab } });
  }

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
  }

  static styles = {
    topBar: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '22.5px',
      paddingRight: '22.5px'
    },
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
    baseLanguageButton: {
      paddingTop: '3px',
      paddingBottom: '3px',
      ...makeTextStyle(fontWeights.regular, '11px')
    },
    removeLanguageButton: {
      width: '20px',
      height: '21px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '2px'
    },
    removeLanguageButtonPadding: {
      paddingLeft: '10px'
    },
    paddingLeftUploadImage: {
      paddingLeft: '24px'
    },
    customTitle: {
      paddingBottom: '0.438em'
    },
    titleLabel: {
      paddingBottom: '0.7em'
    }
  }

  render () {
    const {
      _activeLocale, closeModal, currentModal, currentSeasonId,
      currentSeriesEntryId, episodeCharacterIds, searchSeriesEntries, contentProducersById,
      searchContentProducers, searchedContentProducerIds, broadcastersById,
      searchBroadcasters, searchedBroadcasterIds, hasTitle, location, currentEpisode,
      seriesEntriesById, searchedSeriesEntryIds, defaultLocale,
      searchSeasons, seasonsById, searchedSeasonIds, handleSubmit, supportedLocales, errors,
      searchedCharacterIds, charactersById, searchCharacters, loadMediumCharacters, deleteProfileImage,
      deletePosterImage, location: { query: { tab } }
    } = this.props;
    const { styles } = this.constructor;

    console.warn('TAB', tab);
    return (
      <Root style={styles.backgroundRoot}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[
          { title: 'List', url: '/content/series' },
          { title: 'Series', url: `content/series/read/${this.props.params.seriesEntryId}` },
          { title: 'Season', url: `content/series/read/${this.props.params.seriesEntryId}/seasons/read/${this.props.params.seasonId}` },
          { title: currentEpisode.getIn([ 'title', defaultLocale ]), url: location } ]}/>
        {currentModal === EPISODE_CREATE_LANGUAGE &&
          <CreateLanguageModal
            supportedLocales={supportedLocales}
            onCloseClick={closeModal}
            onCreate={this.languageAdded}/>}
        <EditTemplate disableSubmit={tab > 1} onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs activeTab={tab} showPublishStatus onChange={this.onChangeTab}>
            <Tab title='Details'>
              <Section noPadding style={styles.background}>
                <LanguageBar
                  _activeLocale={_activeLocale}
                  defaultLocale={defaultLocale}
                  errors={errors}
                  openCreateLanguageModal={this.openCreateLanguageModal}
                  removeLanguage={this.removeLanguage}
                  supportedLocales={supportedLocales}
                  onSetDefaultLocale={this.onSetDefaultLocale}/>
              </Section>
              <Section>
                <FormSubtitle first>General</FormSubtitle>
                <Field
                  component={SelectInput}
                  disabled={_activeLocale !== defaultLocale}
                  getItemText={(id) => seriesEntriesById.getIn([ id, 'title' ])}
                  getOptions={searchSeriesEntries}
                  isLoading={searchedSeriesEntryIds.get('_status') === FETCHING}
                  label='Series title'
                  name='seriesEntryId'
                  options={searchedSeriesEntryIds.get('data').toJS()}
                  placeholder='Series title'
                  required
                  onChange={() => {
                    this.props.dispatch(this.props.change('seasonId', null));
                  }} />
                {currentSeriesEntryId &&
                  <Field
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(id) => seasonsById.getIn([ id, 'title' ])}
                    getOptions={(searchString) => { searchSeasons(searchString, currentSeriesEntryId); }}
                    isLoading={searchedSeasonIds.get('_status') === FETCHING}
                    label='Season title'
                    name='seasonId'
                    options={searchedSeasonIds.get('data').toJS()}
                    placeholder='Season title'
                    required
                    onChange={() => {
                      this.props.dispatch(this.props.change('title', {}));
                    }} />}
                {currentSeriesEntryId && currentSeasonId &&
                  <Field
                    component={TextInput}
                    disabled={_activeLocale !== defaultLocale}
                    label='Episode number'
                    name='number'
                    placeholder='Episode number'
                    required
                    type='number'/>}
                {currentSeriesEntryId && currentSeasonId &&
                  <Field
                    component={TextInput}
                    content={
                      <Field
                        component={CheckboxInput}
                        first
                        label='Custom title'
                        name={`hasTitle.${_activeLocale}`}
                        style={styles.customTitle} />}
                    disabled={hasTitle && !hasTitle.get(_activeLocale)}
                    label='Episode title'
                    labelStyle={styles.titleLabel}
                    name={`title.${_activeLocale}`}
                    placeholder='Episode title'
                    required />}
                <Field
                  component={TextInput}
                  label='Description'
                  name={`description.${_activeLocale}`}
                  placeholder='Description'
                  type='multiline'/>
                <Field
                  component={SelectInput}
                  disabled={_activeLocale !== defaultLocale}
                  getItemText={(contentProducerId) => contentProducersById.getIn([ contentProducerId, 'name' ])}
                  getOptions={searchContentProducers}
                  isLoading={searchedContentProducerIds.get('_status') === FETCHING}
                  label='Content producers'
                  multiselect
                  name='contentProducers'
                  options={searchedContentProducerIds.get('data').toJS()}
                  placeholder='Content producers'/>
                <Field
                  component={SelectInput}
                  disabled={_activeLocale !== defaultLocale}
                  getItemText={(broadcasterId) => broadcastersById.getIn([ broadcasterId, 'name' ])}
                  getOptions={searchBroadcasters}
                  isLoading={searchedBroadcasterIds.get('_status') === FETCHING}
                  label='Broadcasters'
                  multiselect
                  name='broadcasters'
                  options={searchedBroadcasterIds.get('data').toJS()}
                  placeholder='Broadcaster companies'/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Profile image' />
                    <Dropzone
                      accept='image/*'
                      downloadUrl={currentEpisode.getIn([ 'profileImage', _activeLocale ]) &&
                        currentEpisode.getIn([ 'profileImage', _activeLocale, 'url' ])}
                      imageUrl={currentEpisode.getIn([ 'profileImage', _activeLocale ]) &&
                        `${currentEpisode.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ episodeId: this.props.params.episodeId, image: file, callback }); }}
                      onDelete={() => { deleteProfileImage({ mediumId: currentEpisode.get('id') }); }}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Poster image' />
                    <Dropzone
                      accept='image/*'
                      downloadUrl={currentEpisode.getIn([ 'posterImage', _activeLocale ]) &&
                        currentEpisode.getIn([ 'posterImage', _activeLocale, 'url' ])}
                      imageUrl={currentEpisode.getIn([ 'posterImage', _activeLocale ]) &&
                        `${currentEpisode.getIn([ 'posterImage', _activeLocale, 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadPosterImage({ episodeId: this.props.params.episodeId, image: file, callback }); }}
                      onDelete={() => { deletePosterImage({ mediumId: currentEpisode.get('id') }); }}/>
                  </div>
                </div>
              </Section>
            </Tab>
           <Tab title='Helpers'>
              <Characters
                charactersById={charactersById}
                loadMediumCharacters={loadMediumCharacters}
                mediumCharacterIds={episodeCharacterIds}
                mediumId={this.props.params.episodeId}
                searchCharacters={searchCharacters}
                searchedCharacterIds={searchedCharacterIds} />
            </Tab>
            <Tab title='Interactive video'>
              <Section>
                <FormSubtitle first>Interactive video</FormSubtitle>
                <Field
                  component={RelatedVideo}
                  medium={currentEpisode}
                  name='videoId' />
              </Section>
            </Tab>
            <Tab title='Availability'>
              <Availabilities mediumId={this.props.params.episodeId} />
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
