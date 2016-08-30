import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import { reduxForm, Field } from 'redux-form/immutable';
import Radium from 'radium';
import { buttonStyles } from '../../_common/styles';
import localized from '../../_common/localized';
const crossImage = require('./cross.svg');

function validate (values) {
  const validationErrors = {};
  const emailError = !values.get('email') || !values.get('email').match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (emailError) { validationErrors.email = 'invalid'; }
  const passwordError = !values.get('password') || !values.get('password').match(/^.{6,}$/);
  if (passwordError) { validationErrors.password = 'invalid'; }
  // Done
  return validationErrors;
}

/**
 * Dialog style used for this modal.
 * Note: get merged with defaults by react-modal
 */
const dialogStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.80)'
  },
  content: {
    backgroundColor: 'transparent',
    border: 'none',
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    // Set width and center horizontally
    margin: 'auto',
    minWidth: 200,
    maxWidth: 400,
    // Internal padding
    padding: 0,
    // Fit height to content, centering vertically
    bottom: 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
    overflow: 'visible'
  }
};

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
  form: 'login',
  validate
})
@Radium
export default class LoginModal extends Component {

  static propTypes = {
    onCancel: PropTypes.func.isRequired, // Callback for closing the dialog and clearing the form.
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
  }

  onCloseClick (e) {
    e.preventDefault();
    this.props.onCancel();
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
    cross: {
      cursor: 'pointer',
      position: 'absolute',
      top: -45,
      right: -45
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
    const { error, handleSubmit, onCancel, t } = this.props;
    return (
      <ReactModal isOpen style={dialogStyle} onRequestClose={onCancel}>
        <div style={styles.container}>
          {/* Although this is a button, we chose a <div> for accessibility.
              The dialog can be canceled by pressing 'escape', so we remove the
              cross from tab focus. */}
          <div style={styles.cross} onClick={this.onCloseClick}>
            <img alt='Close' src={crossImage} style={styles.crossImage} />
          </div>
          <form style={styles.content} onSubmit={handleSubmit}>
            <Field component={renderField} name='email' placeholder={t('login.email')} type='text' />
            <Field component={renderField} name='password' placeholder={t('login.password')} type='password' />

            {error && typeof error === 'string' && <div style={styles.error}>{t(error)}</div>}

            {/* <button style={styles.forgotPassword}>Forgot Password?</button> */}
            <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.pink, styles.button ]} type='submit'>{t('login.submitButton')}</button>
          </form>
        </div>
      </ReactModal>
    );
  }

}
