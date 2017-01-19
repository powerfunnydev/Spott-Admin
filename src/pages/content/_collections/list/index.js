/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Section from '../../../_common/components/section';
import { buttonStyles, colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../_common/styles';
import PlusButton from '../../../_common/components/buttons/plusButton';
import RemoveButton from '../../../_common/components/buttons/removeButton';
import Collection from './collection';
import PersistCollectionModal from '../persist';
import PersistCollectionItemModal from './collectionItems/persist';
import * as actions from './actions';

@connect(null, (dispatch) => ({
  loadCollection: bindActionCreators(actions.loadCollection, dispatch),
  loadCollections: bindActionCreators(actions.loadCollections, dispatch),
  loadCollectionItems: bindActionCreators(actions.fetchCollectionItems, dispatch),
  persistCollection: bindActionCreators(actions.persistCollection, dispatch),
  persistCollectionItem: bindActionCreators(actions.persistCollectionItem, dispatch),
  deleteCollection: bindActionCreators(actions.deleteCollection, dispatch)
}))
@Radium
export default class Collections extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    deleteCollection: PropTypes.func.isRequired,
    loadCollection: PropTypes.func.isRequired,
    loadCollectionItems: PropTypes.func.isRequired,
    loadCollections: PropTypes.func.isRequired,
    mediumCollections: ImmutablePropTypes.map.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistCollection: PropTypes.func.isRequired,
    persistCollectionItem: PropTypes.func.isRequired,
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
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onCollectionItemCreate = ::this.onCollectionItemCreate;
    this.onSubmit = :: this.onSubmit;
    this.state = {
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

  onCollectionItemCreate (collectionId) {
    this.setState({ createCollectionItem: { collectionId } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({ createCollection: true });
  }

  async onCollectionDelete (collectionId) {
    const { mediumId, loadCollections, deleteCollection } = this.props;
    await deleteCollection({ collectionId, mediumId });
    await loadCollections({ mediumId });
  }

  async onCollectionEdit (collectionId) {
    const { brand, character, defaultLocale, id, linkType, recurring, title } = await this.props.loadCollection({ collectionId });
    const editCollection = {
      brandId: brand && brand.id,
      characterId: character && character.id,
      collectionId: id,
      defaultLocale,
      linkType,
      recurring,
      title
    };
    console.warn('EDIT COLLECTION', editCollection);
    this.setState({
      editCollection
    });
  }

  async onSubmit (form) {
    const { collectionId } = form;
    const { loadCollections, persistCollection, mediumId } = this.props;
    await persistCollection({ ...form, collectionId, mediumId });
    await loadCollections({ mediumId });
  }

  async onSubmitCollectionItem (collectionId, form) {
    console.warn('collectionId', collectionId, form);
    const { loadCollectionItems, persistCollectionItem } = this.props;
    await persistCollectionItem({ ...form, collectionId });
    await loadCollectionItems({ collectionId });
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
      brandsById, charactersById, mediumId, productsById, searchBrands, searchCharacters,
      searchProducts, searchedBrandIds, searchedProductIds, mediumCollections, searchedCharacterIds
    } = this.props;
    return (
      <Section>
        <FormSubtitle first>Collections</FormSubtitle>
        <FormDescription style={styles.description}>These are shown on and episode landing page. It’s a way to explore the products of an episode without browsing through all the frames.</FormDescription>
        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <FormSubtitle first>Active collections</FormSubtitle>
              <FormDescription style={styles.description}>These collections will be shown to the user when landing on an episode page.</FormDescription>
            </div>
            <div>
              <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text='Create Collection' onClick={this.onClickNewEntry} />
            </div>
          </div>
          {mediumCollections.get('data').map((collection, index) => {
            return (
              <Collection
                collection={collection}
                key={collection.get('id')}
                onCollectionItemCreate={this.onCollectionItemCreate.bind(this, collection.get('id'))}
                onCollectionDelete={this.onCollectionDelete.bind(this, collection.get('id'))}
                onCollectionEdit={this.onCollectionEdit.bind(this, collection.get('id'))}/>
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
            onClose={() => this.setState({ createCollection: false, editCollection: false })}
            onSubmit={this.onSubmit} />}
        {this.state.createCollectionItem &&
          <PersistCollectionItemModal
            productsById={productsById}
            searchProducts={searchProducts}
            searchedProductIds={searchedProductIds}
            onClose={() => this.setState({ createCollectionItem: false })}
            onSubmit={this.onSubmitCollectionItem.bind(this, this.state.createCollectionItem.collectionId)} />}
      </Section>
    );
  }

}
