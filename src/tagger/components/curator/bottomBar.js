import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import Slider from '../_helpers/slider';
import NonKeyFramesHider from './nonKeyFramesHider';
import colors from '../colors';

const resizeIconImage = require('./images/resizeIcon.svg');

@Radium
export default class BottomBar extends Component {

  static propTypes = {
    hideNonKeyFrames: PropTypes.bool.isRequired,
    numFrames: PropTypes.number.isRequired,
    numKeyFrames: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    onScaleChange: PropTypes.func.isRequired,
    onToggleHideNonKeyFrames: PropTypes.func.isRequired
  };

  static styles= {
    buttonContainer: {
      display: 'flex'
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.black1,
      bottom: 0,
      display: 'flex',
      fontFamily: 'Rubik-Regular',
      height: 38,
      justifyContent: 'space-between',
      left: 0,
      opacity: 0.9,
      paddingLeft: 20,
      paddingRight: 20,
      position: 'absolute',
      right: 0,
      zIndex: 100
    },
    framesHider: {
      base: {
        marginRight: 6
      }
    },
    sliderImage: {
      display: 'inline-block'
    },
    sliderContainer: {
      display: 'inline-block',
      marginLeft: 10,
      width: 80
    },
    slider: {
      transform: 'translate(0,-50%)'
    },
    info: {
      fontSize: '14px',
      color: '#7b8186'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { hideNonKeyFrames, numKeyFrames, numFrames, onToggleHideNonKeyFrames } = this.props;

    return (
      <div style={styles.container}>
        <div title={`Increase/decrease thumbnail size (currently ${13 - this.props.scale} on a row)`}>
          <div style={styles.sliderImage}>
            <img src={resizeIconImage} />
          </div>
          <div style={styles.sliderContainer}>
            <Slider max={8} min={5} style={styles.slider} value={this.props.scale} onChange={this.props.onScaleChange}/>
          </div>
        </div>

        {/* Info: 200/230 frames visible in 3 scenes {numKeyFrames}/{numFrames} are key frames */}
        <div style={styles.info} />
        <div style={styles.buttonContainer}>
          {/* Hide/show all hidden frames. */}
          <NonKeyFramesHider
            isKeyFrame={hideNonKeyFrames}
            style={styles.framesHider}
            onToggleKeyFrame={onToggleHideNonKeyFrames} />
        </div>
      </div>
    );
  }

}
