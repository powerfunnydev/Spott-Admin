import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import Radium from 'radium';
import { buttonStyles } from '../../_common/styles';
const crossImage = require('./cross.svg');

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
    input: {
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
    const { onCancel } = this.props;
    return (
      <ReactModal isOpen style={dialogStyle} onRequestClose={onCancel}>
        <div style={styles.container}>
          {/* Although this is a button, we chose a <div> for accessibility.
              The dialog can be canceled by pressing 'escape', so we remove the
              cross from tab focus. */}
          <div style={styles.cross} onClick={this.onCloseClick}>
            <img alt='Close' src={crossImage} style={styles.crossImage} />
          </div>
          <div style={styles.content}>
            <input placeholder='Username' style={styles.input} type='text' />
            <input placeholder='Password' style={styles.input} type='password' />

            <button style={styles.forgotPassword}>Forgot Password?</button>
            <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.pink, styles.button ]} onClick={onCancel}>Sign In</button>
          </div>
        </div>
      </ReactModal>
    );
  }

}
