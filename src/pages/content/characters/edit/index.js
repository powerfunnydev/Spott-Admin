import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
import Header from '../../../app/header';
// import Line from '../../../_common/components/line';
import { Root, FormSubtitle, colors, EditTemplate, FormDescription } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import SpecificHeader from '../../header';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Label from '../../../_common/inputs/_label';
import selector from './selector';
import { CHARACTER_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import { FETCHING } from '../../../../constants/statusTypes';
import CreateLanguageModal from '../../_languageModal/create';
import LanguageBar from '../../../_common/components/languageBar';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import { ImageWithDropdown } from '../../../_common/components/imageWithDropdown';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, name, personId } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!personId) { validationErrors.personId = t('common.errors.required'); }
  if (name && !name[_activeLocale]) { validationErrors.name = validationErrors.name || {}; validationErrors.name[_activeLocale] = t('common.errors.required'); }
// Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  fetchFaceImages: bindActionCreators(actions.fetchFaceImages, dispatch),
  loadCharacter: bindActionCreators(actions.loadCharacter, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  deleteFaceImage: bindActionCreators(actions.deleteFaceImage, dispatch),
  deletePortraitImage: bindActionCreators(actions.deletePortraitImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  uploadFaceImage: bindActionCreators(actions.uploadFaceImage, dispatch),
  uploadPortraitImage: bindActionCreators(actions.uploadPortraitImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch),
  searchPersons: bindActionCreators(actions.searchPersons, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'characterEdit',
  validate
})
@Radium
export default class EditCharacter extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    currentCharacter: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    defaultLocale: PropTypes.string,
    deleteFaceImage: PropTypes.func,
    deletePortraitImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    faceImages: ImmutablePropTypes.map.isRequired,
    fetchFaceImages: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadCharacter: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    personsById: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchPersons: PropTypes.func.isRequired,
    searchedPersonIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadFaceImage: PropTypes.func.isRequired,
    uploadPortraitImage: PropTypes.func.isRequired,
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
  }

  async componentWillMount () {
    if (this.props.params.characterId) {
      const editObj = await this.props.loadCharacter(this.props.params.characterId);
      await this.props.fetchFaceImages({ characterId: this.props.params.characterId });
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/characters', true);
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
    this.props.openModal(CHARACTER_CREATE_LANGUAGE);
  }

  async submit (form) {
    const { supportedLocales, params: { characterId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        locales: supportedLocales.toArray(),
        characterId
      });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
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
    const { _activeLocale, personsById, errors, closeModal, currentModal, searchPersons, searchedPersonIds, supportedLocales, defaultLocale,
      currentCharacter, location, handleSubmit, deletePortraitImage, deleteProfileImage, deleteFaceImage, faceImages, fetchFaceImages } = this.props;
    return (
        <Root style={styles.backgroundRoot}>
          <Header currentLocation={location} hideHomePageLinks />
          <SpecificHeader/>
          <BreadCrumbs hierarchy={[
            { title: 'List', url: '/content/characters' },
            { title: currentCharacter.getIn([ 'name', defaultLocale ]), url: location } ]}/>
          {currentModal === CHARACTER_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}/>}
          <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs showPublishStatus>
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
                    label='Character name'
                    name={`name.${_activeLocale}`}
                    placeholder='Character name'
                    required/>
                  <Field
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(id) => personsById.getIn([ id, 'fullName' ])}
                    getOptions={searchPersons}
                    isLoading={searchedPersonIds.get('_status') === FETCHING}
                    label='Person'
                    name='personId'
                    options={searchedPersonIds.get('data').toJS()}
                    placeholder='Person'
                    required/>
                  <Field
                    component={TextInput}
                    label='Description'
                    name={`description.${_activeLocale}`}
                    placeholder='Description'
                    type='multiline'/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Profile image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentCharacter.getIn([ 'profileImage', 'url' ])}
                      imageUrl={currentCharacter.getIn([ 'profileImage', 'url' ]) && `${currentCharacter.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ characterId: this.props.params.characterId, image: file, callback }); }}
                      onDelete={() => { deleteProfileImage({ characterId: currentCharacter.get('id') }); }}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Poster image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentCharacter.getIn([ 'portraitImage', 'url' ])}
                      imageUrl={currentCharacter.getIn([ 'portraitImage', 'url' ]) && `${currentCharacter.getIn([ 'portraitImage', 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadPortraitImage({ characterId: this.props.params.characterId, image: file, callback }); }}
                      onDelete={() => { deletePortraitImage({ characterId: currentCharacter.get('id') }); }}/>
                  </div>
                </div>
              </Section>
            </Tab>
            <Tab title='Face Data'>
              <Section>
                <FormSubtitle first>Upload face images</FormSubtitle>
                <FormDescription style={styles.description}>We use facial recognition to automatically detect faces in frames.</FormDescription>
                <ImageDropzone
                  multiple
                  noPreview
                  style={styles.imageDropzone}
                  onChange={async ({ callback, file }) => { await this.props.uploadFaceImage({ characterId: this.props.params.characterId, image: file, callback }); fetchFaceImages({ characterId: currentCharacter.get('id') }); }}/>

                <FormSubtitle>Uploads</FormSubtitle>
                <div style={styles.faceImagesContainer}>
                  {faceImages.get('data').map((faceImage, index) =>
                    <ImageWithDropdown
                      downloadUrl={faceImage.getIn([ 'image', 'url' ])}
                      imageUrl={faceImage.getIn([ 'image', 'url' ])}
                      key={`ImageWithDropdown${index}`}
                      onDelete={async () => {
                        await deleteFaceImage({ characterId: currentCharacter.get('id'), faceImageId: faceImage.get('id') });
                        fetchFaceImages({ characterId: currentCharacter.get('id') });
                      }}/>
                  )}
                </div>
              </Section>
             </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
