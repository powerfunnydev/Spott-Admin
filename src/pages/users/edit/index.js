import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../_common/inputs/textInput';
import Header from '../../app/header';
import { tabStyles, Root, FormSubtitle, colors, EditTemplate } from '../../_common/styles';
import localized from '../../_common/localized';
import * as actions from './actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Section from '../../_common/components/section';
import { routerPushWithReturnTo } from '../../../actions/global';

function validate (values, { t }) {
  const validationErrors = {};
  const { name } = values.toJS();
  if (!name) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(null, (dispatch) => ({
  load: bindActionCreators(actions.load, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadImage: bindActionCreators(actions.uploadImage, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'userEdit',
  validate
})
@Radium
export default class EditUser extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      const editObj = await this.props.load(this.props.params.id);
      this.props.initialize({
        firstName: editObj.firstName,
        lastName: editObj.lastName,
        userName: editObj.userName,
        email: editObj.email
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('users', true);
  }

  async submit (form) {
    try {
      await this.props.submit({ userId: this.props.params.id, ...form.toJS() });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  render () {
    const { location, handleSubmit } = this.props;
    return (
      <Root style={{ backgroundColor: colors.lightGray4, paddingBottom: '50px' }}>
        <Header currentLocation={location} hideHomePageLinks />
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
            <TabList style={tabStyles.tabList}>
              <Tab style={tabStyles.tab}>Details</Tab>
            </TabList>
            <TabPanel>
              <Section first>
                <FormSubtitle first>Content</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Username'
                  name='userName'
                  placeholder='Username'
                  required/>
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
                  component={TextInput}
                  label='Email'
                  name='email'
                  placeholder='Email'
                  required/>
                {/* <div style={{ paddingTop: '1.25em' }}>
                  <Label text='Upload image' />
                  <Dropzone
                    accept='image/*'
                    onChange={({ callback, file }) => { this.props.uploadImage({ userId: this.props.params.id, image: file, callback }); }}/>
                </div>*/}
              </Section>
            </TabPanel>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}

/*
<ImageInput
  disabled={localeDataFieldDisabled}
  field={logo[_activeLocale.value]}
  height={250}
  label='Logo'
  style={styles.logoImage}
  width={250} />
  */
