import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import { push as routerPush } from 'react-router-redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../_common/styles';
import SelectInput from '../../_common/inputs/selectInput';
import localized from '../../_common/localized';
import { FETCHING } from '../../../constants/statusTypes';
import CreateModal from '../../_common/createModal';
import * as actions from './actions';
import selector from './selector';

function validate (values) {
  const validationErrors = {};
  const { email, password } = values.toJS();
  const emailError = !email;
  // !values.get('email') || !values.get('email').match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (emailError) { validationErrors.email = 'invalid'; }
  const passwordError = !password || !password.match(/^.{6,}$/);
  if (passwordError) { validationErrors.password = 'invalid'; }
  // Done
  return validationErrors;
}

const textBoxStyle = {
  textInput: {
    color: 'rgba(0, 0, 0, 0.502)',
    width: '100%',
    height: '46px',
    border: '1px solid rgb(187, 190, 193)',
    borderRadius: '4px',
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: 'Rubik-Regular',
    fontSize: '18px',
    marginBottom: 20
  },
  textInputError: {
    border: '1px #ff0000 solid'
  }
};

const renderField = Radium((props) => {
  return (
    <input
      autoFocus={props.autoFocus}
      placeholder={props.placeholder}
      style={[ textBoxStyle.textInput, props.meta.touched && props.meta.error && textBoxStyle.textInputError, props.style ]}
      type={props.type}
      {...props.input} />
  );
});

@localized
@connect(selector, (dispatch) => ({
  routerPush: bindActionCreators(routerPush, dispatch),
  searchMedia: bindActionCreators(actions.searchMedia, dispatch),
  // TODO
  submit: bindActionCreators(actions.searchMedia, dispatch)
}))
@reduxForm({
  form: 'tvGuideCreateEntry',
  validate
})
@Radium
export default class LoginModal extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPush: PropTypes.func.isRequired,
    searchSeries: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.onForgotPasswordClick = ::this.onForgotPasswordClick;
    this.submit = ::this.submit;
  }

  // The autofocus attribute will only work when the page loads initially.
  // When a popup opens we still need to manually focus the field.
  componentDidMount () {
    // setTimeout(() => {
    //   ReactDOM.findDOMNode(this._email).focus();
    // }, 0);
  }

  async submit (form) {
    try {
      await this.props.submit(form.toJS());
      this.props.routerPush((this.props.location && this.props.location.state && this.props.location.state.returnTo) || '/');
    } catch (error) {
      if (error === 'incorrect') {
        throw new SubmissionError({ _error: 'login.errors.incorrect' });
      }
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPush((this.props.location && this.props.location.state && this.props.location.state.returnTo) || '/');
  }

  onForgotPasswordClick () {
    this.props.routerPush({ pathname: '/forgotpassword', returnTo: this.props.location.pathname });
  }

  static styles = {
    error: {
      color: '#ff0000',
      fontSize: '1em',
      marginBottom: '1em'
    },
    button: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 18,
      paddingRight: 18,
      textTransform: 'uppercase',
      width: 'auto',
      float: 'right'
    },
    forgotPassword: {
      fontSize: '13px',
      color: 'white',
      padding: '8px 0'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { error, handleSubmit, mediaById, searchMedia, searchedMediumIds, medium, t } = this.props;

    return (
      <CreateModal isOpen title='New TV guide entry' onClose={this.onCloseClick}>
        <FormSubtitle style={{ marginTop: 0 }}>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(id) => `${mediaById.getIn([ id, 'title' ])} (${t(`mediaTypes.${mediaById.getIn([ id, 'type' ])}`)})`}
          getOptions={searchMedia}
          isLoading={searchedMediumIds.get('_status') === FETCHING}
          label='Medium title'
          name='mediumId'
          options={searchedMediumIds.get('data').toJS()}
          placeholder='Series'
          required />
        {medium.get('type') === 'TV_SERIE' &&
          <div>
            <Field
              component={SelectInput}
              getItemText={(id) => `${mediaById.getIn([ id, 'title' ])} (${t(`mediaTypes.${mediaById.getIn([ id, 'type' ])}`)})`}
              getOptions={searchSeasons}
              isLoading={searchedMediumIds.get('_status') === FETCHING}
              label='Season'
              name='seasonId'
              options={searchedMediumIds.get('data').toJS()}
              placeholder='Season'
              required />
          </div>}
        <FormSubtitle>Airtime</FormSubtitle>
        {/* <Field component={renderField} name='email' placeholder={t('login.email')} ref={(c) => { this._email = c; }} />
        <Field component={renderField} name='password' placeholder={t('login.password')} type='password' /> */}
      </CreateModal>
    );
  }

}
