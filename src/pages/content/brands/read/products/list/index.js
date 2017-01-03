import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Tile, DropdownCel, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../../_common/components/table/index';
import Line from '../../../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../../../../_common/components/actionDropdown';
import { slowdown } from '../../../../../../utils';
import moment from 'moment';

/* eslint-disable no-alert */

const numberOfRows = 25;

export const prefix = 'products';

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteProduct: bindActionCreators(actions.deleteProduct, dispatch),
  deleteProducts: bindActionCreators(actions.deleteProducts, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Products extends Component {

  static propTypes = {
    deleteProduct: PropTypes.func.isRequired,
    deleteProducts: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
    products: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    const brandId = this.props.params.brandId;
    await this.props.load(this.props.location.query, brandId);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      const brandId = this.props.params.brandId;
      await this.slowSearch(nextProps.location.query, brandId);
    }
  }

  getLastUpdatedOn (product) {
    const date = new Date(product.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  async onDeleteProduct (productId) {
    await this.props.deleteProduct(productId);
    await this.props.load(this.props.location.query, this.props.params.brandId);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo(`/content/brands/read/${this.props.params.brandId}/create/product`);
  }

  onEditEntry (productId) {
    this.props.routerPushWithReturnTo(`/content/products/edit/${productId}`);
  }

  async onClickDeleteSelected () {
    const productIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        productIds.push(key);
      }
    });
    await this.props.deleteProducts(productIds);
    await this.props.load(this.props.location.query, this.props.params.brandId);
  }

  render () {
    const { products, isSelected, location: { query: { productsDisplay, productsPage,
      productsSearchString, productsSortField, productsSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
      onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={productsDisplay}
              isLoading={products.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={productsSearchString}
              textCreateButton='Create product'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage, generalStyles.whiteBackground ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              entityType='Products'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected}/>
              {(productsDisplay === undefined || productsDisplay === 'list') &&
                <div>
                  <Table>
                    <Headers>
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'FULL_NAME')} sortDirection = {productsSortField === 'FULL_NAME' ? sortDirections[productsSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>FULL NAME</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {productsSortField === 'LAST_MODIFIED' ? sortDirections[productsSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                      <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                    </Headers>
                    <Rows isLoading={products.get('_status') !== 'loaded'}>
                      {products.get('data').map((product, index) => {
                        return (
                          <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                            <CheckBoxCel checked={isSelected.get(product.get('id'))} onChange={selectCheckbox.bind(this, product.get('id'))}/>
                            <CustomCel style={{ flex: 2 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/products/read/${product.get('id')}`); }}>
                              {product.get('shortName')}
                            </CustomCel>
                            <CustomCel style={{ flex: 2 }}>
                              {product.get('lastUpdatedBy')}
                            </CustomCel>
                            <CustomCel getValue={this.getLastUpdatedOn} objectToRender={product} style={{ flex: 2 }}/>
                            <DropdownCel>
                              <Dropdown
                                elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/products/edit/${product.get('id')}`); }}>Edit</div>}>
                                <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.onDeleteProduct(product.get('id')); }}>Remove</div>
                              </Dropdown>
                            </DropdownCel>
                          </Row>
                        );
                      })}
                    </Rows>
                  </Table>
                  <Pagination currentPage={(productsPage && (parseInt(productsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(productsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(productsPage, 10), true); }}/>
                </div>
              }
              {productsDisplay === 'grid' &&
                <div>
                  <div style={generalStyles.row}>
                    {products.get('data').map((product, index) => (
                      <Tile
                        imageUrl={product.get('logo') && `${product.getIn([ 'logo', 'url' ])}?height=203&width=360`}
                        key={`product${index}`}
                        text={product.get('name')}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/products/read/${product.get('id')}`); }}
                        onDelete={async (e) => { e.preventDefault(); await this.onDeleteProduct(product.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/products/edit/${product.get('id')}`); }}/>
                    ))}
                    <Tile key={'createProduct'} onCreate={() => { this.props.routerPushWithReturnTo('/content/products/create'); }}/>
                  </div>
                  <Pagination currentPage={(productsPage && (parseInt(productsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(productsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(productsPage, 10), true); }}/>
                </div>
              }
          </div>
        </div>
      </div>
    );
  }
}
