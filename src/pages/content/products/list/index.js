import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { initialize, Field } from 'redux-form/immutable';
import { colors, filterStyles, Root, Container } from '../../../_common/styles';
import { CheckBoxCel, generalStyles, getInformationFromQuery, isQueryChanged, tableDecorator, Tile, UtilsBar, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import { FilterContent } from '../../../_common/components/filterDropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import publishStatusTypes from '../../../../constants/publishStatusTypes';
import SelectionDropdown from '../../../_common/components/selectionDropdown';
import Checkbox from '../../../_common/inputs/checkbox';
import ToolTip from '../../../_common/components/toolTip';
import QuestionSVG from '../../../_common/images/question';
import DollarSVG from '../../../_common/images/dollar';
import { slowdown } from '../../../../utils';
import * as actions from './actions';
import selector from './selector';

export const prefix = 'products';
export const filterArray = [ 'affiliate', 'publishStatus', 'used' ];

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
    currencies: ImmutablePropTypes.map.isRequired,
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

  componentWillReceiveProps (nextProps) {
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

  determineReadUrl (product) {
    return `/content/products/read/${product.get('id')}`;
  }

  determineEditUrl (product) {
    return `/content/products/edit/${product.get('id')}`;
  }

  getLastUpdatedOn (product) {
    const date = new Date(product.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  getAvailable (product) {
    return <CheckBoxCel checked={!product.get('noLongerAvailable')}/>;
  }

  getNameItem (product) {
    const styles = {
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
    };
    return (
      <div style={{ alignItems: 'center', display: 'inline-flex' }}>
        {product.get('logo') && <div style={styles.logoContainer}>
          <ToolTip
            overlay={<img src={`${product.getIn([ 'logo', 'url' ])}?height=150&width=150`}/>}
            placement='top'
            prefixCls='no-arrow'>
            <img src={`${product.getIn([ 'logo', 'url' ])}?height=150&width=150`} style={styles.logo} />
          </ToolTip>
        </div> || <div style={styles.logoPlaceholder}/>} {product.get('shortName')}
      </div>
    );
  }

  getofferings (product) {
    const styles = {
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
      }
    };

    const { currencies } = this.props;
    const offeringsArray = product.get('offerings') && product.get('offerings').toArray() || [];
    const numberOfAffiliates = offeringsArray.reduce((total, offer, key) => offer.get('affiliateCode') ? total + 1 : total, 0);
    const numberOfNonAffiliates = offeringsArray.length - numberOfAffiliates;
    const offerings = offeringsArray.map((offering, i) => {
      return (
        <div key={`product_offering${i}`} style={[ styles.offeringContainer, ((i + 1) !== offeringsArray.length) && styles.offeringPaddingRight ]}>
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
      <div style={styles.row}>
        <div style={[ styles.row, styles.spacing ]}>
          <div style={styles.dollarSvg}><DollarSVG/></div>
          <div style={styles.affiliatePaddingRight}>{numberOfAffiliates}</div>
          <div style={styles.dollarSvg}><DollarSVG color={colors.lightGray3}/></div>
          <div>{numberOfNonAffiliates}</div>
        </div>
        <ToolTip
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          overlay={<div style={styles.tooltipOverlay}>
            {offerings}
          </div>}
          placement='top'>
          <div style={styles.questionSvg}><QuestionSVG color={colors.lightGray3} hoverColor={colors.darkGray2}/></div>
        </ToolTip>
      </div>
    );
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

  static styles ={

  }

  render () {
    const {
      products, children, deleteProduct, isSelected, location: { query, query: { productsDisplay, productsPage, productsSearchString, productsSortField, productsSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeFilter, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'FULL_NAME', title: 'FULL NAME', clickable: true, getUrl: this.determineReadUrl, convert: this.getNameItem, colspan: 2 },
      { type: 'custom', title: 'BRAND', name: 'brand', convert: (text) => text.get('name') },
      { type: 'custom', title: 'OFFERINGS', convert: (product) => this.getofferings(product) },
      { type: 'custom', title: 'PUBLISH STATUS', name: 'publishStatus' },
      { type: 'custom', title: 'AVAILABLE', convert: this.getAvailable },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
        <Header hierarchy={[
          { title: 'Products', url: '/content/products' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={productsDisplay}
                filterContent={
                  <FilterContent
                    form='productList'
                    initialValues={{ publishStatus: null }}
                    style={filterStyles.filterContent}
                    onApplyFilter={onChangeFilter}>
                    <div style={[ filterStyles.row, filterStyles.firstRow ]}>
                      <div style={filterStyles.title}>Publish Status</div>
                      <Field
                        component={SelectionDropdown}
                        getItemText={(key) => publishStatusTypes[key]}
                        name='publishStatus'
                        options={Object.keys(publishStatusTypes)}
                        placeholder='Publish Status'
                        style={filterStyles.fullWidth}/>
                    </div>
                    <div style={filterStyles.row}>
                      <div style={filterStyles.title}>Used</div>
                      <Field
                        component={Checkbox}
                        first
                        name='used'/>
                    </div>
                    <div style={filterStyles.row}>
                      <div style={filterStyles.title}>Affiliate</div>
                      <Field
                        component={Checkbox}
                        first
                        name='affiliate'/>
                    </div>
                  </FilterContent>
                }
                isLoading={products.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={productsSearchString}
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
              {(!productsDisplay || productsDisplay === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={products}
                    deleteItem={deleteProduct}
                    getEditUrl={this.determineEditUrl}
                    isSelected={isSelected}
                    load={() => this.props.load(this.props.location.query)}
                    selectAllCheckboxes={selectAllCheckboxes}
                    sortDirection={productsSortDirection}
                    sortField={productsSortField}
                    onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                    onSortField={(name) => this.props.onSortField.bind(this, name)} />
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
                        onDelete={async (e) => { e.preventDefault(); await this.deleteProduct(product.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/products/edit/${product.get('id')}`); }}/>
                    ))}
                    <Tile key='createProduct' onCreate={() => { this.props.routerPushWithReturnTo('/content/products/create'); }}/>
                  </div>
                  <Pagination currentPage={(productsPage && (parseInt(productsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(productsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(productsPage, 10), true); }}/>
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
