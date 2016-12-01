import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import Radium from 'radium';
import localized from '../localized';
import { colors, buttonStyles, fontWeights, makeTextStyle } from '../styles';
import Button from '../buttons/button';
import Checkbox from '../inputs/checkbox';
import { Field } from 'redux-form/immutable';
const crossImage = require('./cross.svg');

/**
 * Dialog style used for this modal.
 * Note: we don't use react-modal because it gave some blur issues when
 * we vertically allign transform: 'translateY(-50%)'
 */
const dialogStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    top: 0,
    left: 0,
    right: 0,
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'none',
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    width: '100%',
    // Set width and center horizontally
    minWidth: 200,
    maxWidth: 430,
    // Internal padding
    padding: 0,
    // Fit height to content, centering vertically
    bottom: 'auto',
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
export default class PersistModal extends Component {

  static propTypes = {
    children: PropTypes.node,
    createAnother: PropTypes.bool,
    error: PropTypes.any,
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.object,
    submitButtonText: PropTypes.string,
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
      paddingBottom: '1em',
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
      color: '#536970',
      fontWeight: 'normal'
    },
    wrapper: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)'
    },
    alignRight: {
      display: 'flex',
      marginLeft: 'auto'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    text: {
      ...makeTextStyle(fontWeights.regular, '12px'),
      color: colors.darkGray2,
      paddingRight: '5px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { createAnother, children, error, isOpen, style, t, title, onClose,
      onSubmit, submitButtonText } = this.props;
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
                <div style={styles.alignRight}>
                  {createAnother &&
                    <Field
                      component={Checkbox}
                      label='Create another'
                      name='createAnother'/>}
                  <Button key='cancel' style={[ buttonStyles.white ]} text='Cancel' type='button' onClick={(e) => { e.preventDefault(); onClose(); }} />
                  <Button key='submit' style={[ buttonStyles.blue ]} text={submitButtonText || 'Create'} type='submit' />
                </div>
              </div>
            </form>
          </div>
        </RemoveBodyScrollbar>
      </ReactModal>
    );
  }
}
