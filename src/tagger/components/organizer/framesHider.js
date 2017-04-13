/* eslint-disable no-nested-ternary */
import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

// Frame visibility images
const eyeCrossedImage = require('./images/eyeCrossed.svg');

@Radium
export default class FramesHider extends Component {

  static propTypes = {
    // Information visualized by this component
    isHidden: PropTypes.bool.isRequired,
    // Hide one frame?
    single: PropTypes.bool,
    // Override the inline-styles of the root element.
    style: PropTypes.object,
    // Actions triggered by this component
    onToggleHidden: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onToggleHidden = ::this.onToggleHidden;
  }

  onToggleHidden (e) {
    e.preventDefault();
    this.props.onToggleHidden();
  }

  static styles = {
    button: {
      base: {
        border: '1px solid #fff',
        borderRadius: 2,
        display: 'flex',
        height: 24,
        justifyContent: 'center',
        width: 24
      },
      hidden: {
        backgroundColor: '#ec410f',
        border: '1px solid #ec410f'
      }
    },
    image: {
      width: 16
    }
  };

  render () {
    const { styles } = this.constructor;
    const { isHidden, single, style } = this.props;

    return (
      <button style={[ styles.button.base, style && style.base, isHidden && styles.button.hidden, isHidden && style && style.hidden ]} title={isHidden ? (single ? 'Show frame' : 'Show hidden frames') : (single ? 'Hide frame' : 'Hide hidden frames')} onClick={this.onToggleHidden}>
        <img src={eyeCrossedImage} style={styles.image}/>
      </button>
    );
  }

}
