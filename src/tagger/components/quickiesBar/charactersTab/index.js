/* eslint-disable no-return-assign */
/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as characterActions from '../../../actions/character';
import * as quickiesActions from '../../../actions/quickies';
import charactersTabSelector from '../../../selectors/quickiesBar/charactersTab';
import ProductGroupSections from '../_helpers/productGroupSections';
import ProductGroupCreateForm from '../_helpers/productGroupCreateForm';
import { colors } from '../styles';
import Character from './character';

const backImage = require('./images/back.svg');

@connect(charactersTabSelector, (dispatch) => ({
  openCharacter: bindActionCreators(characterActions.openCharacter, dispatch),
  loadCharacters: bindActionCreators(quickiesActions.loadCharacters, dispatch),
  deleteProductQuicky: bindActionCreators(characterActions.deleteProductQuicky, dispatch),
  persistProductGroup: bindActionCreators(characterActions.persistProductGroup, dispatch),
  createProductGroupProduct: bindActionCreators(characterActions.createProductGroupProduct, dispatch),
  deleteProductGroup: bindActionCreators(characterActions.deleteProductGroup, dispatch),
  loadProductGroup: bindActionCreators(characterActions.loadProductGroup, dispatch),
  selectProduct: bindActionCreators(quickiesActions.selectProduct, dispatch),
  selectProductGroupToEdit: bindActionCreators(characterActions.selectProductGroupToEdit, dispatch)
}))
@Radium
export default class CharactersTab extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.map.isRequired,
    createProductGroupProduct: PropTypes.func.isRequired,
    currentCharacter: ImmutablePropTypes.map,
    currentEditProductGroupId: PropTypes.string,
    deleteProductGroup: PropTypes.func.isRequired,
    deleteProductQuicky: PropTypes.func.isRequired,
    loadCharacters: PropTypes.func.isRequired,
    loadProductGroup: PropTypes.func.isRequired,
    mediumCharacters: ImmutablePropTypes.list.isRequired,
    openCharacter: PropTypes.func.isRequired,
    persistProductGroup: PropTypes.func.isRequired,
    productGroups: ImmutablePropTypes.map,
    products: ImmutablePropTypes.map.isRequired,
    selectProduct: PropTypes.func.isRequired,
    selectProductGroupToEdit: PropTypes.func.isRequired,
    selectedProductId: PropTypes.string,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.openCharacter = ::this.openCharacter;
  }

  componentDidMount () {
    this.props.loadCharacters();
  }

  openCharacter (e) {
    e.preventDefault();
    this.props.openCharacter();
  }

  static styles = {
    container: {
      listStyle: 'none',
      margin: 0,
      paddingLeft: 0
    },
    tab: {
      base: {
        backgroundColor: colors.darkGray,
        color: colors.lightGray,
        cursor: 'pointer',
        fontFamily: 'Rubik-Regular',
        fontSize: '12px',
        textTransform: 'uppercase',
        paddingLeft: 20,
        paddingRight: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      selected: {
        backgroundColor: colors.darkestGray,
        color: 'white'
      }
    },
    input: {
      backgroundColor: 'transparent',
      border: 'none'
    },
    character: {
      arrow: {
        position: 'absolute'
      },
      container: {
        backgroundColor: colors.darkGray,
        cursor: 'pointer',
        padding: '10px 20px 10px 20px'
      },
      name: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        width: '100%',
        padding: '0px 25px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      characters, createProductGroupProduct, currentCharacter, currentEditProductGroupId,
      deleteProductGroup, deleteProductQuicky, loadProductGroup, mediumCharacters,
      openCharacter, products, persistProductGroup, productGroups, selectedProductId,
      selectProduct, selectProductGroupToEdit, style
    } = this.props;

    if (currentCharacter) {
      return (
        <div>
          <div style={styles.character.container} title='Back to overview' onClick={this.openCharacter}>
            <img src={backImage} style={styles.character.arrow} />
            <div style={styles.character.name}>{currentCharacter.get('name')}</div>
          </div>
          <ProductGroupCreateForm
            form='createCharacterProductGroup'
            onSubmit={persistProductGroup} />
          <ProductGroupSections
            characters={characters}
            currentEditProductGroupId={currentEditProductGroupId}
            productGroups={productGroups}
            products={products}
            selectedProductId={selectedProductId}
            onDeleteProductGroup={deleteProductGroup}
            onDeleteProductQuicky={deleteProductQuicky}
            onDropProduct={createProductGroupProduct}
            onEditProductGroup={persistProductGroup}
            onOpen={loadProductGroup}
            onSelectProduct={selectProduct}
            onSelectProductGroupToEdit={selectProductGroupToEdit} />
        </div>
      );
    }
    // List of characters of the current medium.
    return (
      <ul style={[ styles.container, style ]}>
        {mediumCharacters.map((character) => (
          character && character.get('id') && (
            <Character
              character={character}
              key={character.get('id')}
              onClick={openCharacter.bind(null, character.get('id'))} />
          )
        ))}
      </ul>
    );
  }

}
