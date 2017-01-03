import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import colors from '../colors';
import NonKeyFramesHider from '../_helpers/nonKeyFramesHider';

const crossLarge = require('../_images/crossLarge.svg');
const arrow = require('../sceneEditor/images/arrow.svg');

@Radium
export default class LargeFrameModal extends Component {

  static propTypes = {
    emptyImage: PropTypes.string.isRequired,
    filledImage: PropTypes.string.isRequired,
    frame: ImmutablePropTypes.map,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectLeftFrame: PropTypes.func.isRequired,
    onSelectRightFrame: PropTypes.func.isRequired,
    onToggleKeyFrame: PropTypes.func.isRequired
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
      base: {
        lineHeight: 0,
        position: 'relative'
      },
      isKeyFrame: {
        border: `1px solid ${colors.vividOrange}`
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { emptyImage, filledImage, frame, isOpen, onSelectLeftFrame, onSelectRightFrame, onToggleKeyFrame } = this.props;

    if (isOpen && frame) {
      return (
        <div style={styles.overlay} onClick={this.onClose}>
          <button style={styles.close}>
            <img src={crossLarge} title='Close' />
          </button>
          <div style={styles.content} onClick={(e) => e.stopPropagation()}>
            <div style={styles.imageContainer}>
              <button style={styles.left} onClick={onSelectLeftFrame}>
                <img src={arrow} style={styles.arrowLeft} title='Previous frame' />
              </button>
              <div style={[ styles.imageWrapper.base, frame.get('isKeyFrame') && styles.imageWrapper.isKeyFrame ]}>
                <img src={`${frame.get('imageUrl')}?height=699&width=1242`} style={styles.image} />
              </div>

              <button style={styles.right} onClick={onSelectRightFrame}>
                <img src={arrow} title='Next frame' />
              </button>
            </div>
            <div style={styles.framesHider}>
              <NonKeyFramesHider
                emptyImage={emptyImage}
                filledImage={filledImage}
                isKeyFrame={frame.get('isKeyFrame')}
                single
                onToggleKeyFrame={onToggleKeyFrame}/>
            </div>
          </div>
        </div>
      );
    }
    return <span />;
  }
}
