import React, { Component, PropTypes } from 'react';
import { Search } from '../../_helpers/search';
import ProductList from './list';

export default class ProductSearch extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    value: PropTypes.string,
    onOptionSelected: PropTypes.func.isRequired
  };

  render () {
    return (
      <Search
        customListComponent={ProductList}
        displayOption={(product) => `${product.get('brandName')} - ${product.get('shortName')}`}
        focus
        {...this.props} />
    );
  }
}
