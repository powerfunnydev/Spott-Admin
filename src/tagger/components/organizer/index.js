/* eslint-disable react/no-set-state */ // TODO remove this line.
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import HotKeysInfo from './hotKeysInfo';
import Scene from './scene';
import BottomBar from './bottomBar';
import LargeSceneModal from './largeSceneModal';
import PureRender from '../_helpers/pureRenderDecorator';
import { filterKeyEventsInInputFields } from '../_helpers/utils';
import selector from '../../selectors/organizer';
import * as organizeActions from '../../actions/organizer';
import SceneGroup from './sceneGroup';

@connect(selector, (dispatch) => ({
  persistSceneGroup: bindActionCreators(organizeActions.persistSceneGroup, dispatch),
  minimizeScene: bindActionCreators(organizeActions.minimizeScene, dispatch),
  removeSceneGroup: bindActionCreators(organizeActions.removeSceneGroup, dispatch),
  selectLeftScene: bindActionCreators(organizeActions.selectLeftScene, dispatch),
  selectRightScene: bindActionCreators(organizeActions.selectRightScene, dispatch),
  selectScene: bindActionCreators(organizeActions.selectScene, dispatch),
  toggleHideHiddenFrames: bindActionCreators(organizeActions.toggleHideHiddenFrames, dispatch),
  toggleHotKeysInfo: bindActionCreators(organizeActions.toggleHotKeysInfo, dispatch),
  toggleSceneSize: bindActionCreators(organizeActions.toggleSceneSize, dispatch),
  toggleVisibilitySceneGroup: bindActionCreators(organizeActions.toggleVisibilitySceneGroup, dispatch),
  toggleVisibilityScene: bindActionCreators(organizeActions.toggleVisibilityScene, dispatch),
  updateScale: bindActionCreators(organizeActions.updateScale, dispatch)
}))
@Radium
@PureRender
export default class Organizer extends Component {

  static propTypes = {
    currentScene: ImmutablePropTypes.map,
    enlargeScene: PropTypes.bool.isRequired,
    hideHiddenFrames: PropTypes.bool.isRequired,
    // Maps sceneGroupIds to booleans
    hideSceneGroup: ImmutablePropTypes.map.isRequired,
    minimizeScene: PropTypes.func.isRequired,
    numAllScenes: PropTypes.number.isRequired,
    numVisibleScenes: PropTypes.number.isRequired,
    persistSceneGroup: PropTypes.func.isRequired,
    removeSceneGroup: PropTypes.func.isRequired,
    scale: PropTypes.number.isRequired,
    sceneGroups: ImmutablePropTypes.list.isRequired,
    scenes: ImmutablePropTypes.list.isRequired,
    selectLeftScene: PropTypes.func.isRequired,
    selectRightScene: PropTypes.func.isRequired,
    selectScene: PropTypes.func.isRequired,
    showHotKeysInfo: PropTypes.bool.isRequired,
    style: PropTypes.object,
    toggleHideHiddenFrames: PropTypes.func.isRequired,
    toggleHotKeysInfo: PropTypes.func.isRequired,
    toggleSceneSize: PropTypes.func.isRequired,
    toggleVisibilityScene: PropTypes.func.isRequired,
    toggleVisibilitySceneGroup: PropTypes.func.isRequired,
    updateScale: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCreateSceneGroup = ::this.onCreateSceneGroup;
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

  getDuration (currentScene, scenes, index) {
    if (currentScene.get('hidden')) {
      return 0;
    }
    for (let i = index - 1, scene; i >= 0; i--) {
      scene = scenes.get(i);
      // The previous visible scene was found!
      if (!scene.get('hidden')) {
        return currentScene.get('offsetInSeconds') - scene.get('offsetInSeconds');
      }
    }
    return 0;
  }

  onCreateSceneGroup (scene) {
    this.props.persistSceneGroup({ firstSceneId: scene.get('id') });
  }

  onScaleChange (scale) {
    this.props.updateScale(scale);
  }

  // The HotKeys compontent allows us to capture space key presses,
  // to enlarge/minimize a scene. The key is the function name of the handler
  // that is passed to the HotKeys component. The value is the name of the key that
  // triggers the function.
  static keyMap = {
    toggleSceneSize: 'space',
    minimizeScene: 'esc'
  };

  static styles = {
    container: {
      backgroundColor: '#000',
      outline: 0,
      position: 'relative'
    },
    scenes: {
      listContainer: {
        base: {
          position: 'absolute',
          top: 157,
          bottom: 0,
          left: 0,
          right: 0,
          paddingLeft: 15, // + 5px padding of the scene image
          paddingRight: 15, // + 5px padding of the scene image
          // Add some margin to top and bottom to prevent the scrollbar reaching the
          // very top/bottom
          marginBottom: 15,
          marginTop: 15,
          marginLeft: -15,
          transition: 'top 0.5s ease-in',
          overflow: 'scroll',
          paddingBottom: 30
        },
        top: {
          top: '2.438em',
          transition: 'top 0.5s ease-out'
        }
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
      persistSceneGroup, currentScene, hideHiddenFrames,
      hideSceneGroup, removeSceneGroup, scenes, sceneGroups, toggleHotKeysInfo, enlargeScene, showHotKeysInfo,
      numAllScenes, numVisibleScenes, minimizeScene, selectLeftScene, selectRightScene,
      selectScene, toggleSceneSize, toggleVisibilityScene, toggleHideHiddenFrames, toggleVisibilitySceneGroup
    } = this.props;

    // From small images to large images. The number of images on each row shrinks, when sliding to the right.
    // this.props.scale is the number of images on a row.
    const reverseScale = 13 - this.props.scale;
    const handlers = {
      toggleSceneSize: (e) => {
        // Prevent default so now buttons get an onClick triggered.
        e.preventDefault();
        toggleSceneSize();
      },
      minimizeScene
    };

    let sceneIndex = 0;
    // Calculate the procentual width of each item
    return (
      // The HotKeys component does not use Radium, therefore we need to join the styles manually.
      <HotKeys handlers={filterKeyEventsInInputFields(handlers)} keyMap={keyMap} style={{ ...styles.container, ...this.props.style }}>
        <LargeSceneModal
          currentScene={currentScene}
          isOpen={enlargeScene}
          onClose={minimizeScene}
          onSelectLeftScene={selectLeftScene}
          onSelectRightScene={selectRightScene}
          onToggleVisibilityScene={toggleVisibilityScene} />
        <HotKeysInfo isOpen={showHotKeysInfo} onToggle={toggleHotKeysInfo} />
        {/* Render list of scenes */}
        <div style={[ styles.scenes.listContainer.base, !showHotKeysInfo && styles.scenes.listContainer.top ]}>
          {sceneGroups.map((sceneGroup, i) => (
            <SceneGroup
              hidden={hideSceneGroup.get(sceneGroup.get('id'))}
              key={sceneGroup.get('id')}
              number={i + 1}
              sceneGroup={sceneGroup}
              // The first scene group can't be removed.
              onRemove={i === 0 ? null : removeSceneGroup.bind(null, sceneGroup.get('id'))}
              onSubmit={persistSceneGroup}
              onToggleVisibility={toggleVisibilitySceneGroup.bind(null, sceneGroup.get('id'))}>
              {sceneGroup.get('scenes') && sceneGroup.get('scenes').map((scene, j) => (
                <Scene
                  duration={this.getDuration(scene, scenes, sceneIndex++)}
                  isSelected={currentScene === scene}
                  key={scene.get('id')}
                  procentualHeightOfWidth={60}
                  procentualWidth={100 / reverseScale}
                  scene={scene}
                  size={this.props.scale > 6 ? 'big' : 'small'}
                  onClickScene={selectScene}
                  // Can't create a scene group for the first scene of the scene group.
                  onCreateSceneGroup={j === 0 ? null : this.onCreateSceneGroup}
                  onEnlargeSceneSize={toggleSceneSize}
                  onToggleVisibilityScene={toggleVisibilityScene} />
              ))}
            </SceneGroup>
          ))}
        </div>

        {/* Render bottom bar */}
        <BottomBar
          hideHiddenFrames={hideHiddenFrames}
          numAllScenes={numAllScenes}
          numSceneGroups={sceneGroups.size}
          numVisibleScenes={numVisibleScenes}
          scale={this.props.scale}
          onScaleChange={this.onScaleChange}
          onToggleHideHiddenFrames={toggleHideHiddenFrames} />
      </HotKeys>
    );
  }
}
