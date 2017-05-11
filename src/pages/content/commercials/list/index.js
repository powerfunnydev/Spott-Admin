import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initialize, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { filterStyles, Root, Container } from '../../../_common/styles';
import { Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import ListView from '../../../_common/components/listView/index';
import { FilterContent } from '../../../_common/components/filterDropdown';
import Line from '../../../_common/components/line';
import TextInput from '../../../_common/inputs/textInput';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import * as actions from './actions';
import selector from './selector';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

export const filterArray = [ 'brand' ];
@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteCommercial: bindActionCreators(actions.deleteCommercial, dispatch),
  deleteCommercials: bindActionCreators(actions.deleteCommercials, dispatch),
  initializeForm: bindActionCreators(initialize, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Commercials extends Component {

  static propTypes = {
    children: PropTypes.node,
    commercials: ImmutablePropTypes.map.isRequired,
    deleteCommercial: PropTypes.func.isRequired,
    deleteCommercials: PropTypes.func.isRequired,
    getFilterObjectFromQuery: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
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
    onChangeFilter: PropTypes.func.isRequired,
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
    const { getFilterObjectFromQuery, initializeForm, load } = this.props;
    await load(this.props.location.query);
    initializeForm('commercialList', getFilterObjectFromQuery(filterArray));
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, null, filterArray)) {
      this.slowSearch(nextQuery);
    }
  }

  async deleteCommercial (commercialId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteCommercial(commercialId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (commercial) {
    return `/content/commercials/read/${commercial.get('id')}`;
  }

  determineEditUrl (commercial) {
    return `/content/commercials/edit/${commercial.get('id')}`;
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/commercials/create');
  }

  async onClickDeleteSelected () {
    const commercialIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        commercialIds.push(key);
      }
    });
    await this.props.deleteCommercials(commercialIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { commercials, children, deleteCommercial, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeFilter, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'TITLE', title: 'TITLE', clickable: true, getUrl: this.determineReadUrl, name: 'title' },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy' },
      { type: 'custom', title: 'LAST UPDATED ON', name: 'lastUpdatedOn', dataType: 'date' },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Commercials', url: '/content/commercials' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                filterContent={
                  <FilterContent
                    form='commercialList'
                    initialValues={{ brand: '' }}
                    style={filterStyles.filterContent}
                    onApplyFilter={onChangeFilter}>
                    <div style={[ filterStyles.row, filterStyles.firstRow ]}>
                      <div style={filterStyles.title}>Brand</div>
                      <Field
                        component={TextInput}
                        first
                        name='brand'
                        style={filterStyles.fullWidth}/>
                    </div>
                  </FilterContent>
                }
                isLoading={commercials.get('_status') !== 'loaded'}
                searchString={searchString}
                textCreateButton='New Commercial'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onClickNewEntry}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Commercials'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(!display || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={commercials}
                    deleteItem={deleteCommercial}
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
                    {commercials.get('data').map((commercial, index) => (
                      <Tile
                        checked={isSelected.get(commercial.get('id'))}
                        imageUrl={commercial.get('profileImage') && `${commercial.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                        key={`commercial${index}`}
                        text={commercial.get('title')}
                        onCheckboxChange={selectCheckbox.bind(this, commercial.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/commercials/read/${commercial.get('id')}`); }}
                        onDelete={async (e) => { e.preventDefault(); await this.deleteCommercial(commercial.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/commercials/edit/${commercial.get('id')}`); }}/>
                    ))}
                    <Tile key='createCommercial' onCreate={() => { this.props.routerPushWithReturnTo('/content/commercials/create'); }}/>
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
