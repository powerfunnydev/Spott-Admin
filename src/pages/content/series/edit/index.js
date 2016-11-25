import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
// import Line from '../../../_common/components/line';
import { makeTextStyle, fontWeights, buttonStyles, Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import Button from '../../../_common/buttons/button';
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
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    copyFromBase: PropTypes.object,
    currentSeriesEntry: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
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
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
  }

  async componentWillMount () {
    if (this.props.params.seriesEntryId) {
      const { localeNames } = this.props;
      const editObj = await this.props.loadSeriesEntry(this.props.params.seriesEntryId);
      console.log('editObj', editObj);
      // initialize customTitle and copyFromBase
      const customTitle = {};
      const copyFromBase = {};
      // foreach on all locales (e.g. en, nl, fr,...)
      for (const locale of localeNames.keySeq().toArray()) {
        // initialize title as an object when needed
        customTitle.title = customTitle.title || {};
        // here we need all translatable fields, and iterate over those fields.
        for (const field of [ 'title', 'description' ]) {
          // initialize copyFromBase as an object when needed
          copyFromBase[field] = copyFromBase[field] || {};
          // take value from backend, if not filled in, take true as default value
          copyFromBase[field][locale] = typeof editObj.basedOnDefaultLocale[locale] === 'boolean' ? editObj.basedOnDefaultLocale[locale] : true;
        }
        // take value from backend, if not filled in, take false as default value
        customTitle.title[locale] = typeof editObj.title[locale] === 'string';
      }
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale,
        customTitle,
        copyFromBase
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/series', true);
  }

  async submit (form) {
    const { localeNames, params: { seriesEntryId } } = this.props;
    console.log('form', form.toJS());
    try {
      await this.props.submit({
        locales: localeNames.keySeq().toArray(),
        seriesEntryId,
        ...form.toJS()
      });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale, defaultLocale } = this.props;
    dispatch(change(`basedOnDefaultLocale.${defaultLocale}`, false));
    dispatch(change(`basedOnDefaultLocale.${_activeLocale}`, false));
    dispatch(change('defaultLocale', _activeLocale));
/*
    if (basedOnDefaultLocale[defaultLocale.value]) {
      basedOnDefaultLocale[defaultLocale.value].onChange(false);
    }
    defaultLocale.onChange(_activeLocale.value);
    basedOnDefaultLocale[_activeLocale.value].onChange(false);*/
  }
  static styles = {
    topBar: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '22.5px',
      paddingRight: '22.5px'
    },
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
    baseLanguageButton: {
      height: '32px',
      ...makeTextStyle(fontWeights.regular, '11px')
    }
  }

  render () {
    const { styles } = this.constructor;
    const { _activeLocale, localeNames, defaultLocale, currentSeriesEntry, location, handleSubmit } = this.props;

    return (
      <Root style={styles.backgroundRoot}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
            <Tab title='Details'>
              <Section noPadding style={styles.background}>
                <div style={[ styles.topBar ]}>
                  <Field
                    component={SelectInput}
                    getItemText={(language) => {
                      const locale = localeNames.get(language);
                      return defaultLocale === language ? `${locale} (Base)` : locale;
                    }}
                    getOptions={(language) => localeNames.keySeq().toArray()}
                    name='_activeLocale'
                    options={localeNames.keySeq().toArray()}
                    placeholder='Default language'
                    style={styles.selectInput}/>
                  {_activeLocale !== defaultLocale &&
                    <Button
                      style={[ buttonStyles.white, styles.baseLanguageButton ]}
                      text='Set as base language'
                      onClick={this.onSetDefaultLocale}/>
                    }
                </div>
              </Section>
              <Section>
                <FormSubtitle first>General</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Series title'
                  name={`title.${_activeLocale}`}
                  placeholder='Series title'
                  required/>
                <Field
                  component={TextInput}
                  label='Start year'
                  name={`startYear.${_activeLocale}`}
                  placeholder='Start year'
                  type='number'/>
                <Field
                  component={TextInput}
                  label='End year'
                  name={`endYear.${_activeLocale}`}
                  placeholder='End year'
                  type='number'/>
                <Field
                  component={TextInput}
                  // copyFromBase={!isDefaultLocaleSelected}
                  // disabled={copyFromBase && copyFromBase.getIn([ 'description', _activeLocale ])}
                  label='Description'
                  name={`description.${_activeLocale}`}
                  placeholder='Description'
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
            <Tab title='Availability'>
              <Availabilities
                availabilities={currentSeriesEntry.get('availabilities')}
                location={location} />
            </Tab>
            <Tab title='Audience'>
              {/* TODO */}
              <Section>
                <FormSubtitle first>Audience</FormSubtitle>
              </Section>
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
