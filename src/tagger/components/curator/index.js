/* eslint-disable react/no-set-state */ // TODO remove this line.
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import Frame from './frame';
import BottomBar from './bottomBar';
import LargeFrameModal from './largeFrameModal';
import PureRender from '../_helpers/pureRenderDecorator';
import { filterKeyEventsInInputFields } from '../_helpers/utils';
import selector from '../../selectors/curator';
import * as curateActions from '../../actions/curator';

@connect(selector, (dispatch) => ({
  minimizeFrame: bindActionCreators(curateActions.minimizeFrame, dispatch),
  selectLeftFrame: bindActionCreators(curateActions.selectLeftFrame, dispatch),
  selectRightFrame: bindActionCreators(curateActions.selectRightFrame, dispatch),
  selectFrame: bindActionCreators(curateActions.selectFrame, dispatch),
  toggleHideNonKeyFrames: bindActionCreators(curateActions.toggleHideNonKeyFrames, dispatch),
  toggleFrameSize: bindActionCreators(curateActions.toggleFrameSize, dispatch),
  toggleKeyFrame: bindActionCreators(curateActions.toggleKeyFrame, dispatch),
  updateScale: bindActionCreators(curateActions.updateScale, dispatch)
}))
@Radium
@PureRender
export default class Curator extends Component {

  static propTypes = {
    currentScene: ImmutablePropTypes.map,
    currentSceneGroup: ImmutablePropTypes.map,
    enlargeFrame: PropTypes.bool.isRequired,
    hideNonKeyFrames: PropTypes.bool.isRequired,
    minimizeFrame: PropTypes.func.isRequired,
    numAllScenes: PropTypes.number.isRequired,
    numVisibleScenes: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    scenes: ImmutablePropTypes.list.isRequired,
    selectFrame: PropTypes.func.isRequired,
    selectLeftFrame: PropTypes.func.isRequired,
    selectRightFrame: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleFrameSize: PropTypes.func.isRequired,
    toggleHideNonKeyFrames: PropTypes.func.isRequired,
    toggleKeyFrame: PropTypes.func.isRequired,
    updateScale: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onScaleChange = ::this.onScaleChange;
  }

  // Auto scroll to current scene.
  // NOTE: Only tested on Chrome! No support for Firefox!
  componentWillReceiveProps (newProps) {
    const currentScene = this.props.currentScene;
    if ((currentScene && currentScene.get('id')) !== (newProps.currentScene && newProps.currentScene.get('id')) && newProps.currentScene) {
      const scene = document.getElementById(newProps.currentScene.get('id'));
      if (scene && scene.scrollIntoViewIfNeeded) {
        scene.scrollIntoViewIfNeeded();
      }
    }
  }

  onScaleChange (scale) {
    this.props.updateScale(scale);
  }

  // The HotKeys compontent allows us to capture space key presses,
  // to enlarge/minimize a scene. The key is the function name of the handler
  // that is passed to the HotKeys component. The value is the name of the key that
  // triggers the function.
  static keyMap = {
    toggleFrameSize: 'space',
    minimizeFrame: 'esc'
  };

  static styles = {
    container: {
      backgroundColor: '#000',
      outline: 0,
      position: 'relative',
      paddingTop: '2em',
      paddingBottom: '2em',
      paddingLeft: '2.5em',
      paddingRight: '2.5em'
    },
    scenes: {
      listContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft: '1.875em', // + 5px padding of the scene image
        paddingRight: '1.875em', // + 5px padding of the scene image
        // Add some margin to top and bottom to prevent the scrollbar reaching the
        // very top/bottom
        marginBottom: '2em',
        marginTop: '2em',
        marginLeft: '-1.875em',
        overflow: 'scroll',
        paddingBottom: '2em'
      },
      list: {
        position: 'relative',
        paddingLeft: 0,
        marginTop: 0,
        listStyle: 'none'
      },
      listInner: {
        height: '100%',
        paddingRight: 20,
        marginRight: -20
      }
    }
  };

  render () {
    const { keyMap, styles } = this.constructor;
    const {
      currentScene, currentSceneGroup, hideNonKeyFrames, enlargeFrame, minimizeFrame,
      selectLeftFrame, selectRightFrame, scenes,
      selectFrame, toggleFrameSize, toggleKeyFrame, toggleHideNonKeyFrames
    } = this.props;

    // From small images to large images. The number of images on each row shrinks, when sliding to the right.
    // this.props.scale is the number of images on a row.
    const reverseScale = 13 - this.props.scale;
    const handlers = {
      toggleFrameSize: (e) => {
        // Prevent default so now buttons get an onClick triggered.
        e.preventDefault();
        toggleFrameSize();
      },
      minimizeFrame
    };

    // Calculate the procentual width of each item
    return (
      // The HotKeys component does not use Radium, therefore we need to join the styles manually.
      <HotKeys handlers={filterKeyEventsInInputFields(handlers)} keyMap={keyMap} style={{ ...styles.container, ...this.props.style }}>
        <LargeFrameModal
          currentFrame={currentScene}
          isKeyFrame={(currentSceneGroup && currentSceneGroup.get('keySceneId')) === (currentScene && currentScene.get('id'))}
          isOpen={enlargeFrame}
          onClose={minimizeFrame}
          onSelectLeftFrame={selectLeftFrame}
          onSelectRightFrame={selectRightFrame}
          onToggleKeyFrame={toggleKeyFrame} />
        {/* Render the list of scenes of the current scene group. */}
        <div style={styles.scenes.listContainer}>
          {scenes.map((frame, j) => (
            <Frame
              frame={frame}
              isKeyFrame={currentSceneGroup && currentSceneGroup.get('keySceneId') === frame.get('id')}
              isSelected={currentScene === frame}
              key={frame.get('id')}
              procentualHeightOfWidth={60}
              procentualWidth={100 / reverseScale}
              size={this.props.scale > 6 ? 'big' : 'small'}
              onClickFrame={selectFrame}
              onEnlargeFrameSize={toggleFrameSize}
              onToggleKeyFrame={toggleKeyFrame} />
          ))}
        </div>

        {/* Render bottom bar */}
        <BottomBar
          hideNonKeyFrames={hideNonKeyFrames}
          numFrames={100}
          numKeyFrames={1}
          scale={this.props.scale}
          onScaleChange={this.onScaleChange}
          onToggleHideNonKeyFrames={toggleHideNonKeyFrames} />
      </HotKeys>
    );
  }
}
