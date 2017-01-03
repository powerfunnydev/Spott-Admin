/* eslint-disable no-nested-ternary */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import colors from '../colors';

@Radium
export default class NonKeyFramesHider extends Component {

  static propTypes = {
    emptyImage: PropTypes.string.isRequired,
    filledImage: PropTypes.string.isRequired,
    // Information visualized by this component
    isKeyFrame: PropTypes.bool.isRequired,
    // Hide one frame?
    single: PropTypes.bool,
    // Override the inline-styles of the root element.
    style: PropTypes.object,
    // Actions triggered by this component
    onToggleKeyFrame: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onToggleKeyFrame = ::this.onToggleKeyFrame;
  }

  onToggleKeyFrame (e) {
    e.preventDefault();
    this.props.onToggleKeyFrame();
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
      keyFrame: {
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
    const { emptyImage, filledImage, isKeyFrame, single, style } = this.props;

    return (
      <button style={[ styles.button.base, style && style.base, isKeyFrame && styles.button.keyFrame, isKeyFrame && style && style.hidden ]} title={isKeyFrame ? (single ? 'Mark as non key frame' : 'Show non key frames') : (single ? 'Mark as key frame' : 'Hide non key frames')} onClick={this.onToggleKeyFrame}>
        <img src={isKeyFrame ? filledImage : emptyImage} style={styles.image}/>
      </button>
    );
  }

}
