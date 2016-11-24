import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
import { Root, FormDescription, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
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
import Availabilities from '../../_availabilities/list';

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
    change: PropTypes.func.isRequired,
    currentDefaultLocale: PropTypes.string,
    currentSeriesEntry: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
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
    this.onChangeDefaultLocale = ::this.onChangeDefaultLocale;
  }

  async componentWillMount () {
    if (this.props.params.seriesEntryId) {
      const editObj = await this.props.loadSeriesEntry(this.props.params.seriesEntryId);
      this.props.initialize({
        ...editObj,
        title: editObj.title[editObj.defaultLocale]
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

  onChangeDefaultLocale (locale) {
    const { currentSeriesEntry, change, dispatch } = this.props;
    dispatch(change('title', currentSeriesEntry.getIn([ 'title', locale ]) || ''));
    dispatch(change('startYear', currentSeriesEntry.getIn([ 'startYear', locale ]) || ''));
    dispatch(change('endYear', currentSeriesEntry.getIn([ 'endYear', locale ]) || ''));
    dispatch(change('summary', currentSeriesEntry.getIn([ 'summary', locale ]) || ''));
  }

  static styles = {
    selectInput: {
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '22.5px',
      paddingRight: '22.5px',
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
    }
  }

  render () {
    const { children, localeNames, currentDefaultLocale, currentSeriesEntry, location, handleSubmit } = this.props;
    const { styles } = this.constructor;

    console.warn('currentSeriesEntry', currentSeriesEntry.toJS());
    return (
      <Root style={{ backgroundColor: colors.lightGray4, paddingBottom: '50px' }}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
            <Tab title='Details'>
              <Section noPadding style={styles.background}>
                <Field
                  component={SelectInput}
                  getItemText={(language) => { const locale = localeNames.get(language); return currentSeriesEntry.get('defaultLocale') === language ? `${locale} (Base)` : locale; }}
                  getOptions={(language) => localeNames.keySeq().toArray()}
                  name='defaultLocale'
                  options={localeNames.keySeq().toArray()}
                  placeholder='Default language'
                  style={styles.selectInput}
                  onChange={this.onChangeDefaultLocale}/>
              </Section>
              <Section>
                <FormSubtitle first>General</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Series title'
                  name='title'
                  placeholder='Series title'
                  required/>
                <Field
                  component={TextInput}
                  label='Start year'
                  name='startYear'
                  placeholder='Start year'
                  type='number'/>
                <Field
                  component={TextInput}
                  label='End year'
                  name='endYear'
                  placeholder='End year'
                  type='number'/>
                <Field
                  component={TextInput}
                  label='Summary'
                  name='summary'
                  placeholder='Summary'
                  type='multiline'/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Profile image' />
                    <Dropzone
                      accept='image/*'
                      imageUrl={currentSeriesEntry.getIn([ 'profileImage', currentSeriesEntry.get('defaultLocale'), 'url' ])}/>
                  </div>
                </div>
              </Section>
            </Tab>
            <Tab title='Helpers'>
              {/* TODO */}
              <Section>
                <FormSubtitle first>Content</FormSubtitle>
                ...
              </Section>
            </Tab>
            <Tab title='Interactive video'>
              {/* TODO */}
              <Section>
                <FormSubtitle first>Content</FormSubtitle>
                ...
              </Section>
            </Tab>
            <Tab title='Availability'>
              <Availabilities
                availabilities={currentSeriesEntry.get('availabilities')}
                location={location} />
            </Tab>
          </Tabs>
        </EditTemplate>
        {children}
      </Root>
    );
  }

}
