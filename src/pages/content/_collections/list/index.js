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
import * as actions from './actions';

@connect(null, (dispatch) => ({
  loadCollections: bindActionCreators(actions.fetchMediumCollections, dispatch),
  persistCollection: bindActionCreators(actions.persistCollection, dispatch),
  deleteCollection: bindActionCreators(actions.deleteCollection, dispatch)
}))
@Radium
export default class Collections extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    deleteCollection: PropTypes.func.isRequired,
    loadCollections: PropTypes.func.isRequired,
    mediumCollections: ImmutablePropTypes.map.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistCollection: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onSubmit = :: this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentDidMount () {
    const { loadCollections, mediumId } = this.props;
    loadCollections({ mediumId });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteCollection (collectionId) {
    const { mediumId, loadCollections, deleteCollection } = this.props;
    await deleteCollection({ collectionId, mediumId });
    await loadCollections({ mediumId });
  }

  async onSubmit (form) {
    const { collectionId } = form;
    const { loadCollections, persistCollection, mediumId } = this.props;
    await persistCollection({ ...form, collectionId, mediumId });
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
      brandsById, charactersById, mediumId, searchBrands, searchCharacters,
      searchedBrandIds, mediumCollections, searchedCharacterIds
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
                onCollectionDelete={this.onClickDeleteCollection.bind(this, collection.get('id'))}
                onCollectionEdit={this.onClickDeleteCollection.bind(this, collection.get('id'))}/>
            );
          })}
        </Section>
        {this.state.create &&
          <PersistCollectionModal
            brandsById={brandsById}
            charactersById={charactersById}
            searchBrands={searchBrands}
            searchCharacters={searchCharacters.bind(this, mediumId)}
            searchedBrandIds={searchedBrandIds}
            searchedCharacterIds={searchedCharacterIds}
            onClose={() => this.setState({ create: false })}
            onSubmit={this.onSubmit} />}
      </Section>
    );
  }

}
