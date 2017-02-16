import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CheckboxInput from '../../../_common/inputs/checkbox';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
import { Root, FormSubtitle, colors, EditTemplate, FormDescription, buttonStyles } from '../../../_common/styles';
import { Table, CustomCel, Rows, Row } from '../../../_common/components/table/index';
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
import { fromJS } from 'immutable';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import RemoveButton from '../../../_common/components/buttons/removeButton';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, name, url } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (name && !name[_activeLocale]) { validationErrors.name = validationErrors.name || {}; validationErrors.name[_activeLocale] = t('common.errors.required'); }
  if (url && !url[_activeLocale]) { validationErrors.url = validationErrors.url || {}; validationErrors.url[_activeLocale] = t('common.errors.required'); }

// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  deleteLogoImage: bindActionCreators(actions.deleteLogoImage, dispatch),
  loadShop: bindActionCreators(actions.loadShop, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadLogoImage: bindActionCreators(actions.uploadLogoImage, dispatch)
}))
@reduxForm({
  form: 'shopEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditShop extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    countries: PropTypes.object.isRequired,
    currentModal: PropTypes.string,
    currentShop: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    deleteLogoImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadShop: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadLogoImage: PropTypes.func.isRequired,
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
    this.state = {
      selectedCountryId: null
    };
  }

  async componentWillMount () {
    if (this.props.params.shopId) {
      const editObj = await this.props.loadShop(this.props.params.shopId);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/shops', true);
  }

  async addCountry () {
    const { formValues } = this.props;
    const { selectedCountryId } = this.state;
    const formValuesP = formValues.toJS();
    formValuesP.countries.push({ uuid: selectedCountryId, links: [] });
    await this.submit(fromJS(formValuesP));
    this.setState({ selectedCountryId: null });
  }

  languageAdded (form) {
    const { language, name, url } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language,
        url: { ...formValues.url, [language]: url },
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
    const { initialize, params: { shopId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        shopId
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
    },
    controlWrapper: {
      display: 'block',
      flex: 4,
      backgroundColor: 'rgba(244, 245, 245, 0.5)'
    },
    countryInput: {
      position: 'absolute',
      right: 170,
      left: 10
    },
    actionsWrapper: {
      position: 'absolute',
      right: 10
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { _activeLocale, errors, currentModal, closeModal, supportedLocales, defaultLocale, formValues,
      currentShop, countries, location, handleSubmit, deleteLogoImage, location: { query: { tab } } } = this.props;
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
            { title: 'Shops', url: '/content/shops' },
            { title: currentShop.getIn([ 'name', defaultLocale ]), url: location } ]}/>
          {currentModal === BRAND_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}>
              <Field
                component={TextInput}
                label='Shop name'
                name='name'
                placeholder='Shop name'
                required />
              <Field
                component={TextInput}
                label='Url'
                name='url'
                placeholder='Url'
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
                    label='Shop name'
                    name={`name.${_activeLocale}`}
                    placeholder='Shop name'
                    required/>
                  <Field
                    component={TextInput}
                    label='Url'
                    name={`url.${_activeLocale}`}
                    placeholder='Url'
                    required/>
                  <Field
                    component={CheckboxInput}
                    label='Enable universal basket'
                    name='universalBasketEnabled' />
                    <FormSubtitle>Images</FormSubtitle>
                  <div style={[ styles.paddingTop, styles.row ]}>
                    <div>
                      <Label text='Logo image' />
                      <ImageDropzone
                        accept='image/*'
                        downloadUrl={currentShop.getIn([ 'logo', _activeLocale, 'url' ]) ||
                                      currentShop.getIn([ 'logo', defaultLocale, 'url' ])}
                        imageUrl={currentShop.getIn([ 'logo', _activeLocale, 'url' ]) && `${currentShop.getIn([ 'logo', _activeLocale, 'url' ])}?height=203&width=360` ||
                                  currentShop.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentShop.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                        showOnlyUploadedImage
                        onChange={({ callback, file }) => { this.props.uploadLogoImage({ locale: _activeLocale, shopId: this.props.params.shopId, image: file, callback }); }}
                        onDelete={currentShop.getIn([ 'logo', _activeLocale, 'url' ]) ? () => { deleteLogoImage({ locale: _activeLocale, shopId: currentShop.get('id') }); } : null}/>
                    </div>
                  </div>
                </Section>
              </Tab>
              <Tab title='Availability'>
                <Section>
                  <FormSubtitle first>Availability</FormSubtitle>
                  <FormDescription>Which countries are supported and/or are in the shipping list of this shop?</FormDescription>
                  <br/>
                  <Table>
                    <Rows>
                      {formValues && formValues.toJS().countries.map((country, index) => {
                        return (
                          <Row index={index} key={index} >
                            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                            <CustomCel style={{ flex: 3 }}>
                              {countries.getIn([ country.uuid, 'name' ])}
                            </CustomCel>
                            <CustomCel style={{ flex: 1, textAlign: 'right', display: 'block' }}>
                              <RemoveButton cross onClick={async () => {
                                const formValuesP = formValues.toJS();
                                formValuesP.countries.splice(index, 1);
                                this.submit(fromJS(formValuesP));
                              }}/>
                            </CustomCel>
                          </Row>
                        );
                      })}
                      {(!formValues || !formValues.toJS().countries.length) &&
                        <Row>
                          <CustomCel style={{ flex: 4 }}>
                            No country is added.
                          </CustomCel>
                        </Row>
                      }
                      <Row key={-1} >
                        {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                        <CustomCel style={styles.controlWrapper} >
                          <Field
                            component={SelectInput}
                            first
                            getItemText={(countryId) => countries.getIn([ countryId, 'name' ])}
                            input={{
                              value: this.state.selectedCountryId
                            }}
                            name='country'
                            options={countries.keySeq().toArray().filter((countryId) =>
                              formValues && formValues.toJS().countries.findIndex((country) => country.uuid === countryId) < 0
                            )}
                            placeholder='Country'
                            style={styles.countryInput}
                            onChange={(id) => this.setState({ selectedCountryId: id })} />
                          <div style={styles.actionsWrapper}>
                            <button
                              key='cancel'
                              style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white ]}
                              onClick={() => this.setState({ selectedCountryId: null })}>Cancel</button>
                            <button
                              disabled={!this.state.selectedCountryId}
                              key='add'
                              style={[ buttonStyles.base, buttonStyles.small, this.state.selectedCountryId ? buttonStyles.blue : buttonStyles.gray ]}
                              onClick={() => this.addCountry()}>Add</button>
                          </div>
                        </CustomCel>
                      </Row>
                    </Rows>
                  </Table>
                </Section>
              </Tab>
            </Tabs>
          </EditTemplate>
        </Root>
      </SideMenu>
    );
  }
}
