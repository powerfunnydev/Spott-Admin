/* eslint-disable react/no-set-state */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import FramesHider from './framesHider';
import Enlarge from './enlarge';
import PureRender from '../_helpers/pureRenderDecorator';
import colors from '../colors';

@Radium
@PureRender
export default class Scene extends Component {

  static propTypes = {
    duration: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    procentualHeightOfWidth: PropTypes.number.isRequired,
    procentualWidth: PropTypes.number.isRequired,
    scene: ImmutablePropTypes.map.isRequired,
    size: PropTypes.string.isRequired,
    onClickScene: PropTypes.func.isRequired,
    // Optional: last scene does not have a seperator.
    onCreateSceneGroup: PropTypes.func,
    onEnlargeSceneSize: PropTypes.func.isRequired,
    onToggleVisibilityScene: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onMouseEnter = ::this.onMouseEnter;
    this.onMouseLeave = ::this.onMouseLeave;
    this.state = { hovered: false };
  }

  onMouseEnter () {
    this.setState({ hovered: true });
  }

  onMouseLeave () {
    this.setState({ hovered: false });
  }

  static styles = {
    container: {
      display: 'inline-block',
      paddingBottom: 14,
      paddingTop: 14,
      transition: 'width 0.5s ease-in-out'
    },
    border: {
      base: {
        position: 'absolute',
        height: '100%',
        width: '100%'
      },
      selected: {
        border: `3px solid ${colors.strongBlue}`
      }
    },
    content: {
      base: {
        backgroundColor: '#fff',
        backgroundSize: '100% 100%',
        cursor: 'pointer',
        position: 'relative',
        width: '100%'
      }
    },
    overlay: {
      base: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        transition: 'opacity 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0
      },
      hovered: {
        backgroundColor: 'rgba(141, 141, 141, 0.5)',
        opacity: 1
      }
    },
    durationContainer: {
      textAlign: 'center',
      position: 'absolute',
      bottom: 6,
      width: '100%'
    },
    framesHider: {
      base: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        // Otherwise button is not clickable.
        zIndex: 1
      },
      hidden: {
        border: 'none'
      }
    },
    enlarge: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      border: 'none',
      // Otherwise button is not clickable.
      zIndex: 1,
      marginRight: '0.375em'
    },
    duration: {
      base: {
        color: '#fff',
        display: 'inline-block',
        fontFamily: 'Rubik-Regular',
        letterSpacing: '0.063em',
        fontSize: '0.688em',
        padding: '0.2em 0.4em',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '0.125em',
        textShadow: '1px 1px 0px rgba(0, 0, 0, 0.7)'
      },
      danger: {
        backgroundColor: colors.vividRed,
        textShadow: 'none'
      }
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
    },
    buttons: {
      display: 'flex',
      position: 'absolute',
      top: '0.438em',
      right: '0.438em'
    },
    line: {
      backgroundColor: 'transparent',
      borderRadius: '6.25em',
      cursor: 'pointer',
      width: '0.188em',
      marginRight: 12,
      marginLeft: 12,
      ':hover': {
        backgroundColor: colors.vividRed
      }
    },
    linePlaceholder: {
      width: '0.188em',
      marginRight: 12,
      marginLeft: 12
    },
    wrapper: {
      display: 'flex'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      duration, scene, isSelected, procentualHeightOfWidth, procentualWidth, size,
      onClickScene, onCreateSceneGroup, onEnlargeSceneSize, onToggleVisibilityScene
     } = this.props;
    const hovered = this.state.hovered;
    // Determine content style. Adds "selected" style if this scene is currently selected.
    const contentStyle = [
      styles.content.base,
      {
        paddingBottom: `${procentualHeightOfWidth}%`,
        backgroundImage: size === 'small' ? `url('${scene.get('imageUrl')}?width=200&height=113')` : `url('${scene.get('imageUrl')}?width=360&height=203')`
      }
    ];
    const borderStyle = [
      styles.border.base,
      isSelected && styles.border.selected
    ];

    return (
      <li id={scene.get('id')} key={scene.get('id')} style={[ styles.container, { width: `${procentualWidth}%` } ]} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div style={styles.wrapper}>
          {onCreateSceneGroup
            ? <div
              key='line'
              style={[ styles.line, { paddingTop: `${procentualHeightOfWidth}%` } ]}
              onClick={onCreateSceneGroup.bind(null, scene)} />
            : <div key='line' style={styles.linePlaceholder} />}
          <div key='button' role='button' style={contentStyle} onClick={onClickScene.bind(this, scene)}>
            <div key='overlay' style={[ styles.overlay.base, hovered && styles.overlay.hovered ]} />
            {hovered &&
              <div style={styles.buttons}>
                <Enlarge
                  style={styles.enlarge}
                  onEnlarge={onEnlargeSceneSize.bind(null, scene)} />
                <FramesHider
                  isHidden={scene.get('hidden')}
                  single
                  style={styles.framesHider}
                  onToggleHidden={onToggleVisibilityScene.bind(null, scene)} />
              </div>}
            <div style={borderStyle}>
              {!scene.get('hidden') &&
                <div style={styles.durationContainer}>
                  <div style={[ styles.duration.base, duration > 10 && styles.duration.danger ]}>{duration}s</div>
                </div>}
              {scene.get('hidden') && // Render a red cross overlay if the scene is hidden.
                <svg preserveAspectRatio='none' style={styles.hiddenSceneOverlay.container} viewBox='0 0 200 200'>
                  <line style={styles.hiddenSceneOverlay.line} x1='0' x2='200' y1='0' y2='200' />
                  <line style={styles.hiddenSceneOverlay.line} x1='200' x2='0' y1='0' y2='200' />
                </svg>}
            </div>
          </div>
        </div>
      </li>
    );
  }

}
