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
import LanguageBar from '../../../_common/components/languageBar';
import CreateLanguageModal from '../../../content/_languageModal/create';
import { DATALABEL_CREATE_LANGUAGE } from '../../../../constants/modalTypes';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { loadAll as loadTypes } from '../../datalabeltypes/list/actions';
import selector from './selector';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { fromJS } from 'immutable';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, name } = values.toJS();

  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!name) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  closeModal: bindActionCreators(actions.closeModal, dispatch),
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  loadTypes: bindActionCreators(loadTypes, dispatch),
  openModal: bindActionCreators(actions.openModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  submit: bindActionCreators(actions.submit, dispatch)
}))
@reduxForm({
  form: 'datalabelEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditDatalabel extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentDatalabel: ImmutablePropTypes.map.isRequired,
    currentModal: PropTypes.string,
    datalabeltypes: ImmutablePropTypes.map.isRequired,
    defaultLocale: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    formValues: ImmutablePropTypes.map,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    loadTypes: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
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
    const datalabelId = this.props.params.datalabelId;
    if (datalabelId) {
      const editObj = await this.props.load(datalabelId);
      this.props.initialize({ ...editObj, _activeLocale: editObj.defaultLocale });
    }
    await this.props.loadTypes();
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/datalabels', true);
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

  openCreateLanguageModal () {
    if (this.props.onBeforeChangeTab()) {
      this.props.openModal(DATALABEL_CREATE_LANGUAGE);
    }
  }

  async submit (form) {
    try {
      await this.props.submit({ ...form.toJS(), id: this.props.params.datalabelId });
      this.props.initialize(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onSetDefaultLocale (locale) {
    const { change, dispatch, _activeLocale } = this.props;
    dispatch(change('defaultLocale', _activeLocale));
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
    const { currentDatalabel, location, handleSubmit, datalabeltypes, currentModal, supportedLocales, closeModal, _activeLocale, defaultLocale, errors } = this.props;
    const { styles } = this.constructor;
    const types = datalabeltypes.get('data').toJS();
    let typedata = {};
    for (const type in types) {
      typedata = { ...typedata, [types[type].id]: types[type].name };
    }

    return (
      <SideMenu>
        <Root style={styles.background}>
          <Header hierarchy={[
            { title: 'Labels', url: '/settings/datalabels' },
            { title: currentDatalabel.get('name'), url: location } ]}/>
          {currentModal === DATALABEL_CREATE_LANGUAGE &&
          <CreateLanguageModal
            supportedLocales={supportedLocales}
            onCloseClick={closeModal}
            onCreate={this.languageAdded}>
            <Field
              component={TextInput}
              label='Label Name'
              name='name'
              placeholder='Label Name'
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
                  <FormSubtitle first>General</FormSubtitle>
                  <Field
                    component={TextInput}
                    label='Label Name'
                    name={`name.${_activeLocale}`}
                    placeholder='Label Name'
                    required/>
                  <Field
                    component={SelectInput}
                    getItemText={(id) => typedata[id]}
                    name='type'
                    options={Object.keys(typedata)}
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
