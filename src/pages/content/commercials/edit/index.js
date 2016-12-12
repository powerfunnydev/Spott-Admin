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
import { COMMERCIAL_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import Dropzone from '../../../_common/dropzone/imageDropzone';
import Header from '../../../app/header';
import Label from '../../../_common/inputs/_label';
import localized from '../../../_common/decorators/localized';
import CheckboxInput from '../../../_common/inputs/checkbox';
import Section from '../../../_common/components/section';
import ColorInput from '../../../_common/inputs/colorInput';
import SelectInput from '../../../_common/inputs/selectInput';
import SpecificHeader from '../../header';
import TextInput from '../../../_common/inputs/textInput';
import LanguageBar from '../../../_common/components/languageBar';
import Availabilities from '../../_availabilities/list';
import RelatedVideo from '../../../content/_relatedVideo/read';
import * as actions from './actions';
import selector from './selector';
import Characters from '../../_helpers/_characters/list';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import { PROFILE_IMAGE } from '../../../../constants/imageTypes';

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
  deleteProfileImage: bindActionCreators(actions.deleteProfileImage, dispatch),
  loadCommercial: bindActionCreators(actions.loadCommercial, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBrands: bindActionCreators(actions.searchBrands, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  searchContentProducers: bindActionCreators(actions.searchContentProducers, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch)
}))
@reduxForm({
  form: 'commercialEdit',
  validate
})
@Radium
export default class EditCommercial extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    brandsById: ImmutablePropTypes.map.isRequired,
    broadcastersById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    closeModal: PropTypes.func.isRequired,
    commercialCharacters: ImmutablePropTypes.map.isRequired,
    contentProducersById: ImmutablePropTypes.map.isRequired,
    currentCommercial: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    defaultLocale: PropTypes.string,
    deleteProfileImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    hasBanner: ImmutablePropTypes.map,
    initialize: PropTypes.func.isRequired,
    loadCommercial: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchContentProducers: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedContentProducerIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadProfileImage: PropTypes.func.isRequired
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
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/commercials', true);
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
  };

  render () {
    const styles = this.constructor.styles;
    const {
      _activeLocale, closeModal, currentModal, commercialCharacters, contentProducersById,
      searchContentProducers, searchedContentProducerIds, broadcastersById,
      searchBroadcasters, searchedBroadcasterIds, location, currentCommercial,
      defaultLocale, handleSubmit, hasBanner, supportedLocales, errors,
      searchedCharacterIds, charactersById, searchCharacters, deleteProfileImage,
      searchBrands, brandsById, searchedBrandIds, location: { query: { tab } }
    } = this.props;

    console.warn('currentCommercial', hasBanner, currentCommercial && currentCommercial.toJS());

    return (
      <Root style={styles.backgroundRoot}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[
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
                  <div>
                    <Label text='Profile image' />
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
                <FormSubtitle first>Banner</FormSubtitle>
                <Field
                  component={CheckboxInput}
                  label='Has banner'
                  name={`hasBanner.${_activeLocale}`} />
                <Field
                  component={TextInput}
                  disabled={hasBanner && !hasBanner.get(_activeLocale)}
                  label='Text'
                  name={`bannerText.${_activeLocale}`}
                  placeholder='Text'
                  required />
                <Field
                  component={TextInput}
                  disabled={hasBanner && !hasBanner.get(_activeLocale)}
                  label='Url'
                  name={`bannerUrl.${_activeLocale}`}
                  placeholder='Url'
                  required />
                <Field
                  component={ColorInput}
                  disabled={hasBanner && !hasBanner.get(_activeLocale)}
                  label='Text color'
                  name={`bannerTextColor.${_activeLocale}`}
                  required />
                <Field
                  component={ColorInput}
                  disabled={hasBanner && !hasBanner.get(_activeLocale)}
                  label='Bar color'
                  name={`bannerBarColor.${_activeLocale}`}
                  required />
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
            <Tab title='Availability'>
              <Availabilities mediumId={this.props.params.commercialId} />
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
