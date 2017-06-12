import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import { Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Label from '../../../_common/inputs/_label';
import { BRAND_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import selector from './selector';
import LanguageBar from '../../../_common/components/languageBar';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import { PROFILE_IMAGE } from '../../../../constants/imageTypes';
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, name } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!name) { validationErrors.name = t('common.errors.required'); }

// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  deleteLogoImage: bindActionCreators(actions.deleteLogoImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  loadBrand: bindActionCreators(actions.loadBrand, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadLogoImage: bindActionCreators(actions.uploadLogoImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch)
}))
@reduxForm({
  form: 'brandEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditBrand extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentBrand: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    defaultLocale: PropTypes.string,
    deleteLogoImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadBrand: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadLogoImage: PropTypes.func.isRequired,
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
    if (this.props.params.brandId) {
      const editObj = await this.props.loadBrand(this.props.params.brandId);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/brands', true);
  }

  languageAdded (form) {
    const { language, name } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language,
        name: { ...formValues.name, [language]: name }
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
      this.props.openModal(BRAND_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    const { initialize, params: { brandId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        brandId
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
    const { _activeLocale, errors, currentModal, closeModal, supportedLocales, defaultLocale,
      currentBrand, location, handleSubmit, deleteLogoImage, deleteProfileImage, location: { query: { tab } } } = this.props;
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
            { title: 'Brands', url: '/content/brands' },
            { title: currentBrand.getIn([ 'name', defaultLocale ]), url: location } ]}/>
          {currentModal === BRAND_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}>
              <Field
                component={TextInput}
                label='Brand name'
                name='name'
                placeholder='Brand name'
                required />
            </CreateLanguageModal>}
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
                    label='Name'
                    name={`name.${_activeLocale}`}
                    placeholder='Brand name'
                    required/>
                  <Field
                    component={TextInput}
                    label='Tag line'
                    name={`tagLine.${_activeLocale}`}
                    placeholder='E.g. Think different'
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
                    <Label text='Logo image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentBrand.getIn([ 'logo', _activeLocale, 'url' ]) ||
                                    currentBrand.getIn([ 'logo', defaultLocale, 'url' ])}
                      imageUrl={currentBrand.getIn([ 'logo', _activeLocale, 'url' ]) && `${currentBrand.getIn([ 'logo', _activeLocale, 'url' ])}?height=203&width=360` ||
                                currentBrand.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentBrand.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                      showOnlyUploadedImage
                      onChange={({ callback, file }) => { this.props.uploadLogoImage({ locale: _activeLocale, brandId: this.props.params.brandId, image: file, callback }); }}
                      onDelete={currentBrand.getIn([ 'logo', _activeLocale, 'url' ]) ? () => { deleteLogoImage({ locale: _activeLocale, brandId: currentBrand.get('id') }); } : null}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Profile image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentBrand.getIn([ 'profileImage', _activeLocale, 'url' ]) ||
                                  currentBrand.getIn([ 'profileImage', defaultLocale, 'url' ])}
                      imageUrl={currentBrand.getIn([ 'profileImage', _activeLocale, 'url' ]) && `${currentBrand.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360` ||
                                currentBrand.getIn([ 'profileImage', defaultLocale, 'url' ]) && `${currentBrand.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                      showOnlyUploadedImage
                      type={PROFILE_IMAGE}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ locale: _activeLocale, brandId: this.props.params.brandId, image: file, callback }); }}
                      onDelete={currentBrand.getIn([ 'profileImage', _activeLocale, 'url' ]) ? () => { deleteProfileImage({ locale: _activeLocale, brandId: currentBrand.get('id') }); } : null}/>
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
