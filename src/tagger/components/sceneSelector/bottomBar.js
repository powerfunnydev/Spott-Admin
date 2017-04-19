import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Slider from '../_helpers/slider';
import DifferentFramesHider from './differentFramesHider';
import colors from '../colors';

const resizeIconImage = require('./images/resizeIcon.svg');

@Radium
export default class BottomBar extends Component {

  static propTypes = {
    hideDifferentFrames: PropTypes.bool.isRequired,
    numScenes: PropTypes.number.isRequired,
    numSelectedScenes: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    onScaleChange: PropTypes.func.isRequired,
    onToggleHideDifferentFrames: PropTypes.func.isRequired
  };

  static styles= {
    container: {
      alignItems: 'center',
      backgroundColor: colors.black190,
      bottom: 0,
      display: 'flex',
      fontFamily: 'Rubik-Regular',
      height: 38,
      justifyContent: 'space-between',
      left: 0,
      opacity: 0.85,
      paddingLeft: 20,
      paddingRight: 20,
      position: 'absolute',
      right: 0
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
    const { hideDifferentFrames, onToggleHideDifferentFrames } = this.props;

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

        {/* Info: 1 of 200 selected */}
        <div style={styles.info}>{this.props.numSelectedScenes} of {this.props.numScenes} selected</div>

        {/* Hide/show the similar scenes of current selected scene. */}
        <DifferentFramesHider isHidden={hideDifferentFrames} onToggleHidden={onToggleHideDifferentFrames} />
      </div>
    );
  }

}
