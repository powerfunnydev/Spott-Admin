/* eslint-disable react/no-set-state */ // TODO remove this line.
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import Scene from './scene';
import BottomBar from './bottomBar';
import PureRender from '../_helpers/pureRenderDecorator';
import SmoothScrollableList from '../_helpers/smoothScrollableList';
import sceneSelector from '../../../selectors/sceneSelector';
import * as appearanceActions from '../../../actions/appearance';
import * as sceneActions from '../../../actions/scene';

@connect(sceneSelector, (dispatch) => ({
  pasteAppearances: bindActionCreators(appearanceActions.paste, dispatch),
  selectScene: bindActionCreators(sceneActions.select, dispatch),
  toggleHideDifferentFrames: bindActionCreators(sceneActions.toggleHideDifferentFrames, dispatch)
}))
@Radium
@PureRender
class SceneSelector extends Component {

  static propTypes = {
    currentScene: ImmutablePropTypes.map,
    hideDifferentFrames: PropTypes.bool.isRequired,
    pasteAppearances: PropTypes.func.isRequired,
    scenes: ImmutablePropTypes.list.isRequired,
    selectScene: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleHideDifferentFrames: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._updateHeight = ::this._updateHeight;
    this.onScaleChange = ::this.onScaleChange;
  }

  componentWillMount () {
    this.setState({ scale: 6 });
  }

  componentDidMount () {
    this._updateHeight();
    window.addEventListener('resize', this._updateHeight);
  }
  componentWillUnmount () {
    // Unsubscribe to window resizes
    window.removeEventListener('resize', this._updateHeight);
  }

  _getRecordHeight () {
    const totalWidth = this.container.clientWidth;
    const recordsPerRow = 13 - this.state.scale;
    return (((totalWidth - (recordsPerRow * 10)) / recordsPerRow) * 0.6) + 10;
  }

  _updateHeight () {
    this.setState({
      recordHeight: this._getRecordHeight()
    });
  }

  onScaleChange (value) {
    this.setState({
      recordHeight: this._getRecordHeight(),
      scale: value
    });
  }

  // The HotKeys compontent allows us to capture left/right arrow key presses,
  // to navigate through the scenes. The key is the function name of the handler
  // that is passed to the HotKeys component. The value is the name of the key that
  // triggers the function.
  static keyMap = {
    pasteAppearances: 'command+v'
  };

  static styles = {
    container: {
      backgroundColor: '#202020',
      outline: 0,
      position: 'relative'
    },
    scenes: {
      listContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft: 15, // + 5px padding of the scene image
        paddingRight: 15, // + 5px padding of the scene image
        // Add some margin to top and bottom to prevent the scrollbar reaching the
        // very top/bottom
        marginBottom: 15,
        marginTop: 15
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
    const { currentScene, hideDifferentFrames, pasteAppearances, scenes, selectScene, toggleHideDifferentFrames } = this.props;
    const similarScenes = (currentScene && currentScene.get('similarScenes')) || List();

    // From small images to large images. The number of images on each row shrinks, when sliding to the right.
    // this.state.scale is the number of images on a row.
    const reverseScale = 13 - this.state.scale;
    const handlers = {
      pasteAppearances: pasteAppearances.bind(this, null)
    };

    // Calculate the procentual width of each item
    return (
      // The HotKeys component does not use Radium, therefore we need to join the styles manually.
      <HotKeys handlers={handlers} keyMap={keyMap} style={{ ...styles.container, ...this.props.style }}>
        {/* Render list of scenes */}
        <div style={styles.scenes.listContainer}>
          <div ref={(container) => { this.container = container; }} style={{ height: '100%' }}>
            <SmoothScrollableList
              innerStyle={styles.scenes.list}
              numberOfRecords={scenes.size}
              recordHeight={this.state.recordHeight}
              recordsPerRow={reverseScale}
              renderRecord={(index) => {
                const scene = scenes.get(index);
                const sceneId = scene.get('id');
                const isSimilar = similarScenes.includes(sceneId);
                return (
                  <Scene
                    isSelected={currentScene === scene}
                    isSimilar={isSimilar}
                    key={sceneId}
                    procentualHeightOfWidth={60}
                    procentualWidth={100 / reverseScale}
                    scene={scene}
                    onClickScene={selectScene}
                    onPaste={pasteAppearances}/>
                );
              }}
              style={styles.scenes.listInner}/>
          </div>
        </div>

        {/* Render bottom bar */}
        {/* TODO: actual number of selected scenes, instead of 1 */}
        <BottomBar
          hideDifferentFrames={hideDifferentFrames}
          numScenes={scenes.size}
          numSelectedScenes={scenes.size === 0 ? 0 : 1}
          scale={this.state.scale}
          onScaleChange={this.onScaleChange}
          onToggleHideDifferentFrames={toggleHideDifferentFrames} />
      </HotKeys>
    );
  }
}

export default SceneSelector;
