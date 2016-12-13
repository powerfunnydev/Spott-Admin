/* eslint-disable react/no-set-state */ // TODO remove this line.
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { ATTENTION, DONE, REVIEW } from '../../../constants/sceneStatusTypes';

// Navigational images
const arrowImage = require('./images/arrow.svg');
// Frame visibility images
const eyeImage = require('./images/eye.svg');
const eyeCrossedImage = require('./images/eyeCrossed.svg');
// Frame status images
const doneImage = require('./images/done.svg');
const doneActiveImage = require('./images/doneActive.svg');
const reviewImage = require('./images/review.svg');
const reviewActiveImage = require('./images/reviewActive.svg');
const attentionImage = require('./images/attention.svg');
const attentionActiveImage = require('./images/attentionActive.svg');

@Radium
class SceneNumber extends Component {

  static propTypes = {
    // Information visualized by this component
    currentSceneNumber: PropTypes.number.isRequired,
    numScenes: PropTypes.number.isRequired,
    // Override the inline-styles of the root element.
    style: PropTypes.object
  };

  static styles = {
    container: {
      fontFamily: 'Rubik-Regular',
      fontSize: '12px',
      verticalAlign: 'middle'
    },
    currentText: {
      borderBottom: '1px dotted #8d8d8d',
      color: 'white',
      fontFamily: 'Rubik-Medium'
    },
    totalText: {
      borderBottom: '1px dotted #8d8d8d',
      color: '#8d8d8d'
    }
  };

  render () {
    const { currentSceneNumber, numScenes, style } = this.props;
    const { styles } = this.constructor;

    return (
      <div style={[ styles.container, style ]}>
        <span style={styles.currentText}>{currentSceneNumber}</span>
        <span style={styles.totalText}>/{numScenes}</span>
      </div>
    );
  }

}

@Radium
class SceneStatusAndNavigator extends Component {

  static propTypes = {
    status: PropTypes.string,
    // Override the inline-styles of the root element.
    style: PropTypes.object,
    // Actions triggered by this component
    onSelectNext: PropTypes.func.isRequired,
    onSelectPrevious: PropTypes.func.isRequired,
    onUpdateStatusScene: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onSelectPrevious = ::this.onSelectPrevious;
    this.onSelectNext = ::this.onSelectNext;
    this.onUpdateStatusSceneDone = this.onUpdateStatusScene.bind(this, DONE);
    this.onUpdateStatusSceneAttention = this.onUpdateStatusScene.bind(this, ATTENTION);
    this.onUpdateStatusSceneReview = this.onUpdateStatusScene.bind(this, REVIEW);
  }

  onSelectPrevious (e) {
    e.preventDefault();
    this.props.onSelectPrevious();
  }

  onUpdateStatusScene (status, e) {
    e.preventDefault();
    this.props.onUpdateStatusScene(status);
  }

  onSelectNext (e) {
    e.preventDefault();
    this.props.onSelectNext();
  }

  static styles = {
    container: {
      display: 'flex',
      flexShrink: '0'
    },
    button: {
      base: {
        height: '100%',
        paddingLeft: 5,
        paddingRight: 5
      },
      previous: {
        marginRight: 15
      },
      next: {
        marginLeft: 15
      }
    },
    rotate: {
      transform: 'rotate(180deg)'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { status, style } = this.props;

    return (
      <div style={[ styles.container, style ]}>
        <button style={[ styles.button.base, styles.button.previous ]} onClick={this.onSelectPrevious}>
          <img src={arrowImage} style={styles.rotate} title='Previous frame' />
        </button>
        <button style={styles.button.base} onClick={this.onUpdateStatusSceneDone}>
          <img src={status === DONE ? doneActiveImage : doneImage} title='Set frame status: Done' />
        </button>
        <button style={styles.button.base} onClick={this.onUpdateStatusSceneReview}>
          <img src={status === REVIEW ? reviewActiveImage : reviewImage} title='Set frame status: Review' />
        </button>
        <button style={styles.button.base} onClick={this.onUpdateStatusSceneAttention}>
          <img src={status === ATTENTION ? attentionActiveImage : attentionImage} title='Set frame status: Attention' />
        </button>
        <button style={[ styles.button.base, styles.button.next ]} onClick={this.onSelectNext}>
          <img src={arrowImage} title='Next frame' />
        </button>
      </div>
    );
  }

}

@Radium
class FrameHider extends Component {

  static propTypes = {
    // Information visualized by this component
    isHidden: PropTypes.bool.isRequired,
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
    container: {
      textAlign: 'right'
    },
    eye: {
      cursor: 'pointer'
    }
  };

  render () {
    const { style, isHidden } = this.props;
    const { styles } = this.constructor;

    return (
      <div style={[ styles.container, style ]}>
        {/* TODO: The eye jumps because we need to reserve some space, on initial render. */}
        {isHidden &&
          <div style={styles.eye} title='Show this frame' onClick={this.onToggleHidden}>
            <img src={eyeCrossedImage} />
          </div>}
        {!isHidden &&
          <div style={styles.eye} title='Hide this frame' onClick={this.onToggleHidden}>
            <img src={eyeImage} />
          </div>}
      </div>
    );
  }

}

class OffsetInSeconds extends Component {

  static propTypes = {
    offsetInSeconds: PropTypes.number
  };

  pad (num) {
    return num < 10 ? `0${num}` : num.toString();
  }

  static styles = {
    offsetInSeconds: {
      borderBottom: '1px dotted #8d8d8d',
      color: 'white',
      fontSize: '17px',
      letterSpacing: 0.9,
      marginBottom: 5
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { offsetInSeconds } = this.props;

    if (typeof offsetInSeconds === 'number') {
      const time = new Date(offsetInSeconds * 1000);
      return <div style={styles.offsetInSeconds}>{this.pad(time.getHours() - 1)}:{this.pad(time.getMinutes())}:{this.pad(time.getSeconds())}</div>;
    }
    return null;
  }
}

/**
 * Component for the Control bar shown underneeth the scene (iamge) in the
 * scene editor.
 */
@Radium
export default class Controls extends Component {

  static propTypes = {
    currentSceneNumber: PropTypes.number,
    isHidden: PropTypes.bool,
    numScenes: PropTypes.number,
    offsetInSeconds: PropTypes.number,
    status: PropTypes.string,
    style: PropTypes.object,
    onSelectNext: PropTypes.func.isRequired,
    onSelectPrevious: PropTypes.func.isRequired,
    onUpdateStatusScene: PropTypes.func.isRequired
  };

  static styles = {
    container: {
      alignItems: 'center',
      backgroundColor: '#1c1c1c',
      display: 'flex',
      height: '81px',
      justifyContent: 'space-between',
      padding: '0px 20px'
    },
    info: {
      width: '20%'
    },
    inlineBlock: {
      display: 'inline-block'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { currentSceneNumber, isHidden, numScenes, offsetInSeconds, status, style, onSelectNext, onSelectPrevious, onUpdateStatusScene } = this.props;

    return (
      <div style={[ styles.container, style ]}>
        {/* Width: 20% */}
        <div style={styles.info}>
          <div style={styles.inlineBlock}>
            <OffsetInSeconds offsetInSeconds={offsetInSeconds} />
            <SceneNumber currentSceneNumber={currentSceneNumber} numScenes={numScenes} />
          </div>
        </div>
        {numScenes !== 0 && currentSceneNumber !== 0 &&
          <SceneStatusAndNavigator status={status} onSelectNext={onSelectNext} onSelectPrevious={onSelectPrevious} onUpdateStatusScene={onUpdateStatusScene} />}
        {/* Width: 20%. Placeholder. */}
        <div style={styles.info} />
      </div>
    );
  }
}
