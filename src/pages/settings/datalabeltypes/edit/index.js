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
import LanguageBar from '../../../_common/components/languageBar';
import CreateLanguageModal from '../../../content/_languageModal/create';
import { DATALABELTYPE_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { fromJS } from 'immutable';

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
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
}))
@reduxForm({
  form: 'datalabeltypeEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditDatalabeltype extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    defaultLocale: PropTypes.string,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    popUpMessage: PropTypes.object,
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
    supportedLocales: ImmutablePropTypes.list,
    closeModal: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    closePopUpMessage: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    onBeforeChangeTab: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
    this.onSetDefaultLocale = ::this.onSetDefaultLocale;
    this.openCreateLanguageModal = ::this.openCreateLanguageModal;
    this.languageAdded = ::this.languageAdded;
    this.removeLanguage = ::this.removeLanguage;
  }

  async componentWillMount () {
    const datalabeltypeId = this.props.params.datalabeltypeId;
    if (datalabeltypeId) {
      const editObj = await this.props.load(datalabeltypeId);
      this.props.initialize({ ...editObj, _activeLocale: editObj.defaultLocale });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/datalabeltypes', true);
  }

  languageAdded (form) {
    const { language, name } = form && form.toJS();
    const { closeModal, supportedLocales } = this.props;
    const formValues = this.props.formValues.toJS();
    if (language) {
      const newSupportedLocales = supportedLocales.push(language);
      this.submit(fromJS({
        ...formValues,
        locales: newSupportedLocales.toJS(),
        _activeLocale: language,
        name: { ...formValues.name, [language]: name }
      }));
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

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
  }

  openCreateLanguageModal () {
    if (this.props.onBeforeChangeTab()) {
      this.props.openModal(DATALABELTYPE_CREATE_LANGUAGE);
    }
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
    const { currentDatalabeltype, location, currentModal, handleSubmit, supportedLocales, closeModal, _activeLocale, defaultLocale, errors } = this.props;
    console.log(supportedLocales, _activeLocale, defaultLocale);
    const { styles } = this.constructor;
    return (
      <SideMenu>
        <Root style={styles.background}>
          <Header hierarchy={[
            { title: 'Datalabeltypes', url: '/settings/datalabeltypes' },
            { title: currentDatalabeltype.get('name'), url: location } ]}/>
          {currentModal === DATALABELTYPE_CREATE_LANGUAGE &&
          <CreateLanguageModal
            supportedLocales={supportedLocales}
            onCloseClick={closeModal}
            onCreate={this.languageAdded}>
            <Field
              component={TextInput}
              label='Brand name'
              name='name'
              placeholder='Brand name'
              required />
          </CreateLanguageModal>}
          <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs>
              <TabList style={tabStyles.tabList}>
                <Tab style={tabStyles.tab}>Details</Tab>
              </TabList>
              <TabPanel>
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
                <Section first>
                  <FormSubtitle first>Content</FormSubtitle>
                  <Field
                    component={TextInput}
                    label='Name'
                    name={`name.${_activeLocale}`}
                    placeholder='Datalabeltype name'
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
