import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FETCHING } from '../../../../constants/statusTypes';
import { makeTextStyle, fontWeights, Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import * as actions from './actions';
import { SEASON_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import Dropzone from '../../../_common/dropzone/imageDropzone';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/decorators/localized';
import Section from '../../../_common/components/section';
import SelectInput from '../../../_common/inputs/selectInput';
import CheckboxInput from '../../../_common/inputs/checkbox';
import TextInput from '../../../_common/inputs/textInput';
import LanguageBar from '../../../_common/components/languageBar';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import { POSTER_IMAGE, PROFILE_IMAGE } from '../../../../constants/imageTypes';
import selector from './selector';
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, seriesEntryId, title, hasTitle } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!seriesEntryId) { validationErrors.seriesEntryId = t('common.errors.required'); }
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
  loadSeason: bindActionCreators(actions.loadSeason, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadPosterImage: bindActionCreators(actions.uploadPosterImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch)
}))
@reduxForm({
  form: 'seasonEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditSeason extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    addLanguageHasTitle: PropTypes.bool,
    change: PropTypes.func.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentSeason: ImmutablePropTypes.map.isRequired,
    currentSeasonId: PropTypes.string,
    currentSeriesEntryId: PropTypes.string,
    defaultLocale: PropTypes.string,
    deletePosterImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dirty: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    hasTitle: ImmutablePropTypes.map,
    initialize: PropTypes.func.isRequired,
    loadSeason: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
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
    if (this.props.params.seasonId) {
      const editObj = await this.props.loadSeason(this.props.params.seasonId);
      this.props.initialize({
        ...editObj,
        seriesEntryId: editObj.seriesEntry.id,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo(`content/series/read/${this.props.params.seriesEntryId}`, true);
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
      this.props.openModal(SEASON_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    const { initialize, params: { seasonId } } = this.props;
    try {
      await this.props.submit({
        ...form.toJS(),
        seasonId
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
    const { addLanguageHasTitle, closeModal, currentModal, _activeLocale, currentSeriesEntryId, searchSeriesEntries,
        hasTitle, location, currentSeason, seriesEntriesById, searchedSeriesEntryIds, defaultLocale,
        handleSubmit, supportedLocales, errors, deleteProfileImage, deletePosterImage, location: { query: { tab } } } = this.props;
    const { styles } = this.constructor;
    return (
      <SideMenu location={location}>
        <Root style={styles.backgroundRoot}>
          <BreadCrumbs hierarchy={[
            { title: 'Series', url: '/content/series' },
            { title: currentSeason.getIn([ 'seriesEntry', 'title' ]), url: `content/series/read/${this.props.params.seriesEntryId}` },
            { title: currentSeason.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          {currentModal === SEASON_CREATE_LANGUAGE &&
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
                label='Season title'
                labelStyle={styles.titleLabel}
                name='title'
                placeholder='Season title'
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
                <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage}>
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
                  {currentSeriesEntryId && <Field
                    component={TextInput}
                    disabled={_activeLocale !== defaultLocale}
                    label='Season number'
                    name='number'
                    placeholder='Season number'
                    required
                    type='number'/>}
                  {currentSeriesEntryId &&
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
                      label='Season title'
                      labelStyle={styles.titleLabel}
                      name={`title.${_activeLocale}`}
                      placeholder='Season title'
                      required />}
                  <Field
                    component={TextInput}
                    label='Description'
                    name={`description.${_activeLocale}`}
                    placeholder='Description'
                    type='multiline'/>
                  <FormSubtitle>Images</FormSubtitle>
                  <div style={[ styles.paddingTop, styles.row ]}>
                    <div>
                      <Label text='Poster image' />
                      <Dropzone
                        accept='image/*'
                        downloadUrl={currentSeason.getIn([ 'posterImage', _activeLocale, 'url' ]) ||
                          currentSeason.getIn([ 'posterImage', defaultLocale, 'url' ])}
                        imageUrl={currentSeason.getIn([ 'posterImage', _activeLocale ]) &&
                          `${currentSeason.getIn([ 'posterImage', _activeLocale, 'url' ])}?height=459&width=310` ||
                          currentSeason.getIn([ 'posterImage', defaultLocale ]) &&
                          `${currentSeason.getIn([ 'posterImage', defaultLocale, 'url' ])}?height=459&width=310`}
                        showOnlyUploadedImage
                        type={POSTER_IMAGE}
                        onChange={({ callback, file }) => { this.props.uploadPosterImage({ locale: _activeLocale, seasonId: this.props.params.seasonId, image: file, callback }); }}
                        onDelete={currentSeason.getIn([ 'posterImage', _activeLocale, 'url' ]) ? () => { deletePosterImage({ locale: _activeLocale, mediumId: currentSeason.get('id') }); } : null}/>
                    </div>
                    <div style={styles.paddingLeftUploadImage}>
                      <Label text='Profile image' />
                      <Dropzone
                        accept='image/*'
                        downloadUrl={currentSeason.getIn([ 'profileImage', _activeLocale, 'url' ]) ||
                          currentSeason.getIn([ 'profileImage', defaultLocale, 'url' ])}
                        imageUrl={currentSeason.getIn([ 'profileImage', _activeLocale ]) &&
                          `${currentSeason.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360` ||
                          currentSeason.getIn([ 'profileImage', defaultLocale ]) &&
                          `${currentSeason.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                        showOnlyUploadedImage
                        type={PROFILE_IMAGE}
                        onChange={({ callback, file }) => { this.props.uploadProfileImage({ locale: _activeLocale, seasonId: this.props.params.seasonId, image: file, callback }); }}
                        onDelete={currentSeason.getIn([ 'profileImage', _activeLocale, 'url' ]) ? () => { deleteProfileImage({ locale: _activeLocale, mediumId: currentSeason.get('id') }); } : null}/>
                    </div>
                  </div>
                </Section>
              </Tab>
            </Tabs>
          </EditTemplate>
        </Root>
      </SideMenu>
    );
  }
}
