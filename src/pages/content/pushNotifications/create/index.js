import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
import localized from '../../../_common/decorators/localized';
import PersistModal from '../../../_common/components/persistModal';
import { load as loadList } from '../list/actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, message } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!message) { validationErrors.message = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadPushNotifications: bindActionCreators(loadList, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'pushNotificationsCreate',
  validate
})
@Radium
export default class CreatePushNotificationModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadPushNotifications: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object,
    reset: PropTypes.func.isRequired,
    route: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  componentWillMount () {
    this.props.initialize({
      defaultLocale: this.props.currentLocale
    });
  }
  async submit (form) {
    try {
      // const { route: { load }, loadProducts, location, submit, dispatch, change, reset } = this.props;
      const { route: { load }, loadPushNotifications, location, submit, dispatch, change, reset } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      load && load(this.props);
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        loadPushNotifications(loc.query);
      }
      if (createAnother) {
        await dispatch(reset());
        await dispatch(change('createAnother', true));
      } else {
        this.onCloseClick();
      }
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('/content/push-notifications', true);
  }

  render () {
    const { handleSubmit, localeNames } = this.props;
    return (
      <PersistModal createAnother isOpen title='Create Product' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          filter={(option, filter) => {
            return option && filter ? localeNames.get(option.value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
          }}
          getItemText={(language) => { return localeNames.get(language); }}
          label='Default language'
          name='defaultLocale'
          options={localeNames.keySeq().toArray()}
          placeholder='Default language'/>
        <Field
          component={TextInput}
          label='Message'
          name='message'
          placeholder='Placeholder text'
          required/>
      </PersistModal>
    );
  }

}
