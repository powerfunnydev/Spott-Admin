import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as actions from '../../actions/curator';
import { sidebarSelector } from '../../selectors/curator';
import colors from '../colors';
import Character from './character';
import SceneGroup from './sceneGroup';

@connect(sidebarSelector, (dispatch) => ({
  loadCharacters: bindActionCreators(actions.loadCharacters, dispatch),
  selectCharacter: bindActionCreators(actions.selectCharacter, dispatch),
  selectSceneGroup: bindActionCreators(actions.selectSceneGroup, dispatch)
}))
@Radium
export default class Sidebar extends Component {
  static propTypes = {
    characters: ImmutablePropTypes.list.isRequired,
    currentCharacter: ImmutablePropTypes.map,
    currentSceneGroup: ImmutablePropTypes.map,
    loadCharacters: PropTypes.func.isRequired,
    sceneGroups: ImmutablePropTypes.list.isRequired,
    selectCharacter: PropTypes.func.isRequired,
    selectSceneGroup: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  componentDidMount () {
    this.props.loadCharacters();
  }

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
    const { characters, currentCharacter, currentSceneGroup, sceneGroups, selectCharacter, selectSceneGroup, style } = this.props;

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
        {characters.map((character) => (
          <Character
            character={character}
            key={character.get('id')}
            selected={character === currentCharacter}
            onClick={selectCharacter.bind(null, character.get('id'))} />
        ))}
      </ul>
    );
  }
}
