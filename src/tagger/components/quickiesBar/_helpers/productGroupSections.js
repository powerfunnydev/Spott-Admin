import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Section from '../../_helpers/section';
import ListOfQuickies from './listOfQuickies';
import SectionTitle from './sectionTitle';

export default class ProductGroupSections extends Component {

  static propTypes = {
    // Entities hash to lookup a character.
    characters: ImmutablePropTypes.map.isRequired,
    currentEditProductGroupId: PropTypes.string,
    productGroups: ImmutablePropTypes.map.isRequired,
    // Entities hash to lookup a product.
    products: ImmutablePropTypes.map.isRequired,
    selectedProductId: PropTypes.string,
    onDeleteProductGroup: PropTypes.func.isRequired,
    onDeleteProductQuicky: PropTypes.func.isRequired,
    onDropProduct: PropTypes.func.isRequired,
    onEditProductGroup: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    onSelectProduct: PropTypes.func.isRequired,
    onSelectProductGroupToEdit: PropTypes.func.isRequired
  };

  renderSectionTitle (productGroup) {
    const { currentEditProductGroupId, onEditProductGroup, onDeleteProductGroup, onSelectProductGroupToEdit } = this.props;
    const productGroupId = productGroup.get('id');
    return (
      <SectionTitle
        editing={currentEditProductGroupId === productGroupId}
        productGroup={productGroup}
        onClickEdit={onSelectProductGroupToEdit.bind(null, productGroupId)}
        onDelete={onDeleteProductGroup.bind(null, productGroupId)}
        onEdit={onEditProductGroup} />
    );
  }

  render () {
    const { characters, products, productGroups, selectedProductId, onDeleteProductQuicky, onDropProduct, onOpen, onSelectProduct } = this.props;
    return (
      <div>
        {productGroups.get('data')
        .map((productGroup, i) => (
          <Section
            key={productGroup.get('id')}
            title={this.renderSectionTitle(productGroup)}
            onOpen={onOpen.bind(null, productGroup.get('id'))}>
            <ListOfQuickies
              characters={characters}
              products={products}
              quickies={productGroup.get('products')}
              selectedProductId={selectedProductId}
              onDeleteCharacterQuicky={() => {}}
              onDeleteProductQuicky={onDeleteProductQuicky.bind(null, productGroup.get('id'))}
              onDropProduct={onDropProduct.bind(null, productGroup.get('id'))}
              onSelectProduct={onSelectProduct} />
          </Section>
        ))}
      </div>
    );
  }
}
