import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { initialize, Field } from 'redux-form/immutable';
import { filterStyles, Root, Container } from '../../../_common/styles';
import { generalStyles, getInformationFromQuery, headerStyles, isQueryChanged, tableDecorator, DropdownCel, Tile, UtilsBar, TotalEntries, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import { FilterContent } from '../../../_common/components/filterDropdown';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import publishStatusTypes from '../../../../constants/publishStatusTypes';
import SelectionDropdown from '../../../_common/components/selectionDropdown';
import * as actions from './actions';
import selector from './selector';

const numberOfRows = 25;
const prefix = 'products';
const filterArray = [ 'publishStatus' ];

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteProduct: bindActionCreators(actions.deleteProduct, dispatch),
  deleteProducts: bindActionCreators(actions.deleteProducts, dispatch),
  initializeForm: bindActionCreators(initialize, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Products extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteProduct: PropTypes.func.isRequired,
    deleteProducts: PropTypes.func.isRequired,
    getFilterObjectFromQuery: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    products: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired, // See table decorator.
    onChangeFilter: PropTypes.func.isRequired, // See table decorator.
    onChangePage: PropTypes.func.isRequired, // See table decorator.
    onChangeSearchString: PropTypes.func.isRequired, // See table decorator.
    onSortField: PropTypes.func.isRequired // See table decorator.
  };

  constructor (props) {
    super(props);
    this.onCreateProduct = ::this.onCreateProduct;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    const { getFilterObjectFromQuery, initializeForm } = this.props;
    await this.props.load(getInformationFromQuery(this.props.location.query, prefix, filterArray));
    initializeForm('productList', getFilterObjectFromQuery(filterArray));
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix, filterArray)) {
      this.slowSearch(getInformationFromQuery(nextQuery, prefix, filterArray));
    }
  }

  async deleteProduct (productsId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteProduct(productsId);
      await this.props.load(getInformationFromQuery(this.props.location.query, prefix, filterArray));
    }
  }

  getLastUpdatedOn (product) {
    const date = new Date(product.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onCreateProduct (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/products/create');
  }

  async onClickDeleteSelected () {
    const productIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        productIds.push(key);
      }
    });
    await this.props.deleteProducts(productIds);
    await this.props.load(getInformationFromQuery(this.props.location.query, prefix, filterArray));
  }

  render () {
    const {
      products, children, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeFilter, onChangeDisplay, onChangeSearchString
    } = this.props;

    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <SideMenu>
        <Root>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                filterContent={
                  <FilterContent
                    form='productList'
                    initialValues={{ publishStatus: null }}
                    style={filterStyles.filterContent}
                    onApplyFilter={onChangeFilter}>
                    <div style={filterStyles.row}>
                      <div style={filterStyles.title}>Publish Status</div>
                      <Field
                        component={SelectionDropdown}
                        getItemText={(key) => publishStatusTypes[key]}
                        name='publishStatus'
                        options={Object.keys(publishStatusTypes)}
                        placeholder='Publish Status'
                        style={filterStyles.fullWidth}/>
                    </div>
                  </FilterContent>
                }
                isLoading={products.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Product'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onCreateProduct}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Products'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <Table>
                    <Headers>
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'FULL_NAME')} sortDirection = {sortField === 'FULL_NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>FULL NAME</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>BRAND</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>PUBLISH STATUS</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
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
                            <CustomCel style={{ flex: 2 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/brands/read/${product.getIn([ 'brand', 'id' ])}`); }}>
                              {product.getIn([ 'brand', 'name' ])}
                            </CustomCel>
                            <CustomCel style={{ flex: 2 }}>
                              {product.get('publishStatus')}
                            </CustomCel>
                            <CustomCel style={{ flex: 2 }}>
                              {product.get('lastUpdatedBy')}
                            </CustomCel>
                            <CustomCel getValue={this.getLastUpdatedOn} objectToRender={product} style={{ flex: 2 }}/>
                            <DropdownCel>
                              <Dropdown
                                elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/products/edit/${product.get('id')}`); }}>Edit</div>}>
                                <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteProduct(product.get('id')); }}>Remove</div>
                              </Dropdown>
                            </DropdownCel>
                          </Row>
                        );
                      })}
                    </Rows>
                  </Table>
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
              {display === 'grid' &&
                <div>
                  <div style={generalStyles.row}>
                    {products.get('data').map((product, index) => (
                      <Tile
                        imageUrl={product.get('logo') && `${product.getIn([ 'logo', 'url' ])}?height=203&width=360`}
                        key={`product${index}`}
                        text={product.get('name')}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/products/read/${product.get('id')}`); }}
                        onDelete={async (e) => { e.preventDefault(); await this.deleteProduct(product.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/products/edit/${product.get('id')}`); }}/>
                    ))}
                    <Tile key={'createProduct'} onCreate={() => { this.props.routerPushWithReturnTo('/content/products/create'); }}/>
                  </div>
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
            </Container>
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
