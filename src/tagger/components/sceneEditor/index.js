import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import Scene from './scene';
import Controls from './controls';
import sceneSelector from '../../selectors/sceneEditor';
import * as sceneActions from '../../actions/scene';
import * as modalActions from '../../actions/modals';
import * as appearanceActions from '../../actions/appearance';
import * as characterActions from '../../actions/character';
import * as productActions from '../../actions/product';
import { CHARACTER, PRODUCT } from '../../constants/appearanceTypes';
import colors from '../colors';

@connect(sceneSelector, (dispatch) => ({
  copyAppearance: bindActionCreators(appearanceActions.copy, dispatch),
  createCharacterMarkerQuickies: bindActionCreators(characterActions.createCharacterMarkerQuickies, dispatch),
  createProductMarkerQuickies: bindActionCreators(productActions.createProductMarkerQuickies, dispatch),
  deleteCharacterOfScene: bindActionCreators(characterActions.deleteCharacterOfScene, dispatch),
  deleteProductOfScene: bindActionCreators(productActions.deleteProductOfScene, dispatch),
  editAppearance: bindActionCreators(modalActions.openUpdateAppearance, dispatch),
  hoverAppearance: bindActionCreators(appearanceActions.hover, dispatch),
  leaveAppearance: bindActionCreators(appearanceActions.leave, dispatch),
  moveAppearance: bindActionCreators(appearanceActions.move, dispatch),
  openWhatToTag: bindActionCreators(modalActions.openWhatToTag, dispatch),
  pasteAppearances: bindActionCreators(appearanceActions.paste, dispatch),
  selectLeftScene: bindActionCreators(sceneActions.selectLeftScene, dispatch),
  selectRightScene: bindActionCreators(sceneActions.selectRightScene, dispatch),
  selectAppearance: bindActionCreators(appearanceActions.select, dispatch),
  toggleSelectAppearance: bindActionCreators(appearanceActions.toggleSelect, dispatch),
  updateStatusScene: bindActionCreators(sceneActions.updateStatusScene, dispatch)
}))
@Radium
class SceneEditor extends Component {

  static propTypes = {
    appearances: ImmutablePropTypes.list.isRequired,
    copyAppearance: PropTypes.func.isRequired,
    createCharacterMarkerQuickies: PropTypes.func.isRequired,
    createProductMarkerQuickies: PropTypes.func.isRequired,
    currentScene: ImmutablePropTypes.map,
    deleteCharacterOfScene: PropTypes.func.isRequired,
    deleteProductOfScene: PropTypes.func.isRequired,
    editAppearance: PropTypes.func.isRequired,
    hoverAppearance: PropTypes.func.isRequired,
    hoveredAppearanceTuple: ImmutablePropTypes.map,
    leaveAppearance: PropTypes.func.isRequired,
    moveAppearance: PropTypes.func.isRequired,
    // Function for requesting to open the "What are you tagging" dialog?
    openWhatToTag: PropTypes.func.isRequired,
    pasteAppearances: PropTypes.func.isRequired,
    scenes: ImmutablePropTypes.list.isRequired,
    selectAppearance: PropTypes.func.isRequired,
    selectLeftScene: PropTypes.func.isRequired,
    selectRightScene: PropTypes.func.isRequired,
    selectedAppearance: PropTypes.string,
    style: PropTypes.object,
    toggleSelectAppearance: PropTypes.func.isRequired,
    updateStatusScene: PropTypes.func.isRequired
  };

  onRemoveAppearance (appearanceType, appearanceId) {
    switch (appearanceType) {
      case CHARACTER:
        this.props.deleteCharacterOfScene(appearanceId);
        break;
      case PRODUCT:
        this.props.deleteProductOfScene(appearanceId);
        break;
      default:
        console.warn('sceneEditor:onRemoveAppearance: Unsupported appearanceType: ', appearanceType, ' appearanceId: ', appearanceId);
    }
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
      backgroundColor: colors.black3,
      outline: 0,
      position: 'relative' // Added
    },
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
    }
  };

  render () {
    const { keyMap, styles } = this.constructor;
    const {
      appearances, copyAppearance, createCharacterMarkerQuickies, createProductMarkerQuickies, currentScene, editAppearance, hoverAppearance, hoveredAppearanceTuple, leaveAppearance, selectedAppearance,
      scenes, selectLeftScene, selectRightScene, selectAppearance, toggleSelectAppearance,
      moveAppearance, openWhatToTag, pasteAppearances, updateStatusScene } = this.props;
    const handlers = {
      pasteAppearances: pasteAppearances.bind(this, null)
    };
    const currentSceneIndex = scenes.indexOf(currentScene);

    return (
      // The HotKeys component does not use Radium, therefore we need to join the styles manually.
      <HotKeys handlers={handlers} keyMap={keyMap} style={{ ...styles.container, ...this.props.style }}>
        <Scene
          appearances={appearances}
          currentSceneImageUrl={currentScene && currentScene.get('imageUrl')}
          hoveredAppearanceTuple={hoveredAppearanceTuple}
          selectedAppearance={selectedAppearance}
          onCopyAppearance={copyAppearance}
          onDropCharacter={createCharacterMarkerQuickies}
          onDropProduct={createProductMarkerQuickies}
          onEditAppearance={editAppearance}
          onHoverAppearance={hoverAppearance}
          onLeaveAppearance={leaveAppearance}
          onMoveAppearance={moveAppearance}
          onOpenWhatToTag={openWhatToTag}
          onRemoveAppearance={this.onRemoveAppearance.bind(this)}
          onSelectAppearance={selectAppearance}
          onToggleSelectAppearance={toggleSelectAppearance} />
        <Controls
          currentSceneNumber={currentSceneIndex + 1}
          isHidden={currentScene && currentScene.get('hidden')}
          numScenes={scenes.size}
          offsetInSeconds={currentScene && currentScene.get('offsetInSeconds')}
          status={currentScene && currentScene.get('status')}
          style={styles.controls}
          onSelectNext={selectRightScene}
          onSelectPrevious={selectLeftScene}
          onUpdateStatusScene={updateStatusScene} />
      </HotKeys>
    );
  }

}

export default SceneEditor;
