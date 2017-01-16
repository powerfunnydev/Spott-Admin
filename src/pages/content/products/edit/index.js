/* eslint-disable no-return-assign */
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import RadioInput from '../../../_common/inputs/radioInput';
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
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { FETCHING } from '../../../../constants/statusTypes';
import ProductOfferings from './productOfferings/list';
import SimilarProducts from './similarProducts/list';
import LargeImageModal from '../../../_common/largeImageModal';

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
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedProductCategoryIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
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
    this.state = {};
    this.onMinimize = ::this.onMinimize;
  }

  async componentWillMount () {
    if (this.props.params.productId) {
      const editObj = await this.props.loadProduct(this.props.params.productId);
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

  onEnlarge (index) {
    this.largeImageModal.open(index);
  }

  onMinimize () {
    this.largeImageModal.close();
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
    description: {
      marginBottom: '1.25em'
    },
    imageDropzone: {
      marginRight: '1.625em',
      marginBottom: '1.625em'
    },
    flexWrap: {
      flexWrap: 'wrap'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { _activeLocale, brandsById, productCategoriesById, errors, currentModal, closeModal, supportedLocales, defaultLocale,
      currentProduct, location, handleSubmit, searchBrands, searchProductCategories, searchedProductCategoryIds, searchedBrandIds, deleteImage,
      location: { query: { tab } } } = this.props;
    const logo = currentProduct.getIn([ 'logo', _activeLocale ]) ||
                      currentProduct.getIn([ 'logo', defaultLocale ]);
    // Construct an array of product images.
    const images = currentProduct.getIn([ 'images', _activeLocale ]) && currentProduct.getIn([ 'images', _activeLocale ]).toJS() || [];
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
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
                name='fullName'
                placeholder='Product name'
                required/>
              <Field
                component={TextInput}
                label='Short name'
                name='shortName'
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
                    label='Full name product'
                    name={`fullName.${_activeLocale}`}
                    placeholder='Full name'
                    required/>
                  <Field
                    component={TextInput}
                    label='Short name product'
                    name={`shortName.${_activeLocale}`}
                    placeholder='Short name'
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
                  <Field
                    component={TextInput}
                    label='Description'
                    name={`description.${_activeLocale}`}
                    placeholder='Description'
                    type='multiline'/>
                <FormSubtitle>Images</FormSubtitle>

                <Label style={styles.paddingTop} text='Product images' />
                <LargeImageModal
                  images={images.map((image) => image.url)}
                  isOpen={typeof this.state.enlargeImageIndex === 'number'}
                  ref={(c) => this.largeImageModal = c}
                  title={currentProduct.getIn([ 'shortName', _activeLocale ])}
                  onClose={this.onMinimize}/>
                <div style={[ styles.row, styles.flexWrap ]}>
                  <ImageDropzone
                    accept='image/*'
                    downloadUrl={logo && logo.get('url')}
                    imageUrl={logo && logo.get('url') && `${logo.get('url')}?height=203&width=360`}
                    showOnlyUploadedImage
                    style={styles.imageDropzone}
                    // We can only change the image if there is no image for the active locale.
                    onChange={currentProduct.getIn([ 'logo', _activeLocale ]) ? null : ({ callback, file }) => {
                      this.props.uploadImage({ locale: _activeLocale, productId: this.props.params.productId, image: file, callback });
                    }}
                    onClick={this.onEnlarge.bind(this, 0)}
                    // We can only remove an image if there is one for the active locale.
                    onDelete={currentProduct.getIn([ 'logo', _activeLocale ]) ? () => {
                      deleteImage({ locale: _activeLocale, productId: currentProduct.get('id'), imageId: currentProduct.getIn([ 'logo', _activeLocale, 'id' ]) });
                    } : null}/>
                  {currentProduct.getIn([ 'images', _activeLocale ]) && currentProduct.getIn([ 'images', _activeLocale ]).rest().map((image, index) => (
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={image.get('url')}
                      imageUrl={image.get('url') && `${image.get('url')}?height=203&width=360`}
                      key={`image${index}`}
                      showOnlyUploadedImage
                      style={styles.imageDropzone}
                      onClick={this.onEnlarge.bind(this, index + 1)}
                      onDelete={image.get('id') ? () => {
                        deleteImage({ locale: _activeLocale, productId: currentProduct.get('id'), imageId: image.get('id') });
                      } : null}/>
                  ))}
                  {/* Here you can add a new image, at the end of the list. */}
                  <ImageDropzone
                    accept='image/*'
                    showNoImage
                    style={styles.imageDropzone}
                    onChange={({ callback, file }) => {
                      this.props.uploadImage({ locale: _activeLocale, productId: this.props.params.productId, image: file, callback });
                    }}/>
                </div>
              </Section>
            </Tab>
            <Tab title='Offerings'>
              <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage}>
                <FormSubtitle first>Are people able to buy this product?</FormSubtitle>
                <Field
                  component={RadioInput}
                  name='noLongerAvailable'
                  options={[
                    { label: 'Yes', value: false },
                    { label: 'No (Disable all offerings)', value: true }
                  ]}
                  required
                  style={{ paddingTop: '0.5em' }}/>
                <ProductOfferings productId={this.props.params.productId} style={{ marginTop: '1.875em' }}/>
              </Section>
            </Tab>
            <Tab title='Similar Products'>
              <SimilarProducts
                images={images}
                productId={this.props.params.productId} />
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    </SideMenu>
    );
  }

}
