/* eslint-disable no-return-assign */
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import DateInput from '../../../_common/inputs/dateInput';
import TimeInput from '../../../_common/inputs/timeInput';
import CheckboxInput from '../../../_common/inputs/checkbox';
import SelectInput from '../../../_common/inputs/selectInput';
import { Root, FormSubtitle, colors, EditTemplate, FormDescription } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { PUSH_NOTIFICATION_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import selector from './selector';
import LanguageBar from '../../../_common/components/languageBar';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { FETCHING } from '../../../../constants/statusTypes';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, payloadData } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (payloadData && !payloadData[_activeLocale]) { validationErrors.payloadData = validationErrors.payloadData || {}; validationErrors.payloadData[_activeLocale] = t('common.errors.required'); }
// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  loadPushNotification: bindActionCreators(actions.loadPushNotification, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  searchPushNotificationDestinations: bindActionCreators(actions.searchPushNotificationDestinations, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  submit: bindActionCreators(actions.submit, dispatch)
}))
@reduxForm({
  form: 'pushNotificationEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditPushNotification extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentPushNotification: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    deleteImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadPushNotification: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    payloadData: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    pushNotificationDestinationsById: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchPushNotificationDestinations: PropTypes.func.isRequired,
    searchedPushNotificationDestinationByIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
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
    const { pushNotificationId } = this.props.params;
    if (pushNotificationId) {
      const editObj = await this.props.loadPushNotification(pushNotificationId);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale,
        payloadData: editObj.payloadData
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/push-notifications', true);
  }

  languageAdded (form) {
    const { language, payloadData } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language,
        payloadData: { ...formValues.payloadData, [language]: payloadData }
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

  searchRetryDurations () {
    return [ 10, 15, 20 ];
  }

  searchVersions () {
    const versions = [];
    for (let i = 100; i < 427; i++) {
      versions.push(i.toString().split('').join('.'));
    }
    return versions;
  }

  openCreateLanguageModal () {
    if (this.props.onBeforeChangeTab()) {
      this.props.openModal(PUSH_NOTIFICATION_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    const { initialize, params: { pushNotificationId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        pushNotificationId
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
    dividedFields: {
      display: 'flex',
      flexDirection: 'row'
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
    dateInput: {
      flex: 1,
      paddingRight: '0.313em'
    },
    timeInput: {
      alignSelf: 'flex-end',
      flex: 1,
      paddingLeft: '0.313em'
    },
    flexWrap: {
      flexWrap: 'wrap'
    },
    checkboxInput: {
      marginLeft: '0.313em'
    },
    versionsWrapper: {
      marginLeft: '1.0em'
    },
    versionInput: {
      marginLeft: '0.313em',
      width: 150
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { _activeLocale, errors, currentModal, closeModal, supportedLocales, defaultLocale, pushNotificationDestinationsById, searchedPushNotificationDestinationByIds,
      searchPushNotificationDestinations, location, handleSubmit, currentPushNotification, location: { query: { tab } } } = this.props;
    const { searchVersions, searchRetryDurations } = this;
    const formValues = (this.props.formValues && this.props.formValues.toJS()) || { applications: [] };

    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
            { title: 'Push Notifications', url: '/content/push-notifications' },
            { title: currentPushNotification.getIn([ 'payloadData', defaultLocale ]), url: location } ]}/>
          {currentModal === PUSH_NOTIFICATION_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}>
              <Field
                component={TextInput}
                label='Message'
                name='payloadData'
                placeholder='Message'
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
                  <FormSubtitle first>Data</FormSubtitle>
                  <Field
                    component={TextInput}
                    label='Message'
                    name={`payloadData.${_activeLocale}`}
                    placeholder='Message'
                    required/>
                </Section>
              </Tab>
              <Tab title='Destination'>
                <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage}>
                  <FormSubtitle first>Action</FormSubtitle>
                  <FormDescription>When user interact with this notification, where should it take them?</FormDescription>
                  <Field
                    component={SelectInput}
                    getItemText={(id) => pushNotificationDestinationsById.getIn([ id, 'name' ])}
                    getOptions={searchPushNotificationDestinations}
                    isLoading={searchedPushNotificationDestinationByIds.get('_status') === FETCHING}
                    label='Destination'
                    name='actionType'
                    options={searchedPushNotificationDestinationByIds.get('data').toJS()}
                    placeholder='Destination'
                    required/>
                </Section>
              </Tab>
              <Tab title='Schedule'>
                <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage}>
                  <FormSubtitle first>Send date</FormSubtitle>
                  <FormDescription>When should this push notifications be sent?</FormDescription>
                  <Field
                    component={SelectInput}
                    disabled
                    getItemText={(id) => pushNotificationDestinationsById.getIn([ id, 'name' ])}
                    getOptions={searchPushNotificationDestinations}
                    isLoading={searchedPushNotificationDestinationByIds.get('_status') === FETCHING}
                    label='Timezone'
                    name='timezone'
                    options={searchedPushNotificationDestinationByIds.get('data').toJS()}
                    placeholder='Timezone' />
                  <div style={styles.dividedFields}>
                    <Field
                      component={DateInput}
                      label='Date & Time'
                      name='sendDate'
                      placeholder='DD/MM/YYYY'
                      required
                      style={styles.dateInput}/>
                    <Field
                      component={TimeInput}
                      name='sendTime'
                      required
                      style={styles.timeInput}/>
                  </div>
                  <br/>
                  <FormSubtitle first>Expiration</FormSubtitle>
                  <FormDescription>Should the system be unable to send out the notifications due to connection problems. How long may we retry?</FormDescription>
                  <Field
                    component={SelectInput}
                    getItemText={(value) => `${value} minutes`}
                    label='Retry Duration'
                    name='retryDuration'
                    options={searchRetryDurations()}
                    placeholder='Retry Duration'
                    required/>
                </Section>
              </Tab>
              <Tab title='Audience'>
                <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage}>
                  <FormSubtitle first>User Types</FormSubtitle>
                  <div style={styles.dividedFields}>
                    <Field
                      component={CheckboxInput}
                      label='Registered'
                      name='registeredUser'
                      style={styles.checkboxInput} />
                    <Field
                      component={CheckboxInput}
                      label='Unregistered'
                      name='unRegisteredUser'
                      style={styles.checkboxInput} />
                  </div>
                  <br/>
                  <FormSubtitle>Applications</FormSubtitle>
                  {
                    formValues && formValues.applications.map((application, index) =>
                      <div key={index}>
                        <Field
                          component={CheckboxInput}
                          label={application.deviceType}
                          name={`applications[${index}].deviceSelected`}
                          style={styles.checkboxInput} />
                        {
                          application.deviceSelected && (
                            <div style={[ styles.dividedFields, styles.versionsWrapper ]}>
                              <Field
                                component={SelectInput}
                                getItemText={(value) => value}
                                label='Minimum Version'
                                name={`applications[${index}].minimumAppVersion`}
                                options={searchVersions()}
                                placeholder='0.0.0'
                                required
                                style={styles.versionInput} />
                              <Field
                                component={SelectInput}
                                getItemText={(value) => value}
                                getOptions={searchVersions}
                                label='Maximum Version'
                                name={`applications[${index}].maximumAppVersion`}
                                options={searchVersions()}
                                placeholder='0.0.0'
                                required
                                style={styles.versionInput} />
                            </div>)
                        }
                      </div>
                    )
                  }
                </Section>
              </Tab>
            </Tabs>
        </EditTemplate>
      </Root>
    </SideMenu>
    );
  }

}
