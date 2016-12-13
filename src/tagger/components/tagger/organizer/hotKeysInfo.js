import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import colors from '../colors';
import Arrow from './images/arrow';

const arrowKeys = require('./images/arrowKeys.svg');
const sKey = require('./images/sKey.svg');
const spaceKey = require('./images/spaceKey.svg');
const xKey = require('./images/xKey.svg');

const containerStyle = {
  textAlign: 'center',
  paddingLeft: '1.25em',
  paddingRight: '1.25em'
};
const imageStyle = {
  marginBottom: '0.75em'
};
const textStyle = {
  color: colors.warmGray,
  fontSize: '0.75em',
  fontWeight: 500
};
function HotKey ({ image, text }) {
  return (
    <div style={containerStyle}>
      <img src={image} style={imageStyle}/>
      <div style={textStyle}>{text}</div>
    </div>
  );
}
HotKey.propTypes = {
  image: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

@Radium
export default class HotKeysInfo extends Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onToggle = ::this.onToggle;
  }

  onToggle (e) {
    e.preventDefault();
    this.props.onToggle();
  }

  static styles = {
    toggleShortkeys: {
      container: {
        display: 'inline-block',
        padding: '0.75em'
      },
      button: {
        color: 'white',
        fontSize: '0.813em',
        display: 'flex',
        alignItems: 'center'
      }
    },
    container: {
      backgroundColor: colors.black2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      textAlign: 'center'
    },
    keys: {
      wrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '1.563em',
        paddingTop: '2em'
      },
      base: {
        height: '6.938em',
        overflow: 'hidden',
        transition: 'height 0.5s ease-in'
      },
      closed: {
        height: 0,
        transition: 'height 0.5s ease-out'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const isOpen = this.props.isOpen;

    return (
      <div style={styles.container}>
        {/* Hide or show the hotkeys. */}
        <div style={[ styles.keys.base, !isOpen && styles.keys.closed ]}>
          <div style={styles.keys.wrapper}>
            <HotKey image={arrowKeys} text='navigate frames' />
            <HotKey image={spaceKey} text='zoom in/out' />
            <HotKey image={sKey} text='insert scene' />
            <HotKey image={xKey} text='(un)hide scene' />
          </div>
        </div>
        <div style={styles.toggleShortkeys.container}>
          <button style={styles.toggleShortkeys.button} onClick={this.onToggle}>
            <Arrow position={isOpen ? 'UP' : 'DOWN'} />&nbsp;&nbsp;&nbsp;&nbsp;{isOpen ? 'Hide Shortkeys' : 'Show Shortkeys'}
          </button>
        </div>
      </div>
    );
  }
}
