import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import { push as routerPush } from 'react-router-redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
import { Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/localized';
import * as actions from './actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Section from '../../../_common/components/section';
import SpecificHeader from '../../header';

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
  routerPush: bindActionCreators(routerPush, dispatch)
}))
@reduxForm({
  form: 'contentProducersEditEntry',
  validate
})
@Radium
export default class EditContentProducersEntry extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPush: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
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
        name: editObj.name
      });
    }
  }

  redirect () {
    this.props.routerPush((this.props.location && this.props.location.state && this.props.location.state.returnTo) || 'content/content-producers');
  }

  async submit (form) {
    try {
      await this.props.submit({ id: this.props.params.id, ...form.toJS() });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  render () {
    const { location: { pathname }, handleSubmit } = this.props;
    return (
      <Root style={{ backgroundColor: colors.lightGray4, paddingBottom: '50px' }}>
        <Header currentPath={pathname} hideHomePageLinks />
        <SpecificHeader/>
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
            <TabList style={{ marginBottom: 0, borderWidth: 0 }}>
              <Tab style={{ fontSize: '12px', color: '#536970', borderColor: colors.lightGray3 }}>Details</Tab>
            </TabList>
            <TabPanel>
              <Section first>
                <FormSubtitle first>Content</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Name'
                  name='name'
                  placeholder='Name content producer'
                  required/>
              </Section>
            </TabPanel>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
