import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
import DateInput from '../../../_common/inputs/dateInput';
// import Line from '../../../_common/components/line';
import { Root, FormSubtitle, colors, EditTemplate, FormDescription } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Label from '../../../_common/inputs/_label';
import { PERSON_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import selector from './selector';
import LanguageBar from '../../../_common/components/languageBar';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import { ImageWithDropdown } from '../../../_common/components/imageWithDropdown';
import { PROFILE_IMAGE } from '../../../../constants/imageTypes';
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, fullName, gender } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!fullName) { validationErrors.fullName = t('common.errors.required'); }
  if (!gender) { validationErrors.gender = t('common.errors.required'); }

// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  deleteFaceImage: bindActionCreators(actions.deleteFaceImage, dispatch),
  deletePortraitImage: bindActionCreators(actions.deletePortraitImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  fetchFaceImages: bindActionCreators(actions.fetchFaceImages, dispatch),
  loadPerson: bindActionCreators(actions.loadPerson, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadFaceImage: bindActionCreators(actions.uploadFaceImage, dispatch),
  uploadPortraitImage: bindActionCreators(actions.uploadPortraitImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch)
}))
@reduxForm({
  form: 'personEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditPerson extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentPerson: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    deleteFaceImage: PropTypes.func.isRequired,
    deletePortraitImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    faceImages: ImmutablePropTypes.map.isRequired,
    fetchFaceImages: PropTypes.func,
    formValues: ImmutablePropTypes.map,
    genders: ImmutablePropTypes.map.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadPerson: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadFaceImage: PropTypes.func.isRequired,
    uploadPortraitImage: PropTypes.func.isRequired,
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
    if (this.props.params.personId) {
      const editObj = await this.props.loadPerson(this.props.params.personId);
      await this.props.fetchFaceImages({ personId: this.props.params.personId });
      this.props.initialize({
        ...editObj,
        dateOfBirth: moment(editObj.dateOfBirth),
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/persons', true);
  }

  languageAdded (form) {
    const { language } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language
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
      this.props.openModal(PERSON_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    const { initialize, params: { personId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        personId
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
    const { _activeLocale, errors, currentModal, closeModal, genders, supportedLocales, defaultLocale,
      currentPerson, location, handleSubmit, deletePortraitImage, deleteProfileImage, faceImages,
      deleteFaceImage, fetchFaceImages, location: { query: { tab } } } = this.props;
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <BreadCrumbs hierarchy={[
            { title: 'People', url: '/content/persons' },
            { title: currentPerson.get('fullName'), url: location } ]}/>
          {currentModal === PERSON_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}/>}
          <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
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
                    component={TextInput}
                    label='Full name'
                    name='fullName'
                    placeholder='E.g. Mark Zuckerberg'
                    required/>
                  <Field
                    component={SelectInput}
                    getItemText={(gender) => genders.get(gender)}
                    label='Gender'
                    name='gender'
                    options={genders.keySeq().toArray()}
                    placeholder='Gender'
                    required/>
                  <Field
                    component={DateInput}
                    label='Date Of Birth'
                    name='dateOfBirth'
                    placeholder='Date of birth (DD/MM/YYYY)'/>
                  <Field
                    component={TextInput}
                    label='Place Of Birth'
                    name='placeOfBirth'
                    placeholder='E.g. London'/>
                  <Field
                    component={TextInput}
                    label='Description'
                    name={`description.${_activeLocale}`}
                    placeholder='Description'
                    type='multiline'/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Portrait image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentPerson.getIn([ 'portraitImage', 'url' ])}
                      imageUrl={currentPerson.getIn([ 'portraitImage', 'url' ]) && `${currentPerson.getIn([ 'portraitImage', 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadPortraitImage({ personId: this.props.params.personId, image: file, callback }); }}
                      onDelete={() => { deletePortraitImage({ personId: currentPerson.get('id') }); }}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Profile image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentPerson.getIn([ 'profileImage', 'url' ])}
                      imageUrl={currentPerson.getIn([ 'profileImage', 'url' ]) && `${currentPerson.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                      type={PROFILE_IMAGE}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ personId: this.props.params.personId, image: file, callback }); }}
                      onDelete={() => { deleteProfileImage({ personId: currentPerson.get('id') }); }}/>
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
                  onChange={async ({ callback, file }) => { await this.props.uploadFaceImage({ personId: currentPerson.get('id'), image: file, callback }); fetchFaceImages({ personId: currentPerson.get('id') }); }}/>

                <FormSubtitle>Uploads</FormSubtitle>
                <div style={styles.faceImagesContainer}>
                  {faceImages.get('data').map((faceImage, index) =>
                    <ImageWithDropdown
                      downloadUrl={faceImage.getIn([ 'image', 'url' ])}
                      imageUrl={faceImage.getIn([ 'image', 'url' ])}
                      key={`ImageWithDropdown${index}`}
                      onDelete={async () => {
                        await deleteFaceImage({ personId: currentPerson.get('id'), faceImageId: faceImage.get('id') });
                        fetchFaceImages({ personId: currentPerson.get('id') });
                      }}/>
                  )}
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
