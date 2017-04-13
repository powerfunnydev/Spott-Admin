/* eslint-disable react/no-set-state */
import Radium from 'radium';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ReactModal from 'react-modal';

// Note: get merged with defaults by react-modal
const dialogStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  content: {
    // Set width and center horizontally
    margin: 'auto',
    maxWidth: 400,
    // Internal padding
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 35,
    paddingRight: 35,
    // Fit height to content, centering vertically
    bottom: 'auto',
    top: '50%',
    transform: 'translateY(-50%)'
  }
};

@Radium
export default class WhatToTag extends Component {

  static propTypes = {
    // Callback for closing the modal
    onCloseModal: PropTypes.func.isRequired,
    // Callback for opening the "create character" modal
    onOpenCreateCharacterMarker: PropTypes.func.isRequired,
    // Callback for opening the "create product" modal
    onOpenCreateProductMarker: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onRequestClose = ::this.onRequestClose;
    this.onOpenCreateCharacterMarker = ::this.onOpenCreateCharacterMarker;
    this.onOpenCreateProductMarker = ::this.onOpenCreateProductMarker;
  }

  componentDidMount () {
    // Automatically select the "product" button
    setTimeout(() => {
      ReactDOM.findDOMNode(this.productButton).focus();
    }, 0);
  }

  /**
   * Closes this modal.
   * Invoked when pressing escape or when clicking outside the modal region.
   */
  onRequestClose () {
    this.props.onCloseModal();
  }

  /**
   * Closes this modal, opening the "add character" instead.
   */
  onOpenCreateCharacterMarker (e) {
    e.preventDefault();
    this.props.onOpenCreateCharacterMarker();
  }

  /**
   * Closes this modal, opening the "add product" instead.
   */
  onOpenCreateProductMarker (e) {
    e.preventDefault();
    this.props.onOpenCreateProductMarker();
  }

  static styles = {
    title: {
      // Basic style
      color: 'rgb(0, 115, 211)',
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
      fontSize: '30px',
      // Positioning
      margin: 0,
      paddingBottom: 25,
      paddingTop: 0,
      textAlign: 'center'
    },
    button: {
      border: '1px solid rgb(232, 232, 232)',
      borderRadius: 4,
      color: 'rgb(123, 129, 134)',
      fontFamily: 'Rubik-Medium',
      fontSize: '16px',
      paddingBottom: 8,
      paddingTop: 8,
      marginBottom: 12,
      width: '100%',
      ':hover': {
        backgroundColor: 'rgb(0, 115, 211)',
        color: 'white'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;

    return (
      <ReactModal
        isOpen
        style={dialogStyle}
        onRequestClose={this.onRequestClose}>
        <h1 style={styles.title}>What are you tagging?</h1>
        <button key='character' style={styles.button} onClick={this.onOpenCreateCharacterMarker}>Character</button>
        <button key='product' ref={(ref) => { this.productButton = ref; }} style={styles.button} onClick={this.onOpenCreateProductMarker}>Product</button>
      </ReactModal>
    );
  }

}
