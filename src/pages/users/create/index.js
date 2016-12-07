import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../_common/styles';
import TextInput from '../../_common/inputs/textInput';
import localized from '../../_common/decorators/localized';
import PersistModal from '../../_common/components/persistModal';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../actions/global';
import { load as loadList } from '../list/actions';

function validate (values, { t }) {
  const validationErrors = {};
  const { userName, firstName, lastName, email } = values.toJS();
  if (!userName) { validationErrors.userName = t('common.errors.required'); }
  if (!firstName) { validationErrors.firstName = t('common.errors.required'); }
  if (!lastName) { validationErrors.lastName = t('common.errors.required'); }
  if (!email) { validationErrors.email = t('common.errors.required'); }

  // Done
  return validationErrors;
}

@localized
@connect(null, (dispatch) => ({
  loadList: bindActionCreators(loadList, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'userCreate',
  validate
})
@Radium
export default class CreateUserModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async componentWillMount () {
    const init = {};
    if (this.props.params.id) {
      init.broadcasterId = this.props.params.id;
    }
    if (this.props.location && this.props.location.query && this.props.location.query.userName) {
      init.userName = this.props.location.query.userName;
    }
    this.props.initialize(init);
  }

  async submit (form) {
    try {
      const { location, submit, dispatch, change, reset } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        this.props.loadList(loc.query);
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
    this.props.routerPushWithReturnTo('users', true);
  }

  render () {
    const { handleSubmit } = this.props;
    return (
      <PersistModal createAnother isOpen title='Create User'
        onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={TextInput}
          label='Username'
          name='userName'
          placeholder='Username'
          required/>
        <Field
          component={TextInput}
          label='First Name'
          name='firstName'
          placeholder='First Name'
          required/>
        <Field
          component={TextInput}
          label='Last Name'
          name='lastName'
          placeholder='Last Name'
          required/>
        <Field
          component={TextInput}
          label='Email'
          name='email'
          placeholder='Email'
          required/>
      </PersistModal>
    );
  }

}
