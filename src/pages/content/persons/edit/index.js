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
import { PERSON_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import selector from './selector';
import LanguageBar from '../../../_common/components/languageBar';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, fullName, gender } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!fullName) { validationErrors.fullName = t('common.errors.required'); }
  if (!gender) { validationErrors.gender = t('common.errors.required'); }

// Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  fetchFaceImages: bindActionCreators(actions.fetchFaceImages, dispatch),
  loadPerson: bindActionCreators(actions.loadPerson, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  deletePortraitImage: bindActionCreators(actions.deletePortraitImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  uploadFaceImage: bindActionCreators(actions.uploadFaceImage, dispatch),
  uploadPortraitImage: bindActionCreators(actions.uploadPortraitImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'personEdit',
  validate
})
@Radium
export default class EditPerson extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentPerson: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    deletePortraitImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    fetchFaceImages: PropTypes.func,
    genders: ImmutablePropTypes.map.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadPerson: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
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
    this.props.routerPushWithReturnTo('content/persons', true);
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
    this.props.openModal(PERSON_CREATE_LANGUAGE);
  }

  async submit (form) {
    const { supportedLocales, params: { personId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        locales: supportedLocales.toArray(),
        personId
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
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { _activeLocale, errors, currentModal, closeModal, genders, supportedLocales, defaultLocale,
      currentPerson, location, handleSubmit, deletePortraitImage, deleteProfileImage } = this.props;
    return (
        <Root style={styles.backgroundRoot}>
          <Header currentLocation={location} hideHomePageLinks />
          <SpecificHeader/>
          <BreadCrumbs hierarchy={[
            { title: 'List', url: '/content/persons' },
            { title: currentPerson.get('fullName'), url: location } ]}/>
          {currentModal === PERSON_CREATE_LANGUAGE &&
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
                    <Label text='Profile image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentPerson.getIn([ 'profileImage', 'url' ])}
                      imageUrl={currentPerson.getIn([ 'profileImage', 'url' ]) && `${currentPerson.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ personId: this.props.params.personId, image: file, callback }); }}
                      onDelete={() => { deleteProfileImage({ personId: currentPerson.get('id') }); }}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Poster image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentPerson.getIn([ 'portraitImage', 'url' ])}
                      imageUrl={currentPerson.getIn([ 'portraitImage', 'url' ]) && `${currentPerson.getIn([ 'portraitImage', 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadPortraitImage({ personId: this.props.params.personId, image: file, callback }); }}
                      onDelete={() => { deletePortraitImage({ personId: currentPerson.get('id') }); }}/>
                  </div>
                </div>
              </Section>
            </Tab>
            <Tab title='Face Data'>
              <Section>
                <FormSubtitle first>Upload face images</FormSubtitle>
                <FormDescription style={styles.description}>We use facial recognition to automatically detect faces in frames.</FormDescription>
                <ImageDropzone
                  style={styles.imageDropzone}
                  onChange={({ callback, file }) => { this.props.uploadFaceImage({ personId: this.props.params.personId, image: file, callback }); }}/>

                <FormSubtitle>Uploads</FormSubtitle>
              </Section>
             </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
