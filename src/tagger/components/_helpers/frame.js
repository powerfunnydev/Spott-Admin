/* eslint-disable react/no-set-state */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NonKeyFramesHider from './nonKeyFramesHider';
import Enlarge from './enlarge';
import PureRender from './pureRenderDecorator';
import colors from '../colors';

@Radium
@PureRender
export default class Frame extends Component {

  static propTypes = {
    emptyImage: PropTypes.string,
    filledImage: PropTypes.string,
    frame: ImmutablePropTypes.map.isRequired,
    isKeyFrame: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    procentualHeightOfWidth: PropTypes.number.isRequired,
    procentualWidth: PropTypes.number.isRequired,
    size: PropTypes.string.isRequired,
    onClickFrame: PropTypes.func.isRequired,
    onEnlargeFrameSize: PropTypes.func,
    onToggleKeyFrame: PropTypes.func
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
      paddingRight: '0.625em',
      paddingBottom: '0.625em',
      paddingLeft: '0.625em',
      paddingTop: '0.625em'
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
    buttons: {
      display: 'flex',
      position: 'absolute',
      top: '0.438em',
      right: '0.438em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      emptyImage, filledImage, frame, isKeyFrame, isSelected, procentualHeightOfWidth, procentualWidth, size,
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
          <div style={styles.buttons}>
            {hovered && onEnlargeFrameSize &&
              <Enlarge
                style={styles.enlarge}
                onEnlarge={onEnlargeFrameSize.bind(null, frame)} />}
            {(hovered || isKeyFrame) && emptyImage && filledImage && onToggleKeyFrame &&
              <NonKeyFramesHider
                emptyImage={emptyImage}
                filledImage={filledImage}
                isKeyFrame={Boolean(isKeyFrame)}
                single
                style={styles.framesHider}
                onToggleKeyFrame={onToggleKeyFrame.bind(null, frame)} />}
          </div>
          <div style={[ styles.border.base, isSelected && styles.border.selected ]}/>
        </div>
      </li>
    );
  }

}
