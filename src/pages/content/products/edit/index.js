import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
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
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import { FETCHING } from '../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, shortName, fullName, brandId } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (shortName && !shortName[_activeLocale]) { validationErrors.shortName = validationErrors.shortName || {}; validationErrors.shortName[_activeLocale] = t('common.errors.required'); }
  if (fullName && !fullName[_activeLocale]) { validationErrors.fullName = validationErrors.fullName || {}; validationErrors.shortName[_activeLocale] = t('common.errors.required'); }
  if (!brandId) { validationErrors.brandId = t('common.errors.required'); }

// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  deleteImage: bindActionCreators(actions.deleteImage, dispatch),
  loadProduct: bindActionCreators(actions.loadProduct, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBrands: bindActionCreators(actions.searchBrands, dispatch),
  searchProductCategories: bindActionCreators(actions.searchProductCategories, dispatch),
  searchTags: bindActionCreators(actions.searchTags, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadImage: bindActionCreators(actions.uploadImage, dispatch)
}))
@reduxForm({
  form: 'productEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditProduct extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    brandsById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentProduct: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    deleteImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadProduct: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    productCategoriesById: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchProductCategories: PropTypes.func.isRequired,
    searchTags: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedProductCategoryIds: ImmutablePropTypes.map.isRequired,
    searchedTagIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    tagsById: ImmutablePropTypes.map.isRequired,
    uploadImage: PropTypes.func.isRequired,
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
    if (this.props.params.productId) {
      const editObj = await this.props.loadProduct(this.props.params.productId);
      console.log('editObj', editObj);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale,
        brandId: editObj.brand && editObj.brand.id
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/products', true);
  }

  languageAdded (form) {
    const { language, fullName, shortName } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language,
        shortName: { ...formValues.shortName, [language]: shortName },
        fullName: { ...formValues.fullName, [language]: fullName }
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
    const { initialize, params: { productId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        productId
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
    const { _activeLocale, brandsById, productCategoriesById, errors, currentModal, closeModal, supportedLocales, defaultLocale,
      currentProduct, location, handleSubmit, searchBrands, searchProductCategories, searchedProductCategoryIds, searchedBrandIds, deleteImage,
      tagsById, searchTags, searchedTagIds, location: { query: { tab } } } = this.props;
    console.log('productCategoriesById', productCategoriesById && productCategoriesById.toJS());
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <BreadCrumbs hierarchy={[
            { title: 'Products', url: '/content/products' },
            { title: currentProduct.getIn([ 'shortName', defaultLocale ]), url: location } ]}/>
          {currentModal === BRAND_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}>
              <Field
                component={TextInput}
                label='Product name'
                name={'fullName'}
                placeholder='Product name'
                required/>
              <Field
                component={TextInput}
                label='Short name'
                name={'shortName'}
                placeholder='Short name product'
                required/>
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
                    label='Short name product'
                    name={`shortName.${_activeLocale}`}
                    placeholder='Short name'
                    required/>
                  <Field
                    component={TextInput}
                    label='Full name product'
                    name={`fullName.${_activeLocale}`}
                    placeholder='Full name'
                    required/>
                  <Field
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(id) => brandsById.getIn([ id, 'name' ])}
                    getOptions={searchBrands}
                    isLoading={searchedBrandIds.get('_status') === FETCHING}
                    label='Brand'
                    name='brandId'
                    options={searchedBrandIds.get('data').toJS()}
                    placeholder='Brand name'
                    required/>
                  <Field
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(id) => productCategoriesById.getIn([ id, 'name' ])}
                    getOptions={searchProductCategories}
                    isLoading={searchedProductCategoryIds.get('_status') === FETCHING}
                    label='Product categories'
                    multiselect
                    name='categories'
                    options={searchedProductCategoryIds.get('data').toJS()}
                    placeholder='Product categories'
                    required/>
                  {/* <Field
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(id) => tagsById.getIn([ id, 'name' ])}
                    getOptions={searchTags}
                    isLoading={searchedTagIds.get('_status') === FETCHING}
                    label='Tags'
                    multiselect
                    name='tags'
                    options={searchedTagIds.get('data').toJS()}
                    placeholder='Tag names'
                    required/>*/}
                  <Field
                    component={TextInput}
                    label='Description'
                    name={`description.${_activeLocale}`}
                    placeholder='Description'
                    type='multiline'/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Primary image' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentProduct.getIn([ 'logo', _activeLocale, 'url' ]) ||
                                    currentProduct.getIn([ 'logo', defaultLocale, 'url' ])}
                      imageUrl={currentProduct.getIn([ 'logo', _activeLocale, 'url' ]) && `${currentProduct.getIn([ 'logo', _activeLocale, 'url' ])}?height=203&width=360` ||
                                currentProduct.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentProduct.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                      showOnlyUploadedImage
                      onChange={({ callback, file }) => { this.props.uploadImage({ locale: _activeLocale, productId: this.props.params.productId, image: file, callback }); }}
                      onDelete={currentProduct.getIn([ 'logo', _activeLocale, 'url' ]) ? () => { deleteImage({ locale: _activeLocale, productId: currentProduct.get('id') }); } : null}/>
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