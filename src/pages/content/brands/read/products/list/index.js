import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Tile, DropdownCel, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../../_common/components/table/index';
import * as actions from './actions';
import selector from './selector';
import { colors } from '../../../../../_common/styles';
import Line from '../../../../../_common/components/line';
import Dropdown, { styles as dropdownStyles } from '../../../../../_common/components/actionDropdown';
import { slowdown } from '../../../../../../utils';
import QuestionSVG from '../../../../../_common/images/question';
import DollarSVG from '../../../../../_common/images/dollar';
import ToolTip from '../../../../../_common/components/toolTip';

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
    currencies: ImmutablePropTypes.map.isRequired,
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

  static styles = {
    offeringContainer: {
      fontSize: '12px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    offeringPaddingRight: {
      paddingRight: '5px'
    },
    offeringShop: {
      color: colors.veryDarkGray,
      textDecoration: 'underline',
      cursor: 'pointer',
      paddingRight: '3px'
    },
    offeringPrice: {
      color: colors.darkGray2
    },
    tooltipOverlay: {
      padding: '11px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: '500px'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    questionSvg: {
      display: 'inline-flex',
      alignItems: 'center'
    },
    dollarSvg: {
      display: 'inline-flex',
      alignItems: 'center',
      paddingRight: '4px'
    },
    spacing: {
      paddingRight: '7px'
    },
    affiliatePaddingRight: {
      paddingRight: '4px'
    },
    logo: {
      width: '22px',
      height: '22px',
      borderRadius: '2px'
    },
    logoContainer: {
      paddingRight: '10px',
      display: 'inline-flex'
    },
    logoPlaceholder: {
      paddingRight: '32px'
    }
  }

  render () {
    const { currencies, products, isSelected, location: { query: { productsDisplay, productsPage,
      productsSearchString, productsSortField, productsSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
      onChangeDisplay, onChangeSearchString } = this.props;
    const { styles } = this.constructor;
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
                      <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.base, headerStyles.first ]} onChange={selectAllCheckboxes}/>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'FULL_NAME')} sortDirection = {productsSortField === 'FULL_NAME' ? sortDirections[productsSortDirection] : NONE} style={[ headerStyles.base, headerStyles.clickable, { flex: 1 } ]}>FULL NAME</CustomCel>
                      <CustomCel style={[ headerStyles.base, { width: 150 } ]}>OFFERINGS</CustomCel>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {productsSortField === 'LAST_MODIFIED' ? sortDirections[productsSortDirection] : NONE} style={[ headerStyles.base, headerStyles.clickable, { width: 150 } ]}>LAST UPDATED ON</CustomCel>
                      <DropdownCel style={[ headerStyles.base ]}/>
                    </Headers>
                    <Rows isLoading={products.get('_status') !== 'loaded'}>
                      {products.get('data').map((product, index) => {
                        const offeringsArray = product.get('offerings') && product.get('offerings').toArray() || [];
                        const numberOfAffiliates = offeringsArray.reduce((total, offer, key) => offer.get('affiliateCode') ? total + 1 : total, 0);
                        const numberOfNonAffiliates = offeringsArray.length - numberOfAffiliates;
                        const offerings = offeringsArray.map((offering, i) => {
                          return (
                            <div key={`product${index}offering${i}`} style={[ styles.offeringContainer, ((i + 1) !== offeringsArray.length) && styles.offeringPaddingRight ]}>
                              {offering.get('affiliateCode') && <div style={styles.dollarSvg}><DollarSVG/></div>}
                              <span
                                style={styles.offeringShop}
                                onClick={() => { this.props.routerPushWithReturnTo(`/content/shops/read/${offering.getIn([ 'shop', 'id' ])}`); }}>
                                  {offering.getIn([ 'shop', 'name' ])}
                              </span>
                              <span style={styles.offeringPrice}>
                                ({offering.getIn([ 'price', 'amount' ])}{currencies.getIn([ offering.getIn([ 'price', 'currency' ]), 'symbol' ])})
                                {((i + 1) !== offeringsArray.length) && <span>,</span>}
                              </span>
                            </div>
                          );
                        });
                        return (
                          <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                            <CheckBoxCel checked={isSelected.get(product.get('id'))} onChange={selectCheckbox.bind(this, product.get('id'))}/>
                            <CustomCel style={{ flex: 1 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/products/read/${product.get('id')}`); }}>
                              {product.get('logo') && <div style={styles.logoContainer}>
                                <ToolTip
                                  overlay={<img src={`${product.getIn([ 'logo', 'url' ])}?height=150&width=150`}/>}
                                  placement='top'
                                  prefixCls='no-arrow'>
                                  <img src={`${product.getIn([ 'logo', 'url' ])}?height=150&width=150`} style={styles.logo} />
                                </ToolTip>
                              </div> || <div style={styles.logoPlaceholder}/>} {product.get('shortName')}
                            </CustomCel>
                            <CustomCel style={{ width: 150 }}>
                              <div style={styles.row}>
                                <div style={[ styles.row, styles.spacing ]}>
                                  <div style={styles.dollarSvg}><DollarSVG/></div>
                                  <div style={styles.affiliatePaddingRight}>{numberOfAffiliates}</div>
                                  <div style={styles.dollarSvg}><DollarSVG color='#aab5b8'/></div>
                                  <div>{numberOfNonAffiliates}</div>
                                </div>
                                <ToolTip
                                  arrowContent={<div className='rc-tooltip-arrow-inner' />}
                                  overlay={<div style={styles.tooltipOverlay}>
                                    {offerings}
                                  </div>}
                                  placement='top'>
                                  <div style={styles.questionSvg}><QuestionSVG color='#aab5b8' hoverColor='#6d8791'/></div>
                                </ToolTip>
                              </div>
                            </CustomCel>
                            <CustomCel getValue={this.getLastUpdatedOn} objectToRender={product} style={{ width: 150 }}/>
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
