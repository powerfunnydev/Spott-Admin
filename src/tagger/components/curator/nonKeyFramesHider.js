/* eslint-disable no-nested-ternary */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import colors from '../colors';

const starEmptyImage = require('./images/starEmpty.svg');
const starFilledImage = require('./images/starFilled.svg');

@Radium
export default class NonKeyFramesHider extends Component {

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
        backgroundColor: colors.vividOrange,
        border: `1px solid ${colors.vividOrange}`
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
      <button style={[ styles.button.base, style && style.base, isHidden && styles.button.hidden, isHidden && style && style.hidden ]} title={isHidden ? (single ? 'Mark as non key frame' : 'Show non key frames') : (single ? 'Mark as key frame' : 'Hide non key frames')} onClick={this.onToggleHidden}>
        <img src={isHidden ? starFilledImage : starEmptyImage} style={styles.image}/>
      </button>
    );
  }

}
