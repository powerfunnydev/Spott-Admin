import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
import { Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import Line from '../../../_common/components/line';
import localized from '../../../_common/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import SelectInput from '../../../_common/inputs/selectInput';
import Section from '../../../_common/components/section';
import SpecificHeader from '../../header';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Dropzone from '../../../_common/dropzone';
import Label from '../../../_common/inputs/_label';
import selector from './selector';
import ImmutablePropTypes from 'react-immutable-proptypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, title } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!title) { validationErrors.title = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadSeriesEntry: bindActionCreators(actions.loadSeriesEntry, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'seriesEntryEdit',
  validate
})
@Radium
export default class EditSeriesEntries extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadSeriesEntry: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
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
      const editObj = await this.props.loadSeriesEntry(this.props.params.id);
      this.props.initialize({
        name: editObj.name
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/content-producers');
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
    const { localeNames, location, handleSubmit } = this.props;
    return (
      <Root style={{ backgroundColor: colors.lightGray4, paddingBottom: '50px' }}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
            <Tab title='Details'>
              <Section noPadding style={{ backgroundColor: colors.lightGray4 }}>
                <Field
                  component={SelectInput}
                  getItemText={(language) => localeNames.get(language)}
                  getOptions={(language) => localeNames.keySeq().toArray()}
                  name='defaultLocale'
                  options={localeNames.keySeq().toArray()}
                  placeholder='Default language' style={{
                    padding: '20px 22.5px'
                  }}/>
                  <Line/>
              </Section>
              <Section>
                <FormSubtitle first>General</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Series title'
                  name='title'
                  placeholder='Series title'
                  required/>
              </Section>
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
