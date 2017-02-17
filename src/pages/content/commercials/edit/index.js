import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FETCHING } from '../../../../constants/statusTypes';
import { colors, fontWeights, makeTextStyle, EditTemplate, FormDescription, FormSubtitle, Root } from '../../../_common/styles';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { COMMERCIAL_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import Dropzone from '../../../_common/dropzone/imageDropzone';
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/decorators/localized';
import CheckboxInput from '../../../_common/inputs/checkbox';
import RadioInput from '../../../_common/inputs/radioInput';
import Section from '../../../_common/components/section';
import ColorInput from '../../../_common/inputs/colorInput';
import SelectInput from '../../../_common/inputs/selectInput';
import TextInput from '../../../_common/inputs/textInput';
import LanguageBar from '../../../_common/components/languageBar';
import Audiences from '../../_audiences/list';
import Availabilities from '../../_availabilities/list';
import RelatedVideo from '../../../content/_relatedVideo/read';
import Characters from '../../_helpers/_characters/list';
import Collections from '../../_collections/list';
import { BANNER_IMAGE, PROFILE_IMAGE, ROUND_LOGO } from '../../../../constants/imageTypes';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import Schedule from './schedule/list';
import * as actions from './actions';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, brandId, defaultLocale, title } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!brandId) { validationErrors.brandId = t('common.errors.required'); }
  if (title && !title[_activeLocale]) {
    validationErrors.title = validationErrors.title || {};
    validationErrors.title[_activeLocale] = t('common.errors.required');
  }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  deleteBannerImage: bindActionCreators(actions.deleteBannerImage, dispatch),
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  deleteRoundLogo: bindActionCreators(actions.deleteRoundLogo, dispatch),
  loadCommercial: bindActionCreators(actions.loadCommercial, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBannerLinkBrands: bindActionCreators(actions.searchBannerLinkBrands, dispatch),
  searchBannerLinkCharacters: bindActionCreators(actions.searchBannerLinkCharacters, dispatch),
  searchBannerLinkMedia: bindActionCreators(actions.searchBannerLinkMedia, dispatch),
  searchBannerLinkPersons: bindActionCreators(actions.searchBannerLinkPersons, dispatch),
  searchBrands: bindActionCreators(actions.searchBrands, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  searchCountries: bindActionCreators(actions.searchCountries, dispatch),
  searchCollectionsBrands: bindActionCreators(actions.searchCollectionsBrands, dispatch),
  searchCollectionsCharacters: bindActionCreators(actions.searchCollectionsCharacters, dispatch),
  searchCollectionsProducts: bindActionCreators(actions.searchCollectionsProducts, dispatch),
  searchContentProducers: bindActionCreators(actions.searchContentProducers, dispatch),
  searchLanguages: bindActionCreators(actions.searchLanguages, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadBannerImage: bindActionCreators(actions.uploadBannerImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch),
  uploadRoundLogo: bindActionCreators(actions.uploadRoundLogo, dispatch)
}))
@reduxForm({
  form: 'commercialEdit',
  validate
})
@Radium
export default class EditCommercial extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    bannerInternalLinkType: PropTypes.string,
    bannerSystemLinkType: PropTypes.string,
    brandsById: ImmutablePropTypes.map.isRequired,
    broadcastersById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    commercialCharacters: ImmutablePropTypes.map.isRequired,
    commercialCollections: ImmutablePropTypes.map.isRequired,
    contentProducersById: ImmutablePropTypes.map.isRequired,
    currentCommercial: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    defaultLocale: PropTypes.string,
    deleteBannerImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    deleteRoundLogo: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    hasBanner: PropTypes.bool,
    initialize: PropTypes.func.isRequired,
    loadCommercial: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    mediaById: ImmutablePropTypes.map.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    personsById: ImmutablePropTypes.map.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBannerLinkBrands: PropTypes.func.isRequired,
    searchBannerLinkCharacters: PropTypes.func.isRequired,
    searchBannerLinkMedia: PropTypes.func.isRequired,
    searchBannerLinkPersons: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchCollectionsBrands: PropTypes.func.isRequired,
    searchCollectionsCharacters: PropTypes.func.isRequired,
    searchCollectionsProducts: PropTypes.func.isRequired,
    searchContentProducers: PropTypes.func.isRequired,
    searchCountries: PropTypes.func.isRequired,
    searchLanguages: PropTypes.func.isRequired,
    searchedBannerLinkBrandIds: ImmutablePropTypes.map.isRequired,
    searchedBannerLinkCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedBannerLinkMediumIds: ImmutablePropTypes.map.isRequired,
    searchedBannerLinkPersonIds: ImmutablePropTypes.map.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedCollectionsBrandIds: ImmutablePropTypes.map.isRequired,
    searchedCollectionsCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedCollectionsProductIds: ImmutablePropTypes.map.isRequired,
    searchedContentProducerIds: ImmutablePropTypes.map.isRequired,
    searchedCountryIds: ImmutablePropTypes.map.isRequired,
    searchedLanguageIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadBannerImage: PropTypes.func.isRequired,
    uploadProfileImage: PropTypes.func.isRequired,
    uploadRoundLogo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.languageAdded = :: this.languageAdded;
    this.openCreateLanguageModal = :: this.openCreateLanguageModal;
    this.redirect = ::this.redirect;
    this.removeLanguage = :: this.removeLanguage;
    this.submit = ::this.submit;
    this.onChangeTab = ::this.onChangeTab;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
  }

  async componentWillMount () {
    const { commercialId } = this.props.params;
    if (commercialId) {
      const editObj = await this.props.loadCommercial(commercialId);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale,
        bannerSystemLinkType: editObj.bannerSystemLinkType || 'EXTERNAL',
        bannerInternalLinkType: editObj.bannerInternalLinkType || 'MEDIUM',
        brandId: editObj.brand && editObj.brand.id,
        bannerActorId: editObj.bannerActor && editObj.bannerActor.id,
        bannerBrandId: editObj.bannerBrand && editObj.bannerBrand.id,
        bannerCharacterId: editObj.bannerCharacter && editObj.bannerCharacter.id,
        bannerMediumId: editObj.bannerMedium && editObj.bannerMedium.id,
        broadcasters: editObj.broadcasters && editObj.broadcasters.map((bc) => bc.id),
        contentProducers: editObj.contentProducers && editObj.contentProducers.map((bc) => bc.id)
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/commercials', true);
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
    this.props.openModal(COMMERCIAL_CREATE_LANGUAGE);
  }

  async submit (form) {
    const { supportedLocales, params: { commercialId } } = this.props;
    try {
      await this.props.submit({
        locales: supportedLocales.toArray(),
        commercialId,
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: -20
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
    paddingUploadImage: {
      paddingBottom: 20,
      paddingRight: 24
    },
    label: {
      paddingTop: 20
    },
    subSection: {
      borderRadius: 2,
      border: `solid 1px ${colors.lightGray2}`,
      marginTop: 18,
      paddingTop: 17,
      paddingBottom: 20,
      paddingRight: 20,
      paddingLeft: 20
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      _activeLocale, bannerInternalLinkType, bannerSystemLinkType, brandsById,
      broadcastersById, charactersById, closeModal, commercialCharacters,
      commercialCollections, contentProducersById, currentCommercial, currentModal,
      defaultLocale, deleteBannerImage, deleteRoundLogo, errors, handleSubmit, hasBanner,
      mediaById, personsById, productsById, searchCollectionsBrands, searchCollectionsCharacters, searchCollectionsProducts,
      searchBannerLinkBrands, searchBannerLinkCharacters, searchBannerLinkMedia, searchBrands,
      searchCharacters, searchCountries, searchContentProducers,
      searchedBannerLinkBrandIds, searchedBannerLinkCharacterIds, searchedBannerLinkMediumIds, searchBannerLinkPersons,
      searchedContentProducerIds, searchBroadcasters, searchLanguages,
      searchedBroadcasterIds, searchedCharacterIds, searchedCollectionsBrandIds,
      searchedCollectionsCharacterIds, searchedCollectionsProductIds, searchedBannerLinkPersonIds, location,
      location: { query: { tab } }, supportedLocales,
      deleteProfileImage, searchedBrandIds, searchedCountryIds, searchedLanguageIds
    } = this.props;

    const bannerImage = currentCommercial.getIn([ 'bannerImage', _activeLocale ]);

    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
            { title: 'Commercials', url: '/content/commercials' },
            { title: currentCommercial.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          {currentModal === COMMERCIAL_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}/>}
          <EditTemplate disableSubmit={tab > 2} onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
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
                    component={SelectInput}
                    disabled={_activeLocale !== defaultLocale}
                    getItemText={(id) => brandsById.getIn([ id, 'name' ])}
                    getOptions={searchBrands}
                    isLoading={searchedBrandIds.get('_status') === FETCHING}
                    label='Brand'
                    name='brandId'
                    options={searchedBrandIds.get('data').toJS()}
                    placeholder='Brand'
                    required />
                  <Field
                    component={TextInput}
                    label='Title'
                    name={`title.${_activeLocale}`}
                    placeholder='Title'
                    required />
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
                    <div style={styles.paddingUploadImage}>
                      <Label text='Background image' />
                      <Dropzone
                        accept='image/*'
                        downloadUrl={currentCommercial.getIn([ 'profileImage', _activeLocale ]) &&
                          currentCommercial.getIn([ 'profileImage', _activeLocale, 'url' ])}
                        imageUrl={currentCommercial.getIn([ 'profileImage', _activeLocale ]) &&
                          `${currentCommercial.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360`}
                        type={PROFILE_IMAGE}
                        onChange={({ callback, file }) => { this.props.uploadProfileImage({ commercialId: this.props.params.commercialId, image: file, callback }); }}
                        onDelete={() => { deleteProfileImage({ mediumId: currentCommercial.get('id') }); }}/>
                    </div>
                    <div style={styles.paddingUploadImage}>
                      <Label text='Circle graphic' />
                      <Dropzone
                        downloadUrl={currentCommercial.getIn([ 'roundLogo', _activeLocale, 'url' ]) ||
                          currentCommercial.getIn([ 'roundLogo', defaultLocale, 'url' ])}
                        imageUrl={currentCommercial.getIn([ 'roundLogo', _activeLocale ]) &&
                          `${currentCommercial.getIn([ 'roundLogo', _activeLocale, 'url' ])}?height=203&width=203` ||
                          currentCommercial.getIn([ 'roundLogo', defaultLocale ]) &&
                          `${currentCommercial.getIn([ 'roundLogo', defaultLocale, 'url' ])}?height=203&width=203`}
                        showOnlyUploadedImage
                        type={ROUND_LOGO}
                        onChange={({ callback, file }) => { this.props.uploadRoundLogo({ locale: _activeLocale, commercialId: this.props.params.commercialId, image: file, callback }); }}
                        onDelete={currentCommercial.getIn([ 'roundLogo', _activeLocale, 'url' ]) ? () => { deleteRoundLogo({ locale: _activeLocale, mediumId: currentCommercial.get('id') }); } : null}/>
                    </div>
                  </div>
                </Section>
              </Tab>
              <Tab title='Banner'>
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
                  <FormDescription>A Banner is necesarry if you need this commercial to show up in other content according to their schedule.</FormDescription>
                  <Field
                    component={CheckboxInput}
                    label='Activate banner'
                    name='hasBanner' />
                  <Field
                    component={TextInput}
                    disabled={!hasBanner}
                    label='Text'
                    name={`bannerText.${_activeLocale}`}
                    placeholder='Text'
                    required />
                  <Field
                    component={TextInput}
                    disabled={!hasBanner}
                    first
                    label='Url'
                    name={`bannerUrl.${_activeLocale}`}
                    placeholder='Url'
                    required />
                  <Field
                    component={ColorInput}
                    disabled={!hasBanner}
                    label='Text color'
                    name={`bannerTextColor.${_activeLocale}`}
                    required />
                  <Field
                    component={ColorInput}
                    disabled={!hasBanner}
                    label='Bar color'
                    name={`bannerBarColor.${_activeLocale}`}
                    required />
                  <FormSubtitle>Banner Image</FormSubtitle>
                  <Label style={styles.label} text={bannerImage ? `${bannerImage.getIn([ 'dimension', 'width' ])} x ${bannerImage.getIn([ 'dimension', 'height' ])} (640 x 200 Recommended)` : '640 x 200 Recommended'} />
                  <Dropzone
                    accept='image/*'
                    disabled={!hasBanner}
                    downloadUrl={bannerImage && bannerImage.get('url')}
                    height={100}
                    imageUrl={bannerImage && `${bannerImage.get('url')}?height=200&width=640`}
                    type={BANNER_IMAGE}
                    onChange={({ callback, file }) => { this.props.uploadBannerImage({ commercialId: this.props.params.commercialId, image: file, callback }); }}
                    onDelete={() => { deleteBannerImage({ commercialId: currentCommercial.get('id'), locale: _activeLocale }); }}/>
                  <FormSubtitle>Banner Link</FormSubtitle>
                  <Field
                    component={RadioInput}
                    disabled={!hasBanner}
                    label='Redirect url'
                    labelStyle={{ paddingBottom: 0 }}
                    name='bannerSystemLinkType'
                    options={[
                      { label: 'External', value: 'EXTERNAL' },
                      { label: 'Internal', value: 'INTERNAL' }
                    ]}
                    optionsStyle={{ display: 'flex' }}
                    required/>
                  {bannerSystemLinkType === 'EXTERNAL' &&
                    <div style={styles.subSection}>
                      <Field
                        component={TextInput}
                        disabled={!hasBanner}
                        first
                        label='Link'
                        name={`bannerExternalLink.${_activeLocale}`}
                        placeholder='Link'
                        required />
                    </div>}
                  {bannerSystemLinkType === 'INTERNAL' &&
                    <div style={styles.subSection}>
                      <Field
                        component={RadioInput}
                        disabled={!hasBanner}
                        first
                        name='bannerInternalLinkType'
                        options={[
                          { label: 'Medium', value: 'MEDIUM' },
                          { label: 'Brand', value: 'BRAND' },
                          { label: 'Actor', value: 'ACTOR' },
                          { label: 'Character', value: 'CHARACTER' }
                        ]}
                        optionsStyle={{ display: 'flex', marginBottom: '0.625em', marginTop: '-0.625em' }}
                        required/>
                      {bannerInternalLinkType === 'MEDIUM' &&
                        <Field
                          component={SelectInput}
                          disabled={!hasBanner}
                          first
                          getItemText={(id) => mediaById.getIn([ id, 'title' ])}
                          getOptions={searchBannerLinkMedia}
                          isLoading={searchedBannerLinkMediumIds.get('_status') === FETCHING}
                          name='bannerMediumId'
                          options={searchedBannerLinkMediumIds.get('data').toJS()}
                          placeholder='Series/Movie/Commercial'/>}
                      {bannerInternalLinkType === 'BRAND' &&
                        <Field
                          component={SelectInput}
                          disabled={!hasBanner}
                          first
                          getItemText={(id) => brandsById.getIn([ id, 'name' ])}
                          getOptions={searchBannerLinkBrands}
                          isLoading={searchedBannerLinkBrandIds.get('_status') === FETCHING}
                          name='bannerBrandId'
                          options={searchedBannerLinkBrandIds.get('data').toJS()}
                          placeholder='Brand'/>}
                    {bannerInternalLinkType === 'ACTOR' &&
                      <Field
                        component={SelectInput}
                        disabled={!hasBanner}
                        first
                        getItemText={(id) => personsById.getIn([ id, 'fullName' ])}
                        getOptions={searchBannerLinkPersons}
                        isLoading={searchedBannerLinkPersonIds.get('_status') === FETCHING}
                        name='bannerActorId'
                        options={searchedBannerLinkPersonIds.get('data').toJS()}
                        placeholder='Actor'/>}
                    {bannerInternalLinkType === 'CHARACTER' &&
                      <Field
                        component={SelectInput}
                        disabled={!hasBanner}
                        first
                        getItemText={(id) => charactersById.getIn([ id, 'name' ])}
                        getOptions={searchBannerLinkCharacters}
                        isLoading={searchedBannerLinkCharacterIds.get('_status') === FETCHING}
                        name='bannerCharacterId'
                        options={searchedBannerLinkCharacterIds.get('data').toJS()}
                        placeholder='Character'/>}
                    </div>}
                </Section>
              </Tab>
             <Tab title='Helpers'>
                <Characters
                  charactersById={charactersById}
                  mediumCharacters={commercialCharacters}
                  mediumId={this.props.params.commercialId}
                  searchCharacters={searchCharacters}
                  searchedCharacterIds={searchedCharacterIds} />
              </Tab>
              <Tab title='Interactive video'>
                <Section>
                  <FormSubtitle first>Interactive video</FormSubtitle>
                  <Field
                    component={RelatedVideo}
                    medium={currentCommercial}
                    name='videoId' />
                </Section>
              </Tab>
              <Tab title='Collections'>
                <Collections
                  brandsById={brandsById}
                  charactersById={charactersById}
                  mediumCollections={commercialCollections}
                  mediumId={this.props.params.commercialId}
                  productsById={productsById}
                  searchBrands={searchCollectionsBrands}
                  searchCharacters={searchCollectionsCharacters}
                  searchProducts={searchCollectionsProducts}
                  searchedBrandIds={searchedCollectionsBrandIds}
                  searchedCharacterIds={searchedCollectionsCharacterIds}
                  searchedProductIds={searchedCollectionsProductIds}/>
              </Tab>
              <Tab title='Schedule'>
                <Schedule commercialId={this.props.params.commercialId}/>
              </Tab>
              <Tab title='Availability'>
                <Availabilities mediumId={this.props.params.commercialId} />
              </Tab>
              <Tab title='Audience'>
                <Audiences
                  mediumId={this.props.params.commercialId}
                  searchCountries={searchCountries}
                  searchLanguages={searchLanguages}
                  searchedCountryIds={searchedCountryIds}
                  searchedLanguageIds={searchedLanguageIds}/>
              </Tab>
            </Tabs>
          </EditTemplate>
        </Root>
      </SideMenu>
    );
  }

}
