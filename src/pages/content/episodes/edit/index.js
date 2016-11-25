import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
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
import { FETCHING } from '../../../../constants/statusTypes';
import SelectionDropdown from '../../../_common/components/selectionDropdown';
import AddLanguage from '../../language/create';

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
  loadEpisode: bindActionCreators(actions.loadEpisode, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch)
}))
@reduxForm({
  form: 'episodeEdit',
  validate
})
@Radium
export default class EditEpisodes extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    children: PropTypes.node,
    copyFromBase: PropTypes.object,
    currentEpisode: ImmutablePropTypes.map.isRequired,
    currentSeasonId: PropTypes.string,
    currentSeriesEntryId: PropTypes.string,
    defaultLocale: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadEpisode: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedSeasonIds: ImmutablePropTypes.map.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seasonsById: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
    this.addLanguage = :: this.addLanguage;
  }

  async componentWillMount () {
    if (this.props.params.episodeId) {
      const { localeNames } = this.props;
      const editObj = await this.props.loadEpisode(this.props.params.episodeId);
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

  addLanguage () {
    const { params: { seriesEntryId, seasonId, episodeId } } = this.props;
    this.props.routerPushWithReturnTo(`content/series/read/${seriesEntryId}/seasons/read/${seasonId}/episodes/edit/${episodeId}/add-language`);
  }

  async submit (form) {
    const { localeNames, params: { episodeId } } = this.props;
    console.log('form', form.toJS());
    try {
      await this.props.submit({
        locales: localeNames.keySeq().toArray(),
        episodeId,
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
      paddingTop: '3px',
      paddingBottom: '3px',
      ...makeTextStyle(fontWeights.regular, '11px')
    }
  }

  render () {
    const { children, _activeLocale, copyFromBase, localeNames, currentSeasonId, currentSeriesEntryId, searchSeriesEntries,
        location, currentEpisode, seriesEntriesById, searchedSeriesEntryIds, defaultLocale,
        searchSeasons, seasonsById, searchedSeasonIds, handleSubmit } = this.props;
    const { styles } = this.constructor;
    // const isDefaultLocaleSelected = _activeLocale === defaultLocale;
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
                    component={SelectionDropdown}
                    createOption= {this.addLanguage}
                    createOptionText= 'Add language'
                    getItemText={(language) => {
                      const locale = localeNames.get(language);
                      return defaultLocale === language ? `${locale} (Base)` : locale;
                    }}
                    name='_activeLocale'
                    options={localeNames.keySeq().toArray()}
                    placeholder='Language'/>
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
                  component={SelectInput}
                  getItemText={(id) => seriesEntriesById.getIn([ id, 'title' ])}
                  getOptions={searchSeriesEntries}
                  isLoading={searchedSeriesEntryIds.get('_status') === FETCHING}
                  label='Series title'
                  name='seriesEntryId'
                  options={searchedSeriesEntryIds.get('data').toJS()}
                  placeholder='Series title'
                  onChange={() => {
                    this.props.dispatch(this.props.change('seasonId', null));
                  }} />
                {currentSeriesEntryId && <Field
                  component={SelectInput}
                  getItemText={(id) => seasonsById.getIn([ id, 'title' ])}
                  getOptions={(searchString) => { searchSeasons(searchString, currentSeriesEntryId); }}
                  isLoading={searchedSeasonIds.get('_status') === FETCHING}
                  label='Season title'
                  name='seasonId'
                  options={searchedSeasonIds.get('data').toJS()}
                  placeholder='Season title'
                  onChange={() => {
                    this.props.dispatch(this.props.change('title', null));
                  }} />}
                {currentSeriesEntryId && currentSeasonId && <Field
                  component={TextInput}
                  label='Episode number'
                  name='number'
                  placeholder='Episode number'
                  required/>}
                {currentSeriesEntryId && currentSeasonId && <Field
                  component={TextInput}
                  label='Episode title'
                  name={`title.${_activeLocale}`}
                  placeholder='Episode title'
                  required/>}
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
                      imageUrl={currentEpisode.getIn([ 'profileImage', currentEpisode.get('defaultLocale'), 'url' ])}/>
                  </div>
                </div>
              </Section>
            </Tab>
            <Tab title='Availability'>
              {/* TODO */}
              <Section>
                <FormSubtitle first>Content</FormSubtitle>
                ...
              </Section>
            </Tab>
            <Tab title='Audience'>
              {/* TODO */}
              <Section>
                <FormSubtitle first>Location</FormSubtitle>
                ...
              </Section>
            </Tab>
          </Tabs>
        </EditTemplate>
        {children}
      </Root>
    );
  }

}
