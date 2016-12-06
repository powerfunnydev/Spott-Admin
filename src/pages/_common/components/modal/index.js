import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import Radium from 'radium';

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

const crossStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: -45,
  right: -45
};

class RemoveBodyScrollbar extends Component {
  static propTypes = {
    children: PropTypes.node
  }
  componentDidMount () {
    this._originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  componentWillUnmount () {
    document.body.style.overflow = this._originalOverflow;
  }
  render () {
    return this.props.children;
  }
}
const Modal = Radium((props) => (
  <ReactModal
    isOpen={props.isOpen}
    style={props.style || dialogStyle}
    onRequestClose={() => {
      props.onClose();
    }}>
      {/* Although this is a button, we chose a <div> for accessibility.
          The dialog can be canceled by pressing 'escape', so we remove the
          cross from tab focus. */}
      {/* <div style={dialogButtonStyle} onClick={props.onClick}>
        <img alt='Close' src={crossImage} />
      </div> */}
      {/* Although this is a button, we chose a <div> for accessibility.
          The dialog can be canceled by pressing 'escape', so we remove the
          cross from tab focus. */}
      <div style={crossStyle} onClick={(e) => {
        e.preventDefault();
        props.onClose();
      }}>
        <img alt='Close' src={crossImage} />
      </div>
      <RemoveBodyScrollbar>
        {props.children}
      </RemoveBodyScrollbar>
  </ReactModal>
));

Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;
