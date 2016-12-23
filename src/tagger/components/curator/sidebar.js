import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as actions from '../../actions/curator';
import { sidebarSelector } from '../../selectors/curator';
import colors from '../colors';
import SceneGroup from './sceneGroup';

@connect(sidebarSelector, (dispatch) => ({
  selectSceneGroup: bindActionCreators(actions.selectSceneGroup, dispatch)
}))
@Radium
export default class Sidebar extends Component {
  static propTypes = {
    currentSceneGroup: ImmutablePropTypes.map,
    sceneGroups: ImmutablePropTypes.list.isRequired,
    selectSceneGroup: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static styles = {
    container: {
      backgroundColor: colors.black1,
      // Remove default ul style
      listStyle: 'none',
      padding: 0,
      margin: 0,
      width: '100%'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { currentSceneGroup, sceneGroups, selectSceneGroup, style } = this.props;

    console.warn('currentSceneGroup', currentSceneGroup && currentSceneGroup.toJS());
    return (
      <ul style={[ style, styles.container ]}>
        {sceneGroups.map((sceneGroup, i) => (
          <SceneGroup
            key={sceneGroup.get('id')}
            number={i + 1}
            sceneGroup={sceneGroup}
            selected={sceneGroup === currentSceneGroup}
            onClick={selectSceneGroup.bind(null, sceneGroup.get('id'))}/>
        ))}
      </ul>
    );
  }
}
