import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import colors from '../colors';
import FramesHider from './framesHider';

const crossLarge = require('../_images/crossLarge.svg');
const arrow = require('../sceneEditor/images/arrow.svg');

@Radium
export default class LargeSceneModal extends Component {

  static propTypes = {
    currentScene: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectLeftScene: PropTypes.func.isRequired,
    onSelectRightScene: PropTypes.func.isRequired,
    onToggleVisibilityScene: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClose = ::this.onClose;
  }

  onClose (e) {
    e.preventDefault();
    this.props.onClose();
  }

  static styles = {
    overlay: {
      backgroundColor: 'rgba(28, 28, 28, 0.9)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    },
    content: {
      position: 'absolute',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      outline: 'none',
      width: '60%',
      top: '50%',
      left: '50%',
      right: 'auto',
      // Fit height to content, centering vertically
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    },
    close: {
      position: 'fixed',
      top: '3em',
      right: '3em'
    },
    image: {
      width: '100%'
    },
    framesHider: {
      display: 'inline-block',
      marginTop: '0.875em'
    },
    imageContainer: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '2em'
    },
    left: {
      paddingRight: '1.25em'
    },
    right: {
      paddingLeft: '1.25em'
    },
    arrowLeft: {
      transform: 'rotate(180deg)'
    },
    imageWrapper: {
      lineHeight: 0,
      position: 'relative'
    },
    hiddenSceneOverlay: {
      container: {
        backgroundColor: 'rgba(236, 65, 15, 0.25)',
        boxShadow: 'inset 0px 0px 0px 1px rgb(236, 65, 15)', // vividRed
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      },
      line: {
        stroke: colors.vividRed,
        strokeWidth: 1
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { currentScene, isOpen, onSelectLeftScene, onSelectRightScene, onToggleVisibilityScene } = this.props;

    if (isOpen && currentScene) {
      return (
        <div style={styles.overlay} onClick={this.onClose}>
          <button style={styles.close}>
            <img src={crossLarge} title='Close' />
          </button>
          <div style={styles.content} onClick={(e) => e.stopPropagation()}>
            <div style={styles.imageContainer}>
              <button style={styles.left} onClick={onSelectLeftScene}>
                <img src={arrow} style={styles.arrowLeft} title='Previous scene' />
              </button>
              <div style={styles.imageWrapper}>
                <img src={`${currentScene.get('imageUrl')}?height=699&width=1242`} style={styles.image} />
                {currentScene.get('hidden') && // Render a red cross overlay if the scene is hidden.
                  <svg preserveAspectRatio='none' style={styles.hiddenSceneOverlay.container} viewBox='0 0 200 200'>
                    <line style={styles.hiddenSceneOverlay.line} x1='0' x2='200' y1='0' y2='200' />
                    <line style={styles.hiddenSceneOverlay.line} x1='200' x2='0' y1='0' y2='200' />
                  </svg>}
              </div>

              <button style={styles.right} onClick={onSelectRightScene}>
                <img src={arrow} title='Next scene' />
              </button>
            </div>
            <div style={styles.framesHider}>
              <FramesHider
                isHidden={currentScene.get('hidden')}
                single
                onToggleHidden={onToggleVisibilityScene}/>
            </div>
          </div>
        </div>
      );
    }
    return <span />;
  }
}
