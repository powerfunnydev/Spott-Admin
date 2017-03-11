/* eslint-disable react/no-set-state */
// False positive on the arguments of an async function.
/* eslint-disable react/prop-types */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Section from '../../../_common/components/section';
import { buttonStyles, colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../_common/styles';
import Button from '../../../_common/components/buttons/button';
import PlusButton from '../../../_common/components/buttons/plusButton';
import Collection from './collection';
import PersistCollectionModal from '../persist';
import PersistCollectionItemModal from './collectionItems/persist';
import PersistModal, { dialogStyle } from '../../../_common/components/persistModal';
import * as actions from './actions';

@connect(null, (dispatch) => ({
  deleteCollection: bindActionCreators(actions.deleteCollection, dispatch),
  deleteCollectionItem: bindActionCreators(actions.deleteCollectionItem, dispatch),
  loadCollection: bindActionCreators(actions.loadCollection, dispatch),
  loadCollectionItem: bindActionCreators(actions.loadCollectionItem, dispatch),
  loadCollectionItems: bindActionCreators(actions.fetchCollectionItems, dispatch),
  loadCollections: bindActionCreators(actions.loadCollections, dispatch),
  persistCollection: bindActionCreators(actions.persistCollection, dispatch),
  persistCollectionItem: bindActionCreators(actions.persistCollectionItem, dispatch),
  persistMoveCollection: bindActionCreators(actions.moveCollection, dispatch),
  persistMoveCollectionItem: bindActionCreators(actions.moveCollectionItem, dispatch),
  persistMoveCollectionItemToOtherCollection: bindActionCreators(actions.moveCollectionItemToOtherCollection, dispatch),
  reorderCollections: bindActionCreators(actions.reorderCollections, dispatch)
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
    reorderCollections: PropTypes.func.isRequired,
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
    this.moveLiveCollection = ::this.moveLiveCollection;
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
      editCollectionItem: false,
      editLiveCollections: false,
      liveCollections: props.mediumCollections,
      visibleCollections: {}
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
        collections: newProps.mediumCollections,
        liveCollections: newProps.mediumCollections
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
      collections: collections.set('data', newData),
      liveCollections: collections.set('data', newData)
    });
  }

  moveLiveCollection (dragIndex, hoverIndex) {
    const { liveCollections } = this.state;
    const collectionsData = liveCollections.get('data');
    const dragCollection = collectionsData.get(dragIndex);

    console.warn('MOVE LIVE COLLECTION', dragIndex, hoverIndex);

    const newData = collectionsData
      .remove(dragIndex)
      .splice(hoverIndex, 0, dragCollection);

    this.setState({
      ...this.state,
      liveCollections: liveCollections.set('data', newData)
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
    const { basedOnDefaultLocale, brand, character, defaultLocale, id, linkType, recurring, recurringEntries, title } = await this.props.loadCollection({ collectionId });
    const editCollection = {
      basedOnDefaultLocale,
      brandId: brand && brand.id,
      characterId: character && character.id,
      collectionId: id,
      defaultLocale,
      linkType,
      recurring,
      recurringEntries,
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

  async onCollectionItemMoveToOtherCollection ({ sourceCollectionId, sourceCollectionItemId, targetCollectionId }) {
    const { loadCollectionItems, persistMoveCollectionItemToOtherCollection } = this.props;
    await persistMoveCollectionItemToOtherCollection({ collectionId: targetCollectionId, collectionItemId: sourceCollectionItemId });
    await loadCollectionItems({ collectionId: sourceCollectionId });
    await loadCollectionItems({ collectionId: targetCollectionId });
  }

  async onCollectionMove ({ before, sourceCollectionId, targetCollectionId }) {
    const { loadCollections, mediumId, persistMoveCollection } = this.props;
    await persistMoveCollection({ before, sourceCollectionId, targetCollectionId });
    await loadCollections({ mediumId });
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
    description: {
      marginBottom: '1.25em'
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
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      brandsById, charactersById, loadCollections, mediumId, productsById, reorderCollections, searchBrands,
      searchCharacters, searchProducts, searchedBrandIds, searchedProductIds, searchedCharacterIds
    } = this.props;
    return (
      <div>
        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <FormSubtitle first>Collections</FormSubtitle>
              <FormDescription style={styles.description}>These are shown on and episode landing page. It’s a way to explore the products of an episode without browsing through all the frames.</FormDescription>
              <Button
                first
                style={[ buttonStyles.gray, buttonStyles.extraSmall, { marginBottom: 40 } ]}
                text='Manage Live Collections'
                onClick={() => {
                  const visibleCollections = {};
                  for (const collection of this.state.collections.get('data')) {
                    visibleCollections[collection.get('id')] = collection.get('visible');
                  }
                  this.setState({
                    ...this.state,
                    editLiveCollections: true,
                    visibleCollections
                  });
                }}/>
            </div>
            <div>
              <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text='Create Collection' onClick={this.onClickNewEntry} />
            </div>
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
                onCollectionDelete={this.onCollectionDelete.bind(this, collectionId)}
                onCollectionEdit={this.onCollectionEdit.bind(this, collectionId)}
                onCollectionItemCreate={this.onCollectionItemCreate.bind(this, collectionId)}
                onCollectionItemDelete={this.onCollectionItemDelete.bind(this, collectionId)}
                onCollectionItemEdit={this.onCollectionItemEdit.bind(this, collectionId)}/>
            );
          })}
        </Section>
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
        {this.state.editLiveCollections &&
          <PersistModal
            isOpen
            style={{
              ...dialogStyle,
              content: {
                ...dialogStyle.content,
                maxWidth: 830
              }
            }}
            submitButtonText='Save'
            title='Manage Live Collections'
            onClose={() => this.setState({ ...this.state, editLiveCollections: false })}
            onSubmit={async () => {
              // We kept track of the visibility of a collection, with the state.
              const { liveCollections, visibleCollections } = this.state;
              const collections = [];
              // Create an array of tuples with the collection id and the visibility.
              for (const liveCollection of liveCollections.get('data')) {
                collections.push({
                  id: liveCollection.get('id'),
                  visible: visibleCollections[liveCollection.get('id')]
                });
              }
              // Reorder the collections and change the visibility.
              await reorderCollections({ collections, mediumId });
              await loadCollections({ mediumId });
              this.setState({ ...this.state, editLiveCollections: false });
            }}>
            <div>
              <FormSubtitle first>Live Collections</FormSubtitle>
              <FormDescription style={styles.description}>Enable or disable the collections that will be visible to the user in a matter of seconds upon saving.</FormDescription>
            </div>
            {this.state.liveCollections.get('data').map((collection, index) => {
              const collectionId = collection.get('id');
              return (
                <Collection
                  collection={collection.set('visible', this.state.visibleCollections[collectionId])}
                  collectionId={collectionId}
                  index={index}
                  key={collection.get('id')}
                  moveCollection={this.moveLiveCollection}
                  persistMoveCollection={() => console.warn('persist collection move!')}
                  onChangeCollectionVisibility={() => {
                    // Update the visibility in the state.
                    const visibleCollections = this.state.visibleCollections;
                    visibleCollections[collectionId] = !visibleCollections[collectionId];
                    this.setState({ ...this.state, visibleCollections });
                  }}/>
              );
            })}
          </PersistModal>}
      </div>
    );
  }
}
