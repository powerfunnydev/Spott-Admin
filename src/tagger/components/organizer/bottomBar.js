import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import Slider from '../_helpers/slider';
import FramesHider from './framesHider';
import colors from '../colors';

const resizeIconImage = require('../_images/resizeIcon.svg');

@Radium
export default class BottomBar extends Component {

  static propTypes = {
    hideHiddenFrames: PropTypes.bool.isRequired,
    numAllScenes: PropTypes.number.isRequired,
    numSceneGroups: PropTypes.number.isRequired,
    numVisibleScenes: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    onScaleChange: PropTypes.func.isRequired,
    onToggleHideHiddenFrames: PropTypes.func.isRequired
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
    const { hideHiddenFrames, numAllScenes, numSceneGroups, numVisibleScenes, onToggleHideHiddenFrames } = this.props;

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

        {/* Info: 200/230 frames visible in 3 scenes */}
        <div style={styles.info}>{numVisibleScenes}/{numAllScenes} visible in {numSceneGroups} scenes</div>
        <div style={styles.buttonContainer}>
          {/* Hide/show all hidden frames. */}
          <FramesHider
            isHidden={hideHiddenFrames}
            style={styles.framesHider}
            onToggleHidden={onToggleHideHiddenFrames} />
        </div>
      </div>
    );
  }

}
