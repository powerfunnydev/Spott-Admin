import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ContextMenuLayer } from 'react-contextmenu';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PureRender from '../_helpers/pureRenderDecorator';

const similarIcon = require('./images/similar.svg');

const statusImages = {
  ATTENTION: require('./images/attention.svg'),
  DONE: require('./images/done.svg'),
  REVIEW: require('./images/review.svg'),
  UNKNOWN: false
};

@ContextMenuLayer('sceneSelector', (props) => {
  return {
    onPaste: props.onPaste,
    sceneId: props.scene.get('id'),
    sceneImage: props.scene.get('imageUrl')
  };
})
@Radium
@PureRender
export default class Scene extends Component {

  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    isSimilar: PropTypes.bool.isRequired,
    procentualHeightOfWidth: PropTypes.number.isRequired,
    procentualWidth: PropTypes.number.isRequired,
    scene: ImmutablePropTypes.map.isRequired,
    onClickScene: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired
  };

  static styles= {
    container: {
      display: 'inline-block',
      padding: 5,
      transition: 'width 0.5s ease-in-out'
    },
    border: {
      base: {
        position: 'absolute',
        height: '100%',
        width: '100%'
      },
      selected: {
        border: '3px solid #0073d3'
      },
      similar: {
        border: '1px dotted #0073d3'
      }
    },
    similarIcon: {
      position: 'absolute',
      backgroundImage: `url('${similarIcon}')`,
      top: -5,
      left: -5,
      width: 15,
      height: 16
    },
    content: {
      base: {
        backgroundColor: '#fff',
        backgroundSize: '100% 100%',
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        WebkitFilter: 'brightness(80%)',
        transition: 'filter 0.3s ease-in-out',
        ':hover': {
          WebkitFilter: 'brightness(130%)'
        }
      }
    },
    sceneNumber: {
      color: '#fff',
      fontFamily: 'Rubik-Regular',
      fontSize: '11px',
      textShadow: '1px 1px 0px rgba(0, 0, 0, 0.7)',
      position: 'absolute',
      right: 8,
      bottom: 6
    },
    status: {
      position: 'absolute',
      left: 8,
      bottom: 6,
      width: 12,
      height: 12,
      borderRadius: '50%'
    },
    hiddenSceneOverlay: {
      container: {
        backgroundColor: 'rgba(236, 65, 15, 0.3)',
        boxShadow: 'inset 0px 0px 0px 1px rgb(236, 65, 15)', // #ec410f
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      },
      line: {
        stroke: 'rgb(236, 65, 15)',
        strokeWidth: 1
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { scene, isSelected, isSimilar, procentualHeightOfWidth, procentualWidth, onClickScene } = this.props;
    // Determine content style. Adds "selected" style if this scene is currently selected.
    // TODO: image is not shown correctly
    const contentStyle = [
      styles.content.base,
      { paddingBottom: `${procentualHeightOfWidth}%`, backgroundImage: `url('${scene.get('imageUrl')}?width=160&height=90')` }
    ];
    const borderStyle = [
      styles.border.base,
      isSelected && styles.border.selected,
      isSimilar && styles.border.similar
    ];
    // Determine the statusImage based on the status of the scene, which can be either 'ATTENTION', 'DONE', 'REVIEW' or 'UNKNOWN'.
    const statusImage = statusImages[scene.get('status')];
    const statusStyle = [ styles.status, statusImage && { backgroundImage: `url('${statusImage}')` } ];

    return (
      <li key={scene.get('id')} style={[ styles.container, { width: `${procentualWidth}%` } ]}>
        <div role='button' style={contentStyle} onClick={onClickScene.bind(this, scene)}>
          <div style={borderStyle}>
            {/* Render the scene number */}
            <div style={styles.sceneNumber}>{scene.get('sceneNumber')}</div>
            {/* Render the scene status (done, review, attention) */}
            <div style={statusStyle} />
            {scene.get('hidden') && // Render a red cross overlay if the scene is hidden.
              <svg preserveAspectRatio='none' style={styles.hiddenSceneOverlay.container} viewBox='0 0 200 200'>
                <line style={styles.hiddenSceneOverlay.line} x1='0' x2='200' y1='0' y2='200' />
                <line style={styles.hiddenSceneOverlay.line} x1='200' x2='0' y1='0' y2='200' />
              </svg>}
          </div>
          {isSimilar && <div style={styles.similarIcon} />}
        </div>
      </li>
    );
  }

}
