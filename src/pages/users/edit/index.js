import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { routerPushWithReturnTo } from '../../../actions/global';
import { Root, FormSubtitle, colors, EditTemplate } from '../../_common/styles';
import * as actions from './actions';
import Button from '../../_common/components/buttons/button';
import DateInput from '../../_common/inputs/dateInput';
import Label from '../../_common/inputs/_label';
import localized from '../../_common/decorators/localized';
import Section from '../../_common/components/section';
import SelectInput from '../../_common/inputs/selectInput';
import TextInput from '../../_common/inputs/textInput';
import selector from './selector';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Dropzone from '../../_common/dropzone/imageDropzone';
import { Tabs, Tab } from '../../_common/components/formTabs';
import Checkbox from '../../_common/inputs/checkbox';
import { INACTIVE, disabledReasons, userStatus as userStates } from '../../../constants/userRoles';
import { FETCHING } from '../../../constants/statusTypes';
import ensureEntityIsSaved from '../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../app/sideMenu';
import Header from '../../app/multiFunctionalHeader';

function validate (values, { t }) {
  const validationErrors = {};
  const { firstName, lastName, email, userStatus, broadcaster, broadcasters } = values.toJS();
  if (!firstName) { validationErrors.firstName = t('common.errors.required'); }
  if (!lastName) { validationErrors.lastName = t('common.errors.required'); }
  if (!email) { validationErrors.email = t('common.errors.required'); }
  if (!userStatus) { validationErrors.userStatus = t('common.errors.required'); }
  if (broadcaster && (!broadcasters || broadcasters.length === 0)) { validationErrors.broadcasters = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  clearPopUpMessage: bindActionCreators(actions.clearPopUpMessage, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadBackgroundImage: bindActionCreators(actions.uploadBackgroundImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch),
  resetPassword: bindActionCreators(actions.resetPassword, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  searchContentProducers: bindActionCreators(actions.searchContentProducers, dispatch)
}))
@reduxForm({
  form: 'userEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditUser extends Component {

  static propTypes = {
    broadcastersById: ImmutablePropTypes.map.isRequired,
    clearPopUpMessage: PropTypes.func,
    contentProducersById: ImmutablePropTypes.map.isRequired,
    currentEmail: PropTypes.string,
    currentUser: PropTypes.object.isRequired,
    currentUserStatus: PropTypes.string,
    error: PropTypes.any,
    genders: ImmutablePropTypes.map.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    resetPassword: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchContentProducers: PropTypes.func.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    searchedContentProducerIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    uploadBackgroundImage: PropTypes.func.isRequired,
    uploadProfileImage: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
    this.resetPassword = ::this.resetPassword;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      const editObj = await this.props.load(this.props.params.id);
      this.props.initialize({
        ...editObj,
        dateOfBirth: editObj.dateOfBirth && moment(editObj.dateOfBirth)
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('users', true);
  }

  async resetPassword () {
    await this.props.resetPassword(this.props.currentEmail);
  }

  async submit (form) {
    try {
      await this.props.submit({ userId: this.props.params.id, ...form.toJS() });
      this.props.initialize(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles= {
    paddingTop: {
      paddingTop: '1.25em'
    },
    paddingLeftBackgroudImage: {
      paddingLeft: '24px'
    },
    row: {
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'row'
    },
    paddingTopRow: {
      paddingTop: '14px'
    },
    fontSize: {
      fontSize: '12px'
    },
    paddingLeftCheckbox: {
      paddingLeft: '12px'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    paddingTopSpecificCheckbox: {
      paddingTop: '12px'
    },
    paddingTopMultiselect: {
      paddingTop: '0px'
    },
    background: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { currentUser, currentUserStatus, contentProducersById, searchedContentProducerIds, searchContentProducers,
      broadcastersById, searchedBroadcasterIds, searchBroadcasters, location, handleSubmit, localeNames, genders } = this.props;
    return (
      <SideMenu location={location}>
        <Root style={styles.background}>
          <Header hierarchy={[
            { title: 'Users', url: '/users' },
            { title: `${currentUser.get('firstName')} ${currentUser.get('lastName')}`, url: location } ]}/>
          <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs>
              <Tab title='Details'>
                <Section clearPopUpMessage={this.props.clearPopUpMessage} popUpObject={this.props.popUpMessage}>
                  <FormSubtitle first>Account</FormSubtitle>
                  <Field
                    component={TextInput}
                    label='Email'
                    name='email'
                    placeholder='Email'
                    required/>
                  <Field
                    component={TextInput}
                    disabled
                    label='Username'
                    name='userName'
                    placeholder='Username'
                    required/>
                  <div style={styles.paddingTop}>
                    <Label text='Password' />
                    <Button first style={{ paddingLeft: '2em', paddingRight: '2em' }} text='Reset password' onClick={this.resetPassword}/>
                  </div>
                  <FormSubtitle>General</FormSubtitle>
                  <Field
                    component={TextInput}
                    label='First Name'
                    name='firstName'
                    placeholder='First Name'
                    required/>
                  <Field
                    component={TextInput}
                    label='Last Name'
                    name='lastName'
                    placeholder='Last Name'
                    required/>
                  <Field
                    component={DateInput}
                    label='Date of birth'
                    name='dateOfBirth'
                    placeholder='dd/mm/yyyy'/>
                  <Field
                    component={SelectInput}
                    filter={(option, filter) => {
                      return option && filter ? genders.get(option.value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
                    }}
                    getItemText={(gender) => genders.get(gender)}
                    getOptions={(gender) => genders.keySeq().toArray()}
                    label='Gender'
                    name='gender'
                    options={genders.keySeq().toArray()}
                    placeholder='Gender'/>
                  <Field
                    component={SelectInput}
                    filter={(option, filter) => {
                      return option && filter ? localeNames.get(option.value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
                    }}
                    getItemText={(language) => localeNames.get(language)}
                    getOptions={(language) => localeNames.keySeq().toArray()}
                    label='Language'
                    multiselect
                    name='languages'
                    options={localeNames.keySeq().toArray()}
                    placeholder='Language'/>
                  <FormSubtitle>Images</FormSubtitle>
                  <div style={[ styles.paddingTop, styles.row ]}>
                    <div>
                      <Label text='Profile image' />
                      <Dropzone
                        accept='image/*'
                        downloadUrl={currentUser.get('profileImage') && currentUser.getIn([ 'profileImage', 'url' ])}
                        imageUrl={currentUser.get('profileImage') && `${currentUser.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                        onChange={({ callback, file }) => { this.props.uploadProfileImage({ userId: this.props.params.id, image: file, callback }); }}/>
                    </div>
                    <div style={styles.paddingLeftBackgroudImage}>
                      <Label text='Avatar image' />
                      <Dropzone
                        accept='image/*'
                        downloadUrl={currentUser.get('avatar') && currentUser.getIn([ 'avatar', 'url' ])}
                        imageUrl={currentUser.get('avatar') && `${currentUser.getIn([ 'avatar', 'url' ])}?height=310&width=310`}
                        onChange={({ callback, file }) => { this.props.uploadBackgroundImage({ userId: this.props.params.id, image: file, callback }); }}/>
                    </div>
                  </div>
                  </Section>
              </Tab>
              <Tab title='Permissions'>
                <Section clearPopUpMessage={this.props.clearPopUpMessage} popUpObject={this.props.popUpMessage}>
                  <FormSubtitle first>Account status</FormSubtitle>
                  <Field
                    component={SelectInput}
                    filter={(option, filter) => {
                      return option && filter ? userStates[option.value].toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
                    }}
                    getItemText={(disabled) => userStates[disabled]}
                    getOptions={() => Object.keys(userStates)}
                    label='User status'
                    name='userStatus'
                    options={Object.keys(userStates)}
                    placeholder='User status'
                    required/>
                  {currentUserStatus === INACTIVE && <Field
                    component={SelectInput}
                    filter={(option, filter) => {
                      return option && filter ? disabledReasons[option.value].toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
                    }}
                    getItemText={(reason) => disabledReasons[reason]}
                    getOptions={() => Object.keys(disabledReasons)}
                    label='Reason'
                    name='disabledReason'
                    options={Object.keys(disabledReasons)}
                    placeholder='Reason'/>}
                  <FormSubtitle>Roles</FormSubtitle>
                  <div style={styles.paddingTop}>
                    <div style={styles.row}>
                      <Field
                        component={Checkbox}
                        first
                        name='sysAdmin'/>
                      <div style={[ styles.paddingLeftCheckbox, styles.fontSize ]}>System admin</div>
                    </div>
                    <div style={[ styles.row, styles.paddingTopRow ]}>
                      <Field
                        component={Checkbox}
                        first
                        name='broadcaster'/>
                      <div style={[ styles.paddingLeftCheckbox, styles.column ]}>
                        <div style={styles.fontSize}>Broadcaster</div>
                        <div style={styles.paddingTopSpecificCheckbox}>
                          <Label required text='Broadcaster companies'/>
                          <Field
                            component={SelectInput}
                            getItemText={(broadcasterId) => broadcastersById.getIn([ broadcasterId, 'name' ])}
                            getOptions={searchBroadcasters}
                            isLoading={searchedBroadcasterIds.get('_status') === FETCHING}
                            multiselect
                            name='broadcasters'
                            options={searchedBroadcasterIds.get('data').toJS()}
                            placeholder='Broadcaster companies'
                            style={styles.paddingTopMultiselect}/>
                        </div>
                      </div>
                    </div>
                    <div style={[ styles.row, styles.paddingTopRow ]}>
                      <Field
                        component={Checkbox}
                        first
                        name='contentManager'/>
                      <div style={[ styles.paddingLeftCheckbox, styles.fontSize ]}>Content manager</div>
                    </div>
                    <div style={[ styles.row, styles.paddingTopRow ]}>
                      <Field
                        component={Checkbox}
                        first
                        name='contentProducer'/>
                      <div style={[ styles.paddingLeftCheckbox, styles.column ]}>
                        <div style={styles.fontSize}>Content producer</div>
                        <div style={styles.paddingTopSpecificCheckbox}>
                          <Label required text='Content producers'/>
                          <Field
                            component={SelectInput}
                            getItemText={(contentProducerId) => contentProducersById.getIn([ contentProducerId, 'name' ])}
                            getOptions={searchContentProducers}
                            isLoading={searchedContentProducerIds.get('_status') === FETCHING}
                            multiselect
                            name='contentProducers'
                            options={searchedContentProducerIds.get('data').toJS()}
                            placeholder='Content producers'
                            style={styles.paddingTopMultiselect}/>
                        </div>
                      </div>
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
