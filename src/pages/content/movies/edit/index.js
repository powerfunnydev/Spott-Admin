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
import { MOVIE_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import Dropzone from '../../../_common/dropzone/imageDropzone';
import Header from '../../../app/header';
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/decorators/localized';
import Section from '../../../_common/components/section';
import SelectInput from '../../../_common/inputs/selectInput';
import SpecificHeader from '../../header';
import TextInput from '../../../_common/inputs/textInput';
import NumberInput from '../../../_common/inputs/numberInput';
import LanguageBar from '../../../_common/components/languageBar';
import Availabilities from '../../_availabilities/list';
import RelatedVideo from '../../../content/_relatedVideo/read';
import * as actions from './actions';
import selector from './selector';
import Characters from '../../_helpers/_characters/list';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import { POSTER_IMAGE, PROFILE_IMAGE } from '../../../../constants/imageTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, title } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (title && !title[_activeLocale]) { validationErrors.title = validationErrors.title || {}; validationErrors.title[_activeLocale] = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  deletePosterImage: bindActionCreators(actions.deletePosterImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  loadMovie: bindActionCreators(actions.loadMovie, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  searchContentProducers: bindActionCreators(actions.searchContentProducers, dispatch),
  searchMediumCategories: bindActionCreators(actions.searchMediumCategories, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadPosterImage: bindActionCreators(actions.uploadPosterImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch)
}))
@reduxForm({
  form: 'movieEdit',
  validate
})
@Radium
export default class EditMovie extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    broadcastersById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    characters: ImmutablePropTypes.list,
    charactersById: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    contentProducersById: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    currentMovie: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    deletePosterImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadMovie: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    mediumCategoriesById: ImmutablePropTypes.map.isRequired,
    movieCharacters: ImmutablePropTypes.map.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchContentProducers: PropTypes.func.isRequired,
    searchMediumCategories: PropTypes.func.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedContentProducerIds: ImmutablePropTypes.map.isRequired,
    searchedMediumCategoryIds: ImmutablePropTypes.map.isRequired,
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
    const { movieId } = this.props.params;
    if (movieId) {
      const editObj = await this.props.loadMovie(movieId);
      console.log('editObj', editObj);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/movies', true);
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
    this.props.openModal(MOVIE_CREATE_LANGUAGE);
  }

  async submit (form) {
    const { supportedLocales, params: { movieId } } = this.props;
    try {
      await this.props.submit({
        locales: supportedLocales.toArray(),
        movieId,
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
    const styles = this.constructor.styles;
    const {
      _activeLocale, closeModal, currentModal, contentProducersById,
      searchContentProducers, searchMediumCategories, searchedContentProducerIds, broadcastersById,
      searchBroadcasters, searchedBroadcasterIds, location, currentMovie, mediumCategoriesById,
      defaultLocale, handleSubmit, supportedLocales, errors, searchedMediumCategoryIds,
      searchedCharacterIds, charactersById, searchCharacters, deleteProfileImage, movieCharacters,
      deletePosterImage, location: { query: { tab } }
    } = this.props;
    return (
      <Root style={styles.backgroundRoot}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[
          { title: 'Series', url: '/content/movies' },
          { title: currentMovie.getIn([ 'title', defaultLocale ]), url: location } ]}/>
        {currentModal === MOVIE_CREATE_LANGUAGE &&
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
                  component={TextInput}
                  label='Movie title'
                  labelStyle={styles.titleLabel}
                  name={`title.${_activeLocale}`}
                  placeholder='Movie title'
                  required />
                <Field
                  component={TextInput}
                  label='Movie subtitle'
                  labelStyle={styles.titleLabel}
                  name={`subTitle.${_activeLocale}`}
                  placeholder='Movie subtitle'/>
                <Field
                  component={NumberInput}
                  label='Start year'
                  labelStyle={styles.titleLabel}
                  name={`startYear.${_activeLocale}`}
                  placeholder='Start year'/>
                <Field
                  component={NumberInput}
                  label='End year'
                  labelStyle={styles.titleLabel}
                  name={`endYear.${_activeLocale}`}
                  placeholder='End year'/>
                <Field
                  component={SelectInput}
                  disabled={_activeLocale !== defaultLocale}
                  getItemText={(mediumCategory) => mediumCategoriesById.getIn([ mediumCategory, 'name', _activeLocale ])}
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
                      downloadUrl={currentMovie.getIn([ 'posterImage', _activeLocale ]) &&
                        currentMovie.getIn([ 'posterImage', _activeLocale, 'url' ])}
                      imageUrl={currentMovie.getIn([ 'posterImage', _activeLocale ]) &&
                        `${currentMovie.getIn([ 'posterImage', _activeLocale, 'url' ])}?height=459&width=310`}
                      type={POSTER_IMAGE}
                      onChange={({ callback, file }) => { this.props.uploadPosterImage({ movieId: this.props.params.movieId, image: file, callback }); }}
                      onDelete={() => { deletePosterImage({ mediumId: currentMovie.get('id') }); }}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Profile image' />
                    <Dropzone
                      downloadUrl={currentMovie.getIn([ 'profileImage', _activeLocale ]) &&
                        currentMovie.getIn([ 'profileImage', _activeLocale, 'url' ])}
                      imageUrl={currentMovie.getIn([ 'profileImage', _activeLocale ]) &&
                        `${currentMovie.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360`}
                      type={PROFILE_IMAGE}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ movieId: this.props.params.movieId, image: file, callback }); }}
                      onDelete={() => { deleteProfileImage({ mediumId: currentMovie.get('id') }); }}/>
                  </div>
                </div>
              </Section>
            </Tab>
           <Tab title='Helpers'>
              <Characters
                charactersById={charactersById}
                mediumCharacters={movieCharacters}
                mediumId={this.props.params.movieId}
                searchCharacters={searchCharacters}
                searchedCharacterIds={searchedCharacterIds} />
            </Tab>
            <Tab title='Interactive video'>
              <Section>
                <FormSubtitle first>Interactive video</FormSubtitle>
                <Field
                  component={RelatedVideo}
                  medium={currentMovie}
                  name='videoId' />
              </Section>
            </Tab>
            <Tab title='Availability'>
              <Availabilities mediumId={this.props.params.movieId} />
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
