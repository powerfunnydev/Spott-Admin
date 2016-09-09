import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { reduxForm, Field } from 'redux-form/immutable';
import Radium from 'radium';
import { buttonStyles } from '../_common/styles';
import localized from '../_common/localized';
import Modal from '../_common/modal';

function validate (values) {
  const validationErrors = {};
  const emailError = !values.get('email') || !values.get('email').match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (emailError) { validationErrors.email = 'invalid'; }
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
@reduxForm({
  form: 'forgotPassword',
  validate
})
@Radium
export default class ForgotPasswordModal extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired, // Callback for closing the dialog and clearing the form.
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.onSubmit = ::this.onSubmit;
    // We show that a mail has been send to the user.
    this.state = { email: null };
  }

  // The autofocus attribute will only work when the page loads initially.
  // When a popup opens we still need to manually focus the field.
  componentDidMount () {
    setTimeout(() => {
      ReactDOM.findDOMNode(this._email).focus();
    }, 0);
  }

  onCloseClick (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  /* eslint-disable react/no-set-state */
  async onSubmit () {
    const { email } = await Reflect.apply(this.props.handleSubmit, this, arguments);
    this.setState({ email });
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
    sendEmail: {
      color: '#ffffff',
      marginBottom: '1em'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { error, onCancel, t } = this.props;
    const { email } = this.state;
    return (
      <Modal isOpen onClose={onCancel}>
        <div style={styles.container}>
          {email
            ? <div style={styles.content}>
                <p style={styles.sendEmail}>{t('forgotPassword.sendEmail', { email })}</p>
                <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.pink, styles.button ]} onClick={this.onCloseClick}>{t('common.ok')}</button>
              </div>
            : <form style={styles.content} onSubmit={this.onSubmit}>
              <Field component={renderField} name='email' placeholder={t('forgotPassword.email')} ref={(c) => { this._email = c; }} type='email' />

              {error && typeof error === 'string' && <p style={styles.error}>{t(error)}</p>}

              <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.pink, styles.button ]} type='submit'>{t('forgotPassword.submitButton')}</button>
            </form>}
        </div>
      </Modal>
    );
  }

}
