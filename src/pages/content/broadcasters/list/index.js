import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Header from '../../../app/header';
import { Root, Container, buttonStyles } from '../../../_common/styles';
import { tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table';
import Line from '../../../_common/components/line';
import SearchInput from '../../../_common/inputs/searchInput';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SpecificHeader from '../../header';
import Button from '../../../_common/buttons/button';
import PlusButton from '../../../_common/buttons/plusButton';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';

const numberOfRows = 25;

@tableDecorator
@connect(selector, (dispatch) => ({
  deleteBroadcastersEntry: bindActionCreators(actions.deleteBroadcastersEntry, dispatch),
  deleteBroadcastersEntries: bindActionCreators(actions.deleteBroadcastersEntries, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
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
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
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

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('content/broadcasters/create');
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
    const { broadcasters, children, isSelected, location, location: { query: { page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <div style={generalStyles.backgroundBar}>
          <Container style={generalStyles.searchContainer}>
            <SearchInput isLoading={broadcasters.get('_status') !== 'loaded'} value={searchString} onChange={this.props.onChangeSearchString}/>
            <div style={generalStyles.floatRight}>
              <Button key='delete' style={[ buttonStyles.blue ]} text={`Delete ${numberSelected}`} onClick={this.onClickDeleteSelected}/>
              <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text='New Broadcaster' onClick={this.onClickNewEntry} />
            </div>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
            <Table>
              <Headers>
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>NAME</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}/>
              </Headers>
              <Rows isLoading={broadcasters.get('_status') !== 'loaded'}>
                {broadcasters.get('data').map((broadcaster, index) => {
                  return (
                    <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get(broadcaster.get('id'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, broadcaster.get('id'))}/>
                      <CustomCel getValue={this.getName} objectToRender={broadcaster} style={{ flex: 5 }} onClick={() => { this.props.routerPushWithReturnTo(`content/broadcasters/read/${broadcaster.get('id')}`); }}/>
                      <CustomCel style={{ flex: 1 }}>
                        <Dropdown
                          elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`content/broadcasters/edit/${broadcaster.get('id')}`); }}>Edit</div>}>
                          <div key={1} style={[ dropdownStyles.option ]} onClick={(e) => { e.preventDefault(); this.deleteBroadcastersEntry(broadcaster.get('id')); }}>Remove</div>
                        </Dropdown>
                      </CustomCel>
                    </Row>
                  );
                })}
              </Rows>
            </Table>
            <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
          </Container>
        </div>
        {children}
      </Root>
    );
  }
}