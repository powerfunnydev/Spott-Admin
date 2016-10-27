import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import Radium from 'radium';
import localized from '../localized';
import { buttonStyles, fontWeights, makeTextStyle } from '../styles';

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
    maxWidth: 430,
    // Internal padding
    padding: 0,
    // Fit height to content, centering vertically
    bottom: 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
    overflow: 'visible'
  }
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

@localized
@Radium
export default class CreateModal extends Component {

  static propTypes = {
    children: PropTypes.node,
    error: PropTypes.any,
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.object,
    t: PropTypes.func.isRequired,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  static styles = {
    footer: {
      alignItems: 'center',
      backgroundColor: '#eaeced',
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '0.625em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em',
      paddingTop: '0.625em',
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      border: 'solid 1px #ced6da'
    },
    header: {
      alignItems: 'center',
      backgroundColor: '#eaeced',
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '0.813em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em',
      paddingTop: '0.938em',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      border: 'solid 1px #ced6da'
    },
    content: {
      backgroundColor: '#ffffff',
      paddingBottom: '1.875em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em',
      paddingTop: '1.875em',
      borderLeft: 'solid 1px #ced6da',
      borderRight: 'solid 1px #ced6da'
    },
    cross: {
      cursor: 'pointer',
      height: '1em',
      width: '1em'
    },
    crossImage: {
      width: '100%'
    },
    title: {
      ...makeTextStyle(fontWeights.regular, '1.125em', 0.5),
      color: '#536970'
    },
    wrapper: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, error, isOpen, style, t, title, onClose, onSubmit } = this.props;
    return (
      <ReactModal
        isOpen={isOpen}
        style={style || dialogStyle}
        onRequestClose={() => onClose()}>
        <RemoveBodyScrollbar>
          <div style={styles.wrapper}>
            <div style={styles.header}>
              <h1 style={styles.title}>{title}</h1>
              {/* Although this is a button, we chose a <div> for accessibility.
                  The dialog can be canceled by pressing 'escape', so we remove the
                  cross from tab focus. */}
              <div style={styles.cross} onClick={(e) => {
                e.preventDefault();
                onClose();
              }}>
                <img alt='Close' src={crossImage} style={styles.crossImage} />
              </div>
            </div>
            {/* handleSubmit(this.submit) */}
            <form onSubmit={onSubmit}>
              <div style={styles.error}>
                {error && typeof error === 'string' && t(error)}
              </div>
              <div style={styles.content}>
                {children}
              </div>
              <div style={styles.footer}>
                <div style={{ marginLeft: 'auto' }}>
                  <button key='cancel' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white ]} type='button' onClick={(e) => { e.preventDefault(); onClose(); }}>Cancel</button>
                  <button key='submit' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='submit'>Create</button>
                </div>
              </div>
            </form>
          </div>
        </RemoveBodyScrollbar>
      </ReactModal>
    );
  }
}
