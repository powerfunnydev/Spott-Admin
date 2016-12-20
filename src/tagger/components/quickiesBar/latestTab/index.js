import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as quickiesActions from '../../../actions/quickies';
import latestTabSelector from '../../../selectors/quickiesBar/latestTab';
import ListOfQuickies from '../_helpers/listOfQuickies';
import CharacterDropDown from './characterDropDown';

@connect(latestTabSelector, (dispatch) => ({
  deleteCharacterQuicky: bindActionCreators(quickiesActions.deleteCharacterQuicky, dispatch),
  deleteProductQuicky: bindActionCreators(quickiesActions.deleteProductQuicky, dispatch),
  selectCharacter: bindActionCreators(quickiesActions.selectCharacter, dispatch),
  loadProductGroup: bindActionCreators(quickiesActions.loadProductGroup, dispatch),
  selectProduct: bindActionCreators(quickiesActions.selectProduct, dispatch),
  selectProductGroupToEdit: bindActionCreators(quickiesActions.selectProductGroupToEdit, dispatch)
}))
@Radium
export default class LatestTab extends Component {

  static propTypes = {
    characterList: ImmutablePropTypes.orderedSet.isRequired,
    characters: ImmutablePropTypes.map.isRequired,
    currentCharacter: ImmutablePropTypes.map,
    deleteCharacterQuicky: PropTypes.func.isRequired,
    deleteProductQuicky: PropTypes.func.isRequired,
    products: ImmutablePropTypes.map.isRequired,
    quickies: ImmutablePropTypes.list.isRequired,
    selectCharacter: PropTypes.func.isRequired,
    selectProduct: PropTypes.func.isRequired,
    selectedProductId: PropTypes.string,
    style: PropTypes.object
  };

  static styles = {
    message: {
      backgroundColor: '#202020',
      opacity: 0.5,
      textAlign: 'center',
      color: 'white',
      padding: '40px 20px 40px 20px'
    }
  };

  render () {
    const { styles } = this.constructor;
    const {
      characters, characterList, currentCharacter, products, quickies, style,
      deleteCharacterQuicky, deleteProductQuicky, selectCharacter, selectProduct,
      selectedProductId
    } = this.props;
    return (
      <div style={style}>
        {characterList.count() > 0 &&
          <CharacterDropDown
            characters={characterList}
            currentCharacter={currentCharacter}
            onSelectCharacter={selectCharacter} />}
        {quickies.count() > 0
          ? <ListOfQuickies
            characters={characters}
            products={products}
            quickies={quickies}
            selectedProductId={selectedProductId}
            onDeleteCharacterQuicky={deleteCharacterQuicky}
            onDeleteProductQuicky={deleteProductQuicky.bind(null, null)}
            onSelectProduct={selectProduct} />
          : <div style={styles.message}>
              {currentCharacter
                ? 'Link a product to this character.'
                : 'Add a character or product to a scene.'}
            </div>}
      </div>
    );
  }

}
