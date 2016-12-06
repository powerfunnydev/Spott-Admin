import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
// import Line from '../../../_common/components/line';
import { Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import SpecificHeader from '../../header';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Dropzone from '../../../_common/dropzone';
import Label from '../../../_common/inputs/_label';
import selector from './selector';
import { SERIES_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import CreateLanguageModal from '../../_languageModal/create';
import LanguageBar from '../../../_common/components/languageBar';
import BreadCrumbs from '../../../_common/components/breadCrumbs';

function validate (values, { t }) {
  const validationErrors = {};
  const { _activeLocale, defaultLocale, title } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (title && !title[_activeLocale]) { validationErrors.title = validationErrors.title || {}; validationErrors.title[_activeLocale] = t('common.errors.required'); }
// Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadSeriesEntry: bindActionCreators(actions.loadSeriesEntry, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  uploadPosterImage: bindActionCreators(actions.uploadPosterImage, dispatch),
  uploadProfileImage: bindActionCreators(actions.uploadProfileImage, dispatch),
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
    closeModal: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    currentSeriesEntry: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadSeriesEntry: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    t: PropTypes.func.isRequired,
    uploadPosterImage: PropTypes.func.isRequired,
    uploadProfileImage: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
    this.openCreateLanguageModal = :: this.openCreateLanguageModal;
    this.languageAdded = :: this.languageAdded;
    this.removeLanguage = :: this.removeLanguage;
  }

  async componentWillMount () {
    if (this.props.params.seriesEntryId) {
      const editObj = await this.props.loadSeriesEntry(this.props.params.seriesEntryId);
      console.log('editObj', editObj);
      this.props.initialize({
        ...editObj,
        _activeLocale: editObj.defaultLocale
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/series', true);
  }

  languageAdded (form) {
    const { language } = form && form.toJS();
    const { closeModal, dispatch, change, supportedLocales } = this.props;
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      dispatch(change('locales', newSupportedLocales));
      dispatch(change('_activeLocale', language));
    }
    closeModal();
  }

  removeLanguage () {
    const { dispatch, change, supportedLocales, _activeLocale, defaultLocale } = this.props;
    if (_activeLocale) {
      const newSupportedLocales = supportedLocales.delete(supportedLocales.indexOf(_activeLocale));
      dispatch(change('locales', newSupportedLocales));
      dispatch(change('_activeLocale', defaultLocale));
    }
  }

  openCreateLanguageModal () {
    this.props.openModal(SERIES_CREATE_LANGUAGE);
  }

  async submit (form) {
    const { supportedLocales, params: { seriesEntryId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        locales: supportedLocales.toArray(),
        seriesEntryId
      });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
  }

  static styles = {
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
    paddingLeftUploadImage: {
      paddingLeft: '24px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { _activeLocale, errors, closeModal, currentModal, supportedLocales, defaultLocale,
      currentSeriesEntry, location, handleSubmit } = this.props;

    return (
        <Root style={styles.backgroundRoot}>
          <Header currentLocation={location} hideHomePageLinks />
          <SpecificHeader/>
          <BreadCrumbs hierarchy={[
            { title: 'List', url: '/content/series' },
            { title: currentSeriesEntry.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          {currentModal === SERIES_CREATE_LANGUAGE &&
            <CreateLanguageModal
              supportedLocales={supportedLocales}
              onCloseClick={closeModal}
              onCreate={this.languageAdded}/>}
          <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs showPublishStatus>
              <Tab title='Details'>
                <Section noPadding style={styles.background}>
                  <LanguageBar
                    _activeLocale={_activeLocale}
                    defaultLocale={defaultLocale}
                    errors={errors}
                    openCreateLanguageModal={this.openCreateLanguageModal}
                    removeLanguage={this.removeLanguage}
                    supportedLocales={supportedLocales}
                    onSetDefaultLocale={this.onSetDefaultLocale}/>
                </Section>
                <Section>
                  <FormSubtitle first>General</FormSubtitle>
                  <Field
                    component={TextInput}
                    label='Series title'
                    name={`title.${_activeLocale}`}
                    placeholder='Season title'
                    required/>
                  <Field
                    component={TextInput}
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
                      imageUrl={currentSeriesEntry.getIn([ 'profileImage', _activeLocale ]) &&
                        `${currentSeriesEntry.getIn([ 'profileImage', _activeLocale, 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadProfileImage({ seriesEntryId: this.props.params.seriesEntryId, image: file, callback }); }}/>
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Poster image' />
                    <Dropzone
                      accept='image/*'
                      imageUrl={currentSeriesEntry.getIn([ 'posterImage', _activeLocale ]) &&
                        `${currentSeriesEntry.getIn([ 'posterImage', _activeLocale, 'url' ])}?height=203&width=360`}
                      onChange={({ callback, file }) => { this.props.uploadPosterImage({ seriesEntryId: this.props.params.seriesEntryId, image: file, callback }); }}/>
                  </div>
                </div>
              </Section>
            </Tab>
            {/* TODO
            <Tab title='Audience'>
              <Section>
                <FormSubtitle first>Audience</FormSubtitle>
              </Section>
            </Tab>*/}
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
