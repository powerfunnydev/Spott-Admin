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
import SelectInput from '../../../_common/inputs/selectInput';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { loadAll as loadTypes } from '../../datalabeltypes/list/actions';
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
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  loadTypes: bindActionCreators(loadTypes, dispatch),
}))
@reduxForm({
  form: 'datalabelEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditDatalabel extends Component {

  static propTypes = {
    currentDatalabel: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    loadTypes: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    datalabeltypes: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    const datalabelId = this.props.params.datalabelId;
    if (datalabelId) {
      const { name } = await this.props.load(datalabelId);
      this.props.initialize({ name });
    }
    await this.props.loadTypes();
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/datalabels', true);
  }

  async submit (form) {
    try {
      await this.props.submit({ ...form.toJS(), id: this.props.params.datalabelId });
      this.props.initialize(form.toJS());
      this.onCloseClick();
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

  onCloseClick () {
    this.props.routerPushWithReturnTo('/settings/datalabels', true);
  }

  render () {
    const { currentDatalabel, location, handleSubmit, datalabeltypes } = this.props;
    const { styles } = this.constructor;
    const types = datalabeltypes.get('data').toJS();
    return (
      <SideMenu>
        <Root style={styles.background}>
          <Header hierarchy={[
            { title: 'Datalabels', url: '/settings/datalabels' },
            { title: currentDatalabel.get('name'), url: location } ]}/>
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
                    placeholder='Name datalabel'
                    required/>
                  <Field
                    component={SelectInput}
                    getItemText={(data) => data.name}
                    name='type'
                    options={types}
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
