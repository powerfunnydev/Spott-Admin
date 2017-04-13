import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as actions from '../../actions/curator';
import { sidebarSelector } from '../../selectors/curator';
import colors from '../colors';
import ListItem from './listItem';
import Section from '../_helpers/section';

@connect(sidebarSelector, (dispatch) => ({
  load: bindActionCreators(actions.load, dispatch),
  selectCharacter: bindActionCreators(actions.selectCharacter, dispatch),
  selectProduct: bindActionCreators(actions.selectProduct, dispatch),
  selectSceneGroup: bindActionCreators(actions.selectSceneGroup, dispatch)
}))
@Radium
export default class Sidebar extends Component {
  static propTypes = {
    characters: ImmutablePropTypes.list.isRequired,
    currentCharacter: ImmutablePropTypes.map,
    currentProduct: ImmutablePropTypes.map,
    currentSceneGroup: ImmutablePropTypes.map,
    load: PropTypes.func.isRequired,
    products: ImmutablePropTypes.list.isRequired,
    sceneGroups: ImmutablePropTypes.list.isRequired,
    selectCharacter: PropTypes.func.isRequired,
    selectProduct: PropTypes.func.isRequired,
    selectSceneGroup: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  componentDidMount () {
    this.props.load();
  }

  static styles = {
    container: {
      backgroundColor: colors.black1,
      // Remove default ul style
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    activeSection: {
      boxShadow: 'none'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      characters, currentCharacter, currentProduct, currentSceneGroup, products,
      sceneGroups, selectCharacter, selectProduct, selectSceneGroup, style
    } = this.props;

    return (
      <ul style={[ style, styles.container ]}>
        <Section activeStyle={styles.activeSection} title='Scenes'>
          {sceneGroups.map((sceneGroup) => (
            <ListItem
              count={sceneGroup.get('keySceneId') ? 1 : 0}
              key={sceneGroup.get('id')}
              selected={sceneGroup === currentSceneGroup}
              text={sceneGroup.get('label')}
              onClick={selectSceneGroup.bind(null, sceneGroup.get('id'))}/>
          ))}
        </Section>
        <Section activeStyle={styles.activeSection} title='Characters'>
          {characters.map((character) => (
            <ListItem
              count={character.get('countKeyAppearances')}
              imageUrl={`${character.get('portraitImageUrl')}?width=95&height=95`}
              key={character.get('id')}
              selected={character === currentCharacter}
              text={character.get('name')}
              onClick={selectCharacter.bind(null, character.get('id'))} />
          ))}
        </Section>
        <Section activeStyle={styles.activeSection} title='Products'>
          {products.map((product) => (
            <ListItem
              count={product.get('countKeyAppearances')}
              imageUrl={`${product.get('imageUrl')}?width=95&height=95`}
              key={product.get('id')}
              selected={product === currentProduct}
              text={product.get('shortName')}
              onClick={selectProduct.bind(null, product.get('id'))} />
          ))}
        </Section>
      </ul>
    );
  }
}
