/* eslint-disable react/no-set-state */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NonKeyFramesHider from './nonKeyFramesHider';
import Enlarge from './enlarge';
import PureRender from '../_helpers/pureRenderDecorator';
import colors from '../colors';

@Radium
@PureRender
export default class Frame extends Component {

  static propTypes = {
    frame: ImmutablePropTypes.map.isRequired,
    isSelected: PropTypes.bool.isRequired,
    procentualHeightOfWidth: PropTypes.number.isRequired,
    procentualWidth: PropTypes.number.isRequired,
    size: PropTypes.string.isRequired,
    onClickFrame: PropTypes.func.isRequired,
    onEnlargeFrameSize: PropTypes.func.isRequired,
    onToggleKeyFrame: PropTypes.func.isRequired
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
      transition: 'width 0.5s ease-in-out',
      marginRight: '0.625em',
      marginBottom: '0.625em',
      marginLeft: '0.625em',
      marginTop: '0.625em'
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
      frame, isSelected, procentualHeightOfWidth, procentualWidth, size,
      onClickFrame, onEnlargeFrameSize, onToggleKeyFrame
     } = this.props;
    const hovered = this.state.hovered;
    // Determine content style. Adds "selected" style if this frame is currently selected.
    const contentStyle = [
      styles.content.base,
      {
        paddingBottom: `${procentualHeightOfWidth}%`,
        backgroundImage: size === 'small' ? `url('${frame.get('imageUrl')}?width=200&height=113')` : `url('${frame.get('imageUrl')}?width=360&height=203')`
      }
    ];

    return (
      <li id={frame.get('id')} key={frame.get('id')} style={[ styles.container, { width: `${procentualWidth}%` } ]} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div key='button' role='button' style={contentStyle} onClick={onClickFrame.bind(this, frame)}>
          <div key='overlay' style={[ styles.overlay.base, hovered && styles.overlay.hovered ]} />
          {hovered &&
            <div style={styles.buttons}>
              <Enlarge
                style={styles.enlarge}
                onEnlarge={onEnlargeFrameSize.bind(null, frame)} />
              <NonKeyFramesHider
                isHidden={frame.get('hidden')}
                single
                style={styles.framesHider}
                onToggleHidden={onToggleKeyFrame.bind(null, frame)} />
            </div>}
        </div>
      </li>
    );
  }

}
