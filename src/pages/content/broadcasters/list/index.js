import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push as routerPush } from 'react-router-redux';
import moment from 'moment';
import Header from '../../../app/header';
import { Root, Container, buttonStyles } from '../../../_common/styles';
import { generalStyles, TotalEntries, headerStyles, determineSortDirection, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table';
import SearchInput from '../../../_common/inputs/searchInput';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SpecificHeader from '../../header';
import PlusButton from '../../../_common/buttons/plusButton';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';

const numberOfRows = 25;

@connect(selector, (dispatch) => ({
  deleteBroadcastersEntry: bindActionCreators(actions.deleteBroadcastersEntry, dispatch),
  deleteBroadcastersEntries: bindActionCreators(actions.deleteBroadcastersEntries, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPush: bindActionCreators(routerPush, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Broadcasters extends Component {

  static propTypes = {
    broadcasters: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    deleteBroadcastersEntries: PropTypes.func.isRequired,
    deleteBroadcastersEntry: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    routerPush: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeSearchString = ::this.onChangeSearchString;
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
  }

  componentWillMount () {
    this.props.load(this.props.location.query);
  }

  componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (query.page !== nextQuery.page ||
      query.pageSize !== nextQuery.pageSize ||
      query.sortDirection !== nextQuery.sortDirection ||
      query.sortField !== nextQuery.sortField ||
      query.searchString !== nextQuery.searchString) {
      this.props.load(nextProps.location.query);
    }
  }

  async deleteBroadcastersEntry (broadcastersEntryId) {
    await this.props.deleteBroadcastersEntry(broadcastersEntryId);
    await this.props.load(this.props.location.query);
  }

  getName (broadcaster) {
    return broadcaster.get('name');
  }

  getUpdatedBy (broadcaster) {
    return broadcaster.get('lastUpdatedBy');
  }

  getLastUpdatedOn (broadcaster) {
    const date = new Date(broadcaster.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onSortField (sortField) {
    const query = {
      ...this.props.location.query,
      page: 0,
      sortField,
      sortDirection: determineSortDirection(sortField, this.props.location.query)
    };
    // props will be updated -> componentWillReceiveProps
    this.props.routerPush({
      ...this.props.location,
      query
    });
  }

  onChangeSearchString (e) {
    const query = {
      ...this.props.location.query,
      searchString: e.target.value
    };
    // props will be updated -> componentWillReceiveProps
    this.props.routerPush({
      ...this.props.location,
      query
    });
  }

  onChangePage (page = 0, next = true) {
    const nextPage = next ? page + 1 : page - 1;
    const query = {
      ...this.props.location.query,
      page: nextPage
    };
    // props will be updated -> componentWillReceiveProps
    this.props.routerPush({
      ...this.props.location,
      query
    });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPush({
      pathname: 'content/broadcasters/create',
      state: { returnTo: this.props.location }
    });
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const broadcastersEntryIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        broadcastersEntryIds.push(key);
      }
    });
    await this.props.deleteBroadcastersEntries(broadcastersEntryIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { broadcasters, children, isSelected, location: { pathname, query: { page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentPath={pathname} hideHomePageLinks />
        <SpecificHeader/>
        <div style={generalStyles.backgroundBar}>
          <Container style={generalStyles.searchContainer}>
            <SearchInput isLoading={broadcasters.get('_status') !== 'loaded'} value={searchString} onChange={this.onChangeSearchString}/>
            <div style={generalStyles.floatRight}>
              <button key='delete' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='button' onClick={this.onClickDeleteSelected}>Delete {numberSelected}</button>
              <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text='New Broadcaster' onClick={this.onClickNewEntry} />
            </div>
          </Container>
        </div>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
            <Table>
              <Headers>
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                <CustomCel sortColumn={this.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 5 } ]}>NAME</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}/>
              </Headers>
              <Rows isLoading={broadcasters.get('_status') !== 'loaded'}>
                {broadcasters.get('data').map((broadcaster, index) => {
                  return (
                    <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get(broadcaster.get('id'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, broadcaster.get('id'))}/>
                      <CustomCel getValue={this.getName} objectToRender={broadcaster} style={{ flex: 5 }} /* onClick={() => { this.props.routerPush(`content/broadcasters/read/${broadcaster.get('id')}`); }}*//>
                      <CustomCel style={{ flex: 1 }}>
                        <Dropdown
                          elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPush(`content/broadcasters/edit/${broadcaster.get('id')}`); }}>Edit</div>}>
                          <div key={1} style={[ dropdownStyles.option ]} onClick={(e) => { e.preventDefault(); this.deleteBroadcastersEntry(broadcaster.get('id')); }}>Remove</div>
                        </Dropdown>
                      </CustomCel>
                    </Row>
                  );
                })}
              </Rows>
            </Table>
            <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.onChangePage(parseInt(page, 10), true); }}/>
          </Container>
        </div>
        {children}
      </Root>
    );
  }
}
