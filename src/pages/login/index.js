import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { buttonStyles } from '../_common/styles';
import localized from '../_common/localized';
import Modal from '../_common/modal';
import * as actions from '../../actions/users';
import { routerPushWithReturnTo } from '../../actions/global';

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
@connect(null, (dispatch) => ({
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  submit: bindActionCreators(actions.login, dispatch)
}))
@reduxForm({
  form: 'login',
  validate
})
@Radium
export default class LoginModal extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
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
    setTimeout(() => {
      ReactDOM.findDOMNode(this._email).focus();
    }, 0);
  }

  async submit (form) {
    try {
      await this.props.submit(form.toJS());
      this.props.routerPushWithReturnTo('/');
    } catch (error) {
      if (error === 'incorrect') {
        throw new SubmissionError({ _error: 'login.errors.incorrect' });
      }
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('/', true);
  }

  onForgotPasswordClick () {
    this.props.routerPushWithReturnTo('/forgotpassword');
  }

  static styles = {
    error: {
      color: '#ff0000',
      fontSize: '1em',
      marginBottom: '1em'
    },
    container: {
      position: 'relative'
    },
    content: {
      padding: '20px 34px 20px 34px'
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
    const { error, handleSubmit, t } = this.props;

    return (
      <Modal isOpen onClose={this.onCloseClick}>
        <div style={styles.container}>
          <form style={styles.content} onSubmit={handleSubmit(this.submit)}>
            <Field component={renderField} name='email' placeholder={t('login.email')} ref={(c) => { this._email = c; }} />
            <Field component={renderField} name='password' placeholder={t('login.password')} type='password' />

            {error && typeof error === 'string' && <div style={styles.error}>{t(error)}</div>}

            <button style={styles.forgotPassword} type='button' onClick={this.onForgotPasswordClick}>{t('login.forgotPassword')}</button>
            <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.pink, styles.button ]} type='submit'>{t('login.submitButton')}</button>
          </form>
        </div>
      </Modal>
    );
  }

}
