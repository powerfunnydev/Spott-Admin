import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Root, Container } from '../../../_common/styles';
import { Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import ToolTip from '../../../_common/components/toolTip';

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteBrand: bindActionCreators(actions.deleteBrand, dispatch),
  deleteBrands: bindActionCreators(actions.deleteBrands, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Brands extends Component {

  static propTypes = {
    brands: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    deleteBrand: PropTypes.func.isRequired,
    deleteBrands: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
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
    this.onCreateBrand = ::this.onCreateBrand;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  componentWillMount () {
    this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery)) {
      this.slowSearch(nextQuery);
    }
  }

  async deleteBrand (brandsId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteBrand(brandsId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (brand) {
    return `/content/brands/read/${brand.get('id')}`;
  }

  determineEditUrl (brand) {
    return `/content/brands/edit/${brand.get('id')}`;
  }

  getNameItem (brand) {
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
        {brand.get('logo') && <div style={styles.logoContainer}>
        <ToolTip
          overlay={<img src={`${brand.getIn([ 'logo', 'url' ])}?height=150&width=150`}/>}
          placement='top'
          prefixCls='no-arrow'>
          <img src={`${brand.getIn([ 'logo', 'url' ])}?height=150&width=150`} style={styles.logo} />
        </ToolTip>
        </div> || <div style={styles.logoPlaceholder}/>}{brand.get('name')}
      </div>
    );
  }

  getLastUpdatedOn (brand) {
    const date = new Date(brand.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onCreateBrand (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/brands/create');
  }

  async onClickDeleteSelected () {
    const brandIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        brandIds.push(key);
      }
    });
    await this.props.deleteBrands(brandIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { brands, children, deleteBrand, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'NAME', title: 'NAME', clickable: true, getUrl: this.determineReadUrl, convert: this.getNameItem },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy' },
      { type: 'custom', sort: true, sortField: 'LAST_MODIFIED', title: 'LAST UPDATED ON', convert: this.getLastUpdatedOn },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy= {[ { title: 'Brands', url: '/content/brands' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                isLoading={brands.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Brand'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onCreateBrand}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Brands'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={brands}
                    deleteItem={deleteBrand}
                    getEditUrl={this.determineEditUrl}
                    isSelected={isSelected}
                    load={() => this.props.load(this.props.location.query)}
                    selectAllCheckboxes={selectAllCheckboxes}
                    sortDirection={sortDirection}
                    sortField={sortField}
                    onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                    onSortField={(name) => this.props.onSortField.bind(this, name)} />
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
              {display === 'grid' &&
                <div>
                  <div style={generalStyles.row}>
                    {brands.get('data').map((brand, index) => (
                      <Tile
                        checked={isSelected.get(brand.get('id'))}
                        imageUrl={brand.get('logo') && `${brand.getIn([ 'logo', 'url' ])}?height=203&width=360`}
                        key={`brand${index}`}
                        text={brand.get('name')}
                        onCheckboxChange={selectCheckbox.bind(this, brand.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/brands/read/${brand.get('id')}`); }}
                        onDelete={async (e) => { e.preventDefault(); await this.deleteBrand(brand.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/brands/edit/${brand.get('id')}`); }}/>
                    ))}
                    <Tile key={'createBrand'} onCreate={() => { this.props.routerPushWithReturnTo('/content/brands/create'); }}/>
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
