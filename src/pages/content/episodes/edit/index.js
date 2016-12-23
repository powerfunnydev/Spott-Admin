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
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/decorators/localized';
import Section from '../../../_common/components/section';
import CheckboxInput from '../../../_common/inputs/checkbox';
import SelectInput from '../../../_common/inputs/selectInput';
import TextInput from '../../../_common/inputs/textInput';
import LanguageBar from '../../../_common/components/languageBar';
import Availabilities from '../../_availabilities/list';
import RelatedVideo from '../../../content/_relatedVideo/read';
import * as actions from './actions';
import selector from './selector';
import Characters from '../../_helpers/_characters/list';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import { POSTER_IMAGE, PROFILE_IMAGE } from '../../../../constants/imageTypes';
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';

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

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  deletePosterImage: bindActionCreators(actions.deletePosterImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  loadEpisode: bindActionCreators(actions.loadEpisode, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  searchContentProducers: bindActionCreators(actions.searchContentProducers, dispatch),
  searchMediumCategories: bindActionCreators(actions.searchMediumCategories, dispatch),
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
@ensureEntityIsSaved
@Radium
export default class EditEpisode extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    addLanguageHasTitle: PropTypes.bool,
    broadcastersById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    characters: ImmutablePropTypes.list,
    charactersById: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    contentProducersById: ImmutablePropTypes.map.isRequired,
    currentEpisode: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    currentSeasonId: PropTypes.string,
    currentSeriesEntryId: PropTypes.string,
    defaultLocale: PropTypes.string,
    deletePosterImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dirty: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    episodeCharacters: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    hasTitle: ImmutablePropTypes.map,
    initialize: PropTypes.func.isRequired,
    loadEpisode: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    mediumCategoriesById: ImmutablePropTypes.map.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchContentProducers: PropTypes.func.isRequired,
    searchMediumCategories: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedContentProducerIds: ImmutablePropTypes.map.isRequired,
    searchedMediumCategoryIds: ImmutablePropTypes.map.isRequired,
    searchedSeasonIds: ImmutablePropTypes.map.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seasonsById: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadPosterImage: PropTypes.func.isRequired,
    uploadProfileImage: PropTypes.func.isRequired,
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
  }

  async componentWillMount () {
    const { episodeId } = this.props.params;
    if (episodeId) {
      const editObj = await this.props.loadEpisode(episodeId);
      console.log('editObj', editObj);
      this.props.initialize({
        ...editObj,
        contentProducers: editObj.contentProducers && editObj.contentProducers.map((bc) => bc.id),
        broadcasters: editObj.broadcasters && editObj.broadcasters.map((bc) => bc.id),
        seasonId: editObj.season.id,
        seriesEntryId: editObj.seriesEntry.id,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo(`content/series/read/${this.props.params.seriesEntryId}/seasons/read/${this.props.params.seasonId}`, true);
  }

  languageAdded (form) {
    const { language, hasTitle, title } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language,
        title: { ...formValues.title, [language]: title },
        hasTitle: { ...formValues.hasTitle, [language]: hasTitle }
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
      this.props.openModal(EPISODE_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    const { initialize, params: { episodeId } } = this.props;
    try {
      await this.props.submit({
        ...form.toJS(),
        episodeId
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
    const styles = this.constructor.styles;
    const {
      _activeLocale, addLanguageHasTitle, closeModal, currentModal, currentSeasonId,
      currentSeriesEntryId, searchSeriesEntries, contentProducersById,
      searchContentProducers, searchedContentProducerIds, broadcastersById,
      searchBroadcasters, searchedBroadcasterIds, hasTitle, location, currentEpisode,
      seriesEntriesById, searchedSeriesEntryIds, defaultLocale,
      searchSeasons, seasonsById, searchedSeasonIds, handleSubmit, supportedLocales, errors,
      searchedCharacterIds, charactersById, searchCharacters, deleteProfileImage, episodeCharacters,
      deletePosterImage, mediumCategoriesById, searchMediumCategories, searchedMediumCategoryIds, location: { query: { tab } }
    } = this.props;
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <BreadCrumbs hierarchy={[
            { title: 'Series', url: '/content/series' },
            { title: currentEpisode.getIn([ 'seriesEntry', 'title' ]), url: `content/series/read/${this.props.params.seriesEntryId}` },
            { title: currentEpisode.getIn([ 'season', 'title' ]), url: `content/series/read/${this.props.params.seriesEntryId}/seasons/read/${this.props.params.seasonId}` },
            { title: currentEpisode.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          {currentModal === EPISODE_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}>
              <Field
                component={TextInput}
                content={
                  <Field
                    component={CheckboxInput}
                    first
                    label='Custom title'
                    name='hasTitle'
                    style={styles.customTitle} />}
                disabled={!addLanguageHasTitle}
                label='Episode title'
                labelStyle={styles.titleLabel}
                name='title'
                placeholder='Episode title'
                required />
            </CreateLanguageModal>}
          <EditTemplate disableSubmit={tab > 1} onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs activeTab={tab} showPublishStatus onBeforeChange={this.props.onBeforeChangeTab} onChange={this.props.onChangeTab}>
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
                <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage} >
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
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(mediumCategory) => mediumCategoriesById.getIn([ mediumCategory, 'name' ])}
                    getOptions={searchMediumCategories}
                    isLoading={searchedMediumCategoryIds.get('_status') === FETCHING}
                    label='Genres'
                    multiselect
                    name='mediumCategories'
                    options={searchedMediumCategoryIds.get('data').toJS()}
                    placeholder='Genres'/>
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
                      <Label text='Poster image' />
                      <Dropzone
                        accept='image/*'
                        downloadUrl={currentEpisode.getIn([ 'posterImage', _activeLocale, 'url' ]) ||
                          currentEpisode.getIn([ 'posterImage', defaultLocale, 'url' ])}
                        imageUrl={currentEpisode.getIn([ 'posterImage', _activeLocale ]) &&
                          `${currentEpisode.getIn([ 'posterImage', _activeLocale, 'url' ])}?height=459&width=310` ||
                          currentEpisode.getIn([ 'posterImage', defaultLocale ]) &&
                          `${currentEpisode.getIn([ 'posterImage', defaultLocale, 'url' ])}?height=459&width=310`}
                        showOnlyUploadedImage
                        type={POSTER_IMAGE}
                        onChange={({ callback, file }) => { this.props.uploadPosterImage({ locale: _activeLocale, episodeId: this.props.params.episodeId, image: file, callback }); }}
                        onDelete={currentEpisode.getIn([ 'posterImage', _activeLocale, 'url' ]) ? () => { deletePosterImage({ locale: _activeLocale, mediumId: currentEpisode.get('id') }); } : null}/>
                    </div>
                    <div style={styles.paddingLeftUploadImage}>
                      <Label text='Profile image' />
                      <Dropzone
                        downloadUrl={currentEpisode.getIn([ 'profileImage', _activeLocale, 'url' ]) ||
                          currentEpisode.getIn([ 'profileImage', defaultLocale, 'url' ])}
                        imageUrl={currentEpisode.getIn([ 'profileImage', _activeLocale ]) &&
                          `${currentEpisode.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360` ||
                          currentEpisode.getIn([ 'profileImage', defaultLocale ]) &&
                          `${currentEpisode.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                        showOnlyUploadedImage
                        type={PROFILE_IMAGE}
                        onChange={({ callback, file }) => { this.props.uploadProfileImage({ locale: _activeLocale, episodeId: this.props.params.episodeId, image: file, callback }); }}
                        onDelete={currentEpisode.getIn([ 'profileImage', _activeLocale, 'url' ]) ? () => { deleteProfileImage({ locale: _activeLocale, mediumId: currentEpisode.get('id') }); } : null}/>
                    </div>
                  </div>
                </Section>
              </Tab>
             <Tab title='Helpers'>
                <Characters
                  charactersById={charactersById}
                  mediumCharacters={episodeCharacters}
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
      </SideMenu>
    );
  }
}
