import React, { Component, PropTypes } from 'react';
import { Search } from '../../_helpers/search';
import ProductList from './list';

export default class ProductSearch extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    style: PropTypes.object,
    value: PropTypes.string,
    onOptionSelected: PropTypes.func.isRequired
  };

  render () {
    const { options, search, style, value, onOptionSelected } = this.props;

    return (
      <Search
        customListComponent={ProductList}
        displayOption={(product) => `${product.get('brandName')} - ${product.get('shortName')}`}
        focus
        inputClass='search__input-gray'
        options={options}
        search={search}
        style={style}
        value={value}
        onOptionSelected={onOptionSelected} />
    );
  }
}
