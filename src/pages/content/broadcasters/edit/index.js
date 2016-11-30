import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
import { tabStyles, Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/localized';
import * as actions from './actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Section from '../../../_common/components/section';
import SpecificHeader from '../../header';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Dropzone from '../../../_common/dropzone';
import Label from '../../../_common/inputs/_label';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { name } = values.toJS();
  if (!name) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  load: bindActionCreators(actions.load, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadImage: bindActionCreators(actions.uploadImage, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'broadcasterEdit',
  validate
})
@Radium
export default class EditBroadcaster extends Component {

  static propTypes = {
    currentBroadcaster: ImmutablePropTypes.map.isRequired,
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
    const broadcasterId = this.props.params.broadcasterId;
    if (broadcasterId) {
      const { name } = await this.props.load(broadcasterId);
      this.props.initialize({ name });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/broadcasters', true);
  }

  async submit (form) {
    try {
      await this.props.submit({ ...form.toJS(), id: this.props.params.broadcasterId });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  render () {
    const { currentBroadcaster, location, handleSubmit } = this.props;
    return (
      <Root style={{ backgroundColor: colors.lightGray4 }}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
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
                  label='Name'
                  name='name'
                  placeholder='Name broadcaster'
                  required/>
                <div style={{ paddingTop: '1.25em' }}>
                  <Label text='Upload image' />
                  <Dropzone
                    accept='image/*'
                    imageUrl={currentBroadcaster.get('logo') &&
                      `${currentBroadcaster.getIn([ 'logo', 'url' ])}?height=310&width=310`}
                    onChange={({ callback, file }) => this.props.uploadImage({ broadcasterId: this.props.params.broadcasterId, image: file, callback })}/>
                </div>
              </Section>
            </TabPanel>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
