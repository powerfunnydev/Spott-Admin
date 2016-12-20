import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as quickiesActions from '../../../actions/quickies';
import scenesTabSelector from '../../../selectors/quickiesBar/scenesTab';
import ProductGroupCreateForm from '../_helpers/productGroupCreateForm';
import ProductGroupSections from '../_helpers/productGroupSections';

@connect(scenesTabSelector, (dispatch) => ({
  deleteProductQuicky: bindActionCreators(quickiesActions.deleteProductQuicky, dispatch),
  persistProductGroup: bindActionCreators(quickiesActions.persistProductGroup, dispatch),
  createProductGroupProduct: bindActionCreators(quickiesActions.createProductGroupProduct, dispatch),
  deleteProductGroup: bindActionCreators(quickiesActions.deleteProductGroup, dispatch),
  loadProductGroup: bindActionCreators(quickiesActions.loadProductGroup, dispatch),
  selectProduct: bindActionCreators(quickiesActions.selectProduct, dispatch),
  selectProductGroupToEdit: bindActionCreators(quickiesActions.selectProductGroupToEdit, dispatch)
}))
@Radium
export default class ScenesTab extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.map.isRequired,
    createProductGroupProduct: PropTypes.func.isRequired,
    currentEditProductGroupId: PropTypes.string,
    deleteProductGroup: PropTypes.func.isRequired,
    deleteProductQuicky: PropTypes.func.isRequired,
    loadProductGroup: PropTypes.func.isRequired,
    persistProductGroup: PropTypes.func.isRequired,
    productGroups: ImmutablePropTypes.map.isRequired,
    products: ImmutablePropTypes.map.isRequired,
    selectProduct: PropTypes.func.isRequired,
    selectProductGroupToEdit: PropTypes.func.isRequired,
    selectedProductId: PropTypes.string,
    style: PropTypes.object
  };

  render () {
    const {
      characters, createProductGroupProduct, currentEditProductGroupId, deleteProductGroup,
      deleteProductQuicky, loadProductGroup, persistProductGroup, productGroups,
      products, selectProduct, selectedProductId, selectProductGroupToEdit, style
    } = this.props;

    return (
      <div style={style}>
        <ProductGroupCreateForm onSubmit={persistProductGroup} />
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

}
