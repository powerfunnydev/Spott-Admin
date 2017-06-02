import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import { tabStyles, Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Section from '../../../_common/components/section';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

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
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'datalabeltypeEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditDatalabeltype extends Component {

  static propTypes = {
    currentDatalabeltype: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    const datalabeltypeId = this.props.params.datalabeltypeId
    if (datalabeltypeId) {
      const { name } = await this.props.load(datalabeltypeId);
      this.props.initialize({ name });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/datalabeltypes', true);
  }

  async submit (form) {
    try {
      await this.props.submit({ ...form.toJS(), id: this.props.params.datalabeltypeId });
      this.props.initialize(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    background: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    paddingTop: {
      paddingTop: '1.25em'
    }
  }

  render () {
    const { currentDatalabeltype, location, handleSubmit } = this.props;
    const { styles } = this.constructor;
    return (
      <SideMenu>
        <Root style={styles.background}>
          <Header hierarchy={[
            { title: 'Datalabeltypes', url: '/settings/datalabeltypes' },
            { title: currentDatalabeltype.get('name'), url: location } ]}/>
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
                    placeholder='Name datalabeltype'
                    required/>
                </Section>
              </TabPanel>
            </Tabs>
          </EditTemplate>
        </Root>
      </SideMenu>
    );
  }

}
