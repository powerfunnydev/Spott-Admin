import Radium, { StyleRoot } from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Header from './header';
import * as mediumActions from '../actions/medium';
import * as quickiesActions from '../actions/quickies';
import * as sceneActions from '../actions/scene';
import * as videoActions from '../actions/video';
import * as organizerActions from '../actions/organizer';
import * as curatorActions from '../actions/curator';
import * as mvpActions from '../actions/mvp';
import { mainSelector } from '../selectors/main';
import { CURATE, ORGANIZE, TAG, MVP } from '../constants/mainTabTypes';
import { filterKeyEventsInInputFields } from './_helpers/utils';
import ContextMenus from './contextMenus';
import Curator from './curator';
import CuratorSidebar from './curator/sidebar';
import CustomDragLayer from './customDragLayer';
import Modals from './modals';
import Mvp from './mvp';
import Organizer from './organizer';
import QuickiesBar from './quickiesBar';
import SceneEditor from './sceneEditor';
import SceneSelector from './sceneSelector';
import Sidebar from './sidebar';
import Toast from './toast';

@DragDropContext(HTML5Backend)
@connect(mainSelector, (dispatch) => ({
  fetchMedium: bindActionCreators(mediumActions.fetch, dispatch),
  loadQuickies: bindActionCreators(quickiesActions.fetchProductGroups, dispatch),
  organizerInsertSceneGroup: bindActionCreators(organizerActions.insertSceneGroup, dispatch),
  organizerSelectLeftScene: bindActionCreators(organizerActions.selectLeftScene, dispatch),
  organizerSelectRightScene: bindActionCreators(organizerActions.selectRightScene, dispatch),
  organizerSelectBottomScene: bindActionCreators(organizerActions.selectBottomScene, dispatch),
  organizerSelectTopScene: bindActionCreators(organizerActions.selectTopScene, dispatch),
  organizerToggleVisibilityScene: bindActionCreators(organizerActions.toggleVisibilityScene, dispatch),

  curatorSelectLeftFrame: bindActionCreators(curatorActions.selectLeftFrame, dispatch),
  curatorSelectRightFrame: bindActionCreators(curatorActions.selectRightFrame, dispatch),
  curatorSelectBottomFrame: bindActionCreators(curatorActions.selectBottomFrame, dispatch),
  curatorSelectTopFrame: bindActionCreators(curatorActions.selectTopFrame, dispatch),
  curatorToggleKeyFrame: bindActionCreators(curatorActions.toggleKeyFrame, dispatch),

  mvpSelectLeftFrame: bindActionCreators(mvpActions.selectLeftFrame, dispatch),
  mvpSelectRightFrame: bindActionCreators(mvpActions.selectRightFrame, dispatch),
  mvpSelectBottomFrame: bindActionCreators(mvpActions.selectBottomFrame, dispatch),
  mvpSelectTopFrame: bindActionCreators(mvpActions.selectTopFrame, dispatch),
  mvpToggleKeyFrame: bindActionCreators(mvpActions.toggleKeyFrame, dispatch),

  selectCharacterByShortkey: bindActionCreators(quickiesActions.selectCharacterByShortkey, dispatch),
  selectVideo: bindActionCreators(videoActions.select, dispatch),
  tagSelectLeftScene: bindActionCreators(sceneActions.selectLeftScene, dispatch),
  tagSelectRightScene: bindActionCreators(sceneActions.selectRightScene, dispatch),
  toggleVisibilityScene: bindActionCreators(organizerActions.toggleVisibilityScene, dispatch)
}))
@Radium
export default class TaggerApplication extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    curatorSelectBottomFrame: PropTypes.func.isRequired,
    curatorSelectLeftFrame: PropTypes.func.isRequired,
    curatorSelectRightFrame: PropTypes.func.isRequired,
    curatorSelectTopFrame: PropTypes.func.isRequired,
    curatorToggleKeyFrame: PropTypes.func.isRequired,
    fetchMedium: PropTypes.func.isRequired,
    loadQuickies: PropTypes.func.isRequired,
    mvpSelectBottomFrame: PropTypes.func.isRequired,
    mvpSelectLeftFrame: PropTypes.func.isRequired,
    mvpSelectRightFrame: PropTypes.func.isRequired,
    mvpSelectTopFrame: PropTypes.func.isRequired,
    mvpToggleKeyFrame: PropTypes.func.isRequired,
    organizerInsertSceneGroup: PropTypes.func.isRequired,
    organizerSelectBottomScene: PropTypes.func.isRequired,
    organizerSelectLeftScene: PropTypes.func.isRequired,
    organizerSelectRightScene: PropTypes.func.isRequired,
    organizerSelectTopScene: PropTypes.func.isRequired,
    organizerToggleVisibilityScene: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    selectCharacterByShortkey: PropTypes.func.isRequired,
    selectVideo: PropTypes.func.isRequired,
    style: PropTypes.object,
    tagSelectLeftScene: PropTypes.func.isRequired,
    tagSelectRightScene: PropTypes.func.isRequired,
    toggleVisibilityScene: PropTypes.func.isRequired
  };

  async componentDidMount () {
    const { mediumId, videoId } = this.props.routeParams;
    const { mediumType } = this.props.route;
    // TODO: check wether video belongs to medium
    // Fetch the medium.
    const { rootMediumId } = await this.props.fetchMedium({ mediumId, mediumType });
    // Load quickies for the root medium.
    // We fetch the quickies for the commercial, series (not episode) or movie.
    this.props.loadQuickies({ mediumId: rootMediumId });
    this.props.selectVideo({ videoId });
  }

  // The HotKeys compontent allows us to capture number key presses,
  // to select a quickies group. The key is the function name of the handler
  // that is passed to the HotKeys component. The value is the name of the key that
  // triggers the function.
  static tagKeyMap = {
    selectFirstCharacter: '1',
    selectSecondCharacter: '2',
    selectThirdCharacter: '3',
    selectFourthCharacter: '4',
    selectFifthCharacter: '5',
    selectSixthCharacter: '6',
    selectSeventhCharacter: '7',
    selectEighthCharacter: '8',
    selectNinthCharacter: '9',
    selectTenthCharacter: '0',
    selectLeftScene: 'left',
    selectRightScene: 'right'
  };

  static organizerKeyMap = {
    insertSceneGroup: 's',
    selectBottomScene: 'down',
    selectLeftScene: 'left',
    selectRightScene: 'right',
    selectTopScene: 'up',
    toggleVisibilityScene: 'x'
  };

  static mvpKeyMap = {
    insertSceneGroup: 's',
    selectBottomScene: 'down',
    selectLeftScene: 'left',
    selectRightScene: 'right',
    selectTopScene: 'up',
    toggleVisibilityScene: 'x'
  };

  static curatorKeyMap = {
    selectBottomFrame: 'down',
    selectLeftFrame: 'left',
    selectRightFrame: 'right',
    selectTopFrame: 'up',
    toggleKeyFrame: 'x'
  };

  static styles = {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      minWidth: '800px',
      minHeight: '400px'
    },
    header: {
      borderBottom: '3px solid black',
      position: 'absolute',
      width: '100%',
      height: 108
    },
    body: {
      display: 'flex',
      position: 'absolute',
      top: 108,
      left: 0,
      bottom: 0,
      right: 0,
      overflow: 'hidden',
      outline: 'none'
    },
    middleBar: {
      flex: '1 1',
      height: '100%',
      width: '100%'
    },
    middleBarInner: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    sidebar: {
      borderRight: '3px solid black',
      flex: '0 0 370px',
      height: '100%',
      width: 370,
      overflow: 'auto'
    },
    organizer: {
      flex: '1 0'
    },
    curator: {
      flex: '1 0'
    },
    mvp: {
      flex: '1 0'
    },
    sceneSelector: {
      flex: '1 0 40%'
    },
    sceneEditor: {
      borderBottom: '3px solid black',
      width: '100%',
      flex: '1 1 auto'
    }
  };

  render () {
    const { curatorKeyMap, organizerKeyMap, tagKeyMap, mvpKeyMap, styles } = this.constructor;
    const {
      activeTab, organizerInsertSceneGroup, organizerSelectLeftScene, organizerSelectRightScene,
      organizerSelectBottomScene, organizerSelectTopScene,
      tagSelectLeftScene, tagSelectRightScene, selectCharacterByShortkey,
      curatorSelectLeftFrame, curatorSelectRightFrame, curatorSelectBottomFrame, curatorSelectTopFrame,
      toggleVisibilityScene, curatorToggleKeyFrame, mvpSelectLeftFrame, mvpSelectRightFrame, mvpSelectBottomFrame,
      mvpSelectTopFrame, mvpToggleKeyFrame
    } = this.props;

    const tagHandlers = {
      selectFirstCharacter: selectCharacterByShortkey,
      selectSecondCharacter: selectCharacterByShortkey,
      selectThirdCharacter: selectCharacterByShortkey,
      selectFourthCharacter: selectCharacterByShortkey,
      selectFifthCharacter: selectCharacterByShortkey,
      selectSixthCharacter: selectCharacterByShortkey,
      selectSeventhCharacter: selectCharacterByShortkey,
      selectEighthCharacter: selectCharacterByShortkey,
      selectNinthCharacter: selectCharacterByShortkey,
      selectTenthCharacter: selectCharacterByShortkey,
      selectLeftScene: tagSelectLeftScene,
      selectRightScene: tagSelectRightScene
    };

    const organizerHandlers = {
      selectLeftScene: organizerSelectLeftScene,
      selectRightScene: organizerSelectRightScene,
      selectBottomScene: organizerSelectBottomScene,
      selectTopScene: organizerSelectTopScene,
      // When no scene was provided, the visibility of the current scene will be toggled.
      toggleVisibilityScene: () => {
        toggleVisibilityScene();
      },
      insertSceneGroup: organizerInsertSceneGroup
    };

    const curatorHandlers = {
      selectLeftFrame: curatorSelectLeftFrame,
      selectRightFrame: curatorSelectRightFrame,
      selectBottomFrame: curatorSelectBottomFrame,
      selectTopFrame: curatorSelectTopFrame,
      // When no scene was provided, the is key frame of the current scene will be toggled.
      toggleKeyFrame: () => {
        curatorToggleKeyFrame();
      }
    };

    const mvpHandlers = {
      selectLeftFrame: mvpSelectLeftFrame,
      selectRightFrame: mvpSelectRightFrame,
      selectBottomFrame: mvpSelectBottomFrame,
      selectTopFrame: mvpSelectTopFrame,
      // When no scene was provided, the is key frame of the current scene will be toggled.
      toggleKeyFrame: () => {
        mvpToggleKeyFrame();
      }
    };

    return (
      <StyleRoot style={styles.container}>
        <CustomDragLayer />
          <Header style={styles.header} />
          {activeTab === ORGANIZE &&
            <HotKeys handlers={filterKeyEventsInInputFields(organizerHandlers)} keyMap={organizerKeyMap} style={styles.body}>
              <Organizer style={styles.organizer} />
            </HotKeys>}
          {activeTab === TAG &&
            <HotKeys handlers={filterKeyEventsInInputFields(tagHandlers)} keyMap={tagKeyMap} style={styles.body}>
              <QuickiesBar style={styles.sidebar} />
              <div style={styles.middleBar}>
                <div style={styles.middleBarInner}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <SceneEditor style={styles.sceneEditor} />
                    <Sidebar style={styles.sidebar} />
                  </div>
                  <SceneSelector style={styles.sceneSelector} />
                </div>
              </div>
            </HotKeys>}
            {activeTab === CURATE &&
              <HotKeys handlers={filterKeyEventsInInputFields(curatorHandlers)} keyMap={curatorKeyMap} style={styles.body}>
                <CuratorSidebar style={styles.sidebar} />
                <Curator style={styles.curator} />
              </HotKeys>}
            {activeTab === MVP &&
              <HotKeys handlers={filterKeyEventsInInputFields(mvpHandlers)} keyMap={mvpKeyMap} style={styles.body}>
                <Mvp style={styles.mvp} />
              </HotKeys>}
          <Modals />
          <ContextMenus />
          <Toast />
      </StyleRoot>
    );
  }

}
