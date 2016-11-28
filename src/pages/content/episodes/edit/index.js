import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form/immutable';
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
import Dropzone from '../../../_common/dropzone';
import Header from '../../../app/header';
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/localized';
import Section from '../../../_common/components/section';
import SelectInput from '../../../_common/inputs/selectInput';
import SpecificHeader from '../../header';
import TextInput from '../../../_common/inputs/textInput';
import LanguageBar from '../../../_common/components/languageBar';
import Availabilities from '../../_availabilities/list';
import * as actions from './actions';
import selector from './selector';

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
  loadEpisode: bindActionCreators(actions.loadEpisode, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch)
}))
@reduxForm({
  form: 'episodeEdit',
  validate
})
@Radium
export default class EditEpisodes extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    // Form field.
    availabilities: ImmutablePropTypes.list,
    change: PropTypes.func.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    currentEpisode: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    currentSeasonId: PropTypes.string,
    currentSeriesEntryId: PropTypes.string,
    defaultLocale: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    hasTitle: ImmutablePropTypes.map,
    initialize: PropTypes.func.isRequired,
    loadEpisode: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedSeasonIds: ImmutablePropTypes.map.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seasonsById: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired
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
    if (this.props.params.episodeId) {
      const editObj = await this.props.loadEpisode(this.props.params.episodeId);
      console.log('editObj', editObj);
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

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale, defaultLocale } = this.props;
    dispatch(change(`basedOnDefaultLocale.${defaultLocale}`, false));
    dispatch(change(`basedOnDefaultLocale.${_activeLocale}`, false));
    dispatch(change('defaultLocale', _activeLocale));
/*
    if (basedOnDefaultLocale[defaultLocale.value]) {
      basedOnDefaultLocale[defaultLocale.value].onChange(false);
    }
    defaultLocale.onChange(_activeLocale.value);
    basedOnDefaultLocale[_activeLocale.value].onChange(false);*/
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
    }
  }

  render () {
    const { availabilities, closeModal, currentModal, _activeLocale, currentSeasonId, currentSeriesEntryId, searchSeriesEntries,
        hasTitle, location, currentEpisode, seriesEntriesById, searchedSeriesEntryIds, defaultLocale,
        searchSeasons, seasonsById, searchedSeasonIds, handleSubmit, supportedLocales, errors } = this.props;
    const { styles } = this.constructor;
    return (
      <Root style={styles.backgroundRoot}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        {currentModal === EPISODE_CREATE_LANGUAGE &&
          <CreateLanguageModal
            supportedLocales={supportedLocales}
            onCloseClick={closeModal}
            onCreate={this.languageAdded}/>}
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
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
                  component={SelectInput}
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
                {currentSeriesEntryId && currentSeasonId && <Field
                  component={TextInput}
                  label='Episode number'
                  name='number'
                  placeholder='Episode number'
                  required
                  type='number'/>}
                {currentSeriesEntryId && currentSeasonId && <Field
                  _activeLocale={_activeLocale}
                  component={TextInput}
                  disabled={hasTitle && !hasTitle.get(_activeLocale)}
                  hasTitle={hasTitle}
                  label='Episode title'
                  name={`title.${_activeLocale}`}
                  placeholder='Episode title'
                  required={hasTitle && hasTitle.get(_activeLocale)}/>}
                <Field
                  component={TextInput}
                  // copyFromBase={!isDefaultLocaleSelected}
                  // disabled={copyFromBase && copyFromBase.getIn([ 'description', _activeLocale ])}
                  label='Description'
                  name={`description.${_activeLocale}`}
                  placeholder='Description'
                  type='multiline'/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Profile image' />
                    <Dropzone
                      accept='image/*'
                      imageUrl={currentEpisode.getIn([ 'profileImage', currentEpisode.get('defaultLocale'), 'url' ])}/>
                  </div>
                </div>
              </Section>
            </Tab>
            {/* TODO
            <Tab title='Helpers'>
              <Section>
                <FormSubtitle first>Content</FormSubtitle>
              </Section>
            </Tab>*/}
            <Tab title='Availability'>
              <FieldArray availabilities={availabilities} component={Availabilities} name='availabilities' />
            </Tab>
            {/* TODO
            <Tab title='Audience'>
              <Section>
                <FormSubtitle first>Location</FormSubtitle>
                ...
              </Section>
            </Tab>*/}
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
