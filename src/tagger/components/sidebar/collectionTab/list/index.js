/* eslint-disable react/no-set-state */
// False positive on the arguments of an async function.
/* eslint-disable react/prop-types */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { colors, fontWeights, makeTextStyle } from '../../../../../pages/_common/styles';
import tabStyle from '../../tabStyle';
import Collection from './collection';
import PersistCollectionModal from '../persist';
import PersistCollectionItemModal from './collectionItems/persist';
import * as actions from './actions';
import selector from './selector';

@connect(selector, (dispatch) => ({
  loadCollection: bindActionCreators(actions.loadCollection, dispatch),
  loadCollections: bindActionCreators(actions.loadCollections, dispatch),
  loadCollectionItem: bindActionCreators(actions.loadCollectionItem, dispatch),
  loadCollectionItems: bindActionCreators(actions.fetchCollectionItems, dispatch),
  persistMoveCollection: bindActionCreators(actions.moveCollection, dispatch),
  persistMoveCollectionItem: bindActionCreators(actions.moveCollectionItem, dispatch),
  persistMoveCollectionItemToOtherCollection: bindActionCreators(actions.moveCollectionItemToOtherCollection, dispatch),
  persistCollection: bindActionCreators(actions.persistCollection, dispatch),
  persistCollectionItem: bindActionCreators(actions.persistCollectionItem, dispatch),
  deleteCollection: bindActionCreators(actions.deleteCollection, dispatch),
  deleteCollectionItem: bindActionCreators(actions.deleteCollectionItem, dispatch),
  searchBrands: bindActionCreators(actions.searchCollectionsBrands, dispatch),
  searchCharacters: bindActionCreators(actions.searchCollectionsCharacters, dispatch),
  searchProducts: bindActionCreators(actions.searchCollectionsProducts, dispatch)
}))
@Radium
export default class Collections extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    deleteCollection: PropTypes.func.isRequired,
    deleteCollectionItem: PropTypes.func.isRequired,
    loadCollection: PropTypes.func.isRequired,
    loadCollectionItem: PropTypes.func.isRequired,
    loadCollectionItems: PropTypes.func.isRequired,
    loadCollections: PropTypes.func.isRequired,
    mediumCollections: ImmutablePropTypes.map.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistCollection: PropTypes.func.isRequired,
    persistCollectionItem: PropTypes.func.isRequired,
    persistMoveCollection: PropTypes.func.isRequired,
    persistMoveCollectionItem: PropTypes.func.isRequired,
    persistMoveCollectionItemToOtherCollection: PropTypes.func.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchProducts: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedProductIds: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.moveCollection = ::this.moveCollection;
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onCollectionItemMove = ::this.onCollectionItemMove;
    this.onCollectionItemMoveToOtherCollection = ::this.onCollectionItemMoveToOtherCollection;
    this.onCollectionMove = ::this.onCollectionMove;
    this.onSubmitCollection = :: this.onSubmitCollection;
    this.onSubmitCollectionItem = ::this.onSubmitCollectionItem;
    this.state = {
      collections: props.mediumCollections,
      createCollection: false,
      createCollectionItem: false,
      editCollection: false,
      editCollectionItem: false
    };
  }

  componentDidMount () {
    const { loadCollections, mediumId } = this.props;
    loadCollections({ mediumId });
  }

  componentWillReceiveProps (newProps) {
    if (this.props.mediumCollections !== newProps.mediumCollections && newProps.mediumCollections.get('_status') === 'loaded') {
      this.setState({
        ...this.state,
        collections: newProps.mediumCollections
      });
    }
  }

  // Locally mutate the state, move a collection.
  moveCollection (dragIndex, hoverIndex) {
    const { collections } = this.state;
    const collectionsData = collections.get('data');
    const dragCollection = collectionsData.get(dragIndex);

    console.warn('MOVE COLLECTION', dragIndex, hoverIndex);

    const newData = collectionsData
      .remove(dragIndex)
      .splice(hoverIndex, 0, dragCollection);

    this.setState({
      ...this.state,
      collections: collections.set('data', newData)
    });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      createCollection: true
    });
  }

  async onCollectionDelete (collectionId) {
    const { mediumId, loadCollections, deleteCollection } = this.props;
    await deleteCollection({ collectionId, mediumId });
    await loadCollections({ mediumId });
  }

  async onCollectionEdit (collectionId) {
    const { basedOnDefaultLocale, brand, character, defaultLocale, id, linkType, recurring, title } = await this.props.loadCollection({ collectionId });
    const editCollection = {
      basedOnDefaultLocale,
      brandId: brand && brand.id,
      characterId: character && character.id,
      collectionId: id,
      defaultLocale,
      linkType,
      recurring,
      title
    };
    this.setState({
      ...this.state,
      editCollection
    });
  }

  onCollectionItemCreate (collectionId) {
    this.setState({
      ...this.state,
      createCollectionItem: { collectionId, relevance: 'EXACT' }
    });
  }

  async onCollectionItemDelete (collectionId, collectionItemId) {
    const { deleteCollectionItem, loadCollectionItems } = this.props;
    await deleteCollectionItem({ collectionItemId });
    await loadCollectionItems({ collectionId });
  }

  async onCollectionItemEdit (collectionId, collectionItemId) {
    const { product, relevance } = await this.props.loadCollectionItem({ collectionItemId });
    const editCollectionItem = { collectionId, collectionItemId, productId: product && product.id, relevance };
    this.setState({
      ...this.state,
      editCollectionItem
    });
  }

  async onSubmitCollection (form) {
    const { collectionId } = form;
    const { loadCollections, persistCollection, mediumId } = this.props;
    await persistCollection({ ...form, collectionId, mediumId });
    await loadCollections({ mediumId });
  }

  async onSubmitCollectionItem (form) {
    const { loadCollectionItems, persistCollectionItem } = this.props;
    await persistCollectionItem(form);
    await loadCollectionItems({ collectionId: form.collectionId });
  }

  async onCollectionItemMove ({ before, sourceCollectionId, sourceCollectionItemId, targetCollectionItemId }) {
    const { loadCollectionItems, persistMoveCollectionItem } = this.props;
    await persistMoveCollectionItem({
      before,
      sourceCollectionItemId,
      targetCollectionItemId
    });
    await loadCollectionItems({ collectionId: sourceCollectionId });
  }

  async onCollectionMove ({ before, sourceCollectionId, targetCollectionId }) {
    const { loadCollections, mediumId, persistMoveCollection } = this.props;
    await persistMoveCollection({ before, sourceCollectionId, targetCollectionId });
    await loadCollections({ mediumId });
  }

  async onCollectionItemMoveToOtherCollection ({ sourceCollectionId, sourceCollectionItemId, targetCollectionId }) {
    const { loadCollectionItems, persistMoveCollectionItemToOtherCollection } = this.props;
    await persistMoveCollectionItemToOtherCollection({ collectionId: targetCollectionId, collectionItemId: sourceCollectionItemId });
    await loadCollectionItems({ collectionId: sourceCollectionId });
    await loadCollectionItems({ collectionId: targetCollectionId });
  }

  static styles = {
    add: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: colors.primaryBlue,
      flex: 8,
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 245, 245, 0.5)'
    },
    editButton: {
      marginRight: '0.75em'
    },
    image: {
      width: '2em',
      height: '2em',
      objectFit: 'scale-down'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '0px',
      minHeight: '30px'
    },
    paddingLeft: {
      paddingLeft: '11px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    floatRight: {
      marginLeft: 'auto'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    },
    section: {
      backgroundColor: colors.black1,
      border: `solid 2px ${colors.black1}`,
      borderRadius: 2
    },
    sectionContent: {
      paddingBottom: '1em',
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingTop: '1em'
    },
    description: {
      color: colors.warmGray,
      fontSize: '0.75em',
      lineHeight: 1.25,
      marginTop: 4
    },
    createCollectionButton: {
      borderRadius: 2,
      backgroundColor: colors.strongBlue,
      color: '#fff',
      fontSize: '0.75em',
      width: '100%',
      padding: 4,
      marginTop: 16
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      brandsById, charactersById, mediumId, persistMoveCollection, productsById, searchBrands, searchCharacters,
      searchProducts, searchedBrandIds, searchedProductIds, searchedCharacterIds
    } = this.props;
    console.warn('this.state.collections', this.state.collections && this.state.collections.toJS());
    return (
      <div>
        <div style={styles.section}>
          <div style={styles.sectionContent}>
            <h3 style={[ tabStyle.title, { padding: 0 } ]}>Collections</h3>
            <div style={styles.description}>

              These collections will be shown to the user when landing on an episode page.
            </div>
            <button style={styles.createCollectionButton} onClick={this.onClickNewEntry}>
              {this.props.test}Create collection
            </button>
          </div>
          {this.state.collections.get('data').map((collection, index) => {
            const collectionId = collection.get('id');
            return (
              <Collection
                collection={collection}
                collectionId={collectionId}
                index={index}
                key={collection.get('id')}
                moveCollection={this.moveCollection}
                persistMoveCollection={this.onCollectionMove}
                persistMoveCollectionItem={this.onCollectionItemMove}
                persistMoveCollectionItemToOtherCollection={this.onCollectionItemMoveToOtherCollection}
                style={styles.collection}
                onCollectionDelete={this.onCollectionDelete.bind(this, collectionId)}
                onCollectionEdit={this.onCollectionEdit.bind(this, collectionId)}
                onCollectionItemCreate={this.onCollectionItemCreate.bind(this, collectionId)}
                onCollectionItemDelete={this.onCollectionItemDelete.bind(this, collectionId)}
                onCollectionItemEdit={this.onCollectionItemEdit.bind(this, collectionId)}/>
            );
          })}
        </div>

        {(this.state.createCollection || this.state.editCollection) &&
          <PersistCollectionModal
            brandsById={brandsById}
            charactersById={charactersById}
            collection={this.state.editCollection || undefined}
            edit={Boolean(this.state.editCollection)}
            searchBrands={searchBrands}
            searchCharacters={searchCharacters.bind(this, mediumId)}
            searchedBrandIds={searchedBrandIds}
            searchedCharacterIds={searchedCharacterIds}
            onClose={() => this.setState({ ...this.state, createCollection: false, editCollection: false })}
            onSubmit={this.onSubmitCollection} />}
        {(this.state.createCollectionItem || this.state.editCollectionItem) &&
          <PersistCollectionItemModal
            collectionItem={this.state.createCollectionItem || this.state.editCollectionItem}
            edit={Boolean(this.state.editCollectionItem)}
            productsById={productsById}
            searchProducts={searchProducts}
            searchedProductIds={searchedProductIds}
            onClose={() => this.setState({ ...this.state, createCollectionItem: false, editCollectionItem: false })}
            onSubmit={this.onSubmitCollectionItem} />}
      </div>
    );
  }
}
