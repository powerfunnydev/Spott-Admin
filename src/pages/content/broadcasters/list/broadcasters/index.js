import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Container } from '../../../../_common/styles';
import { UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../_common/components/table/index';
import Line from '../../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../../../_common/components/dropdown';
import { slowdown } from '../../../../../utils';

/* eslint-disable no-alert */

const numberOfRows = 25;

export const prefix = 'broadcasters';

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteBroadcaster: bindActionCreators(actions.deleteBroadcaster, dispatch),
  deleteBroadcasters: bindActionCreators(actions.deleteBroadcasters, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Broadcasters extends Component {

  static propTypes = {
    broadcasters: ImmutablePropTypes.map.isRequired,
    deleteBroadcaster: PropTypes.func.isRequired,
    deleteBroadcasters: PropTypes.func.isRequired,
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
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    await this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query);
    }
  }

  async deleteBroadcaster (broadcasterId) {
    const result = window.confirm('Are you sure you want to trigger this action?');
    if (result) {
      await this.props.deleteBroadcaster(broadcasterId);
      await this.props.load(this.props.location.query);
    }
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
    const broadcasterIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        broadcasterIds.push(key);
      }
    });
    await this.props.deleteBroadcasters(broadcasterIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { broadcasters, isSelected, location: { query, query: { broadcastersDisplay, broadcastersPage,
      broadcastersSearchString, broadcastersSortField, broadcastersSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
    onChangeDisplay, onChangeSearchString } = this.props;
    console.log('broadcasters', broadcasters.toJS());
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.tableFillPage}>
        <div style={generalStyles.backgroundBar}>
          <Container >
            <UtilsBar
              display={broadcastersDisplay}
              isLoading={broadcasters.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={broadcastersSearchString}
              textCreateButton='New Broadcaster'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, broadcastersSearchString: value }); }}
              onClickDeleteSelected={this.onClickDeleteSelected}
              onClickNewEntry={this.onClickNewEntry}/>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
            {(broadcastersDisplay === undefined || broadcastersDisplay === 'list') &&
              <div>
                <Table>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {broadcastersSortField === 'NAME' ? sortDirections[broadcastersSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>NAME</CustomCel>
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
                              <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteBroadcaster(broadcaster.get('id')); }}>Remove</div>
                            </Dropdown>
                          </CustomCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination currentPage={(broadcastersPage && (parseInt(broadcastersPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(broadcastersPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(broadcastersPage, 10), true); }}/>
              </div>
            }
            {broadcastersDisplay === 'grid' &&
              <div style={generalStyles.row}>
                { broadcasters.get('data').map((broadcaster, index) => (
                  <Tile
                    imageUrl={broadcaster.getIn([ 'logo', 'url' ])}
                    key={`broadcaster${index}`}
                    text={broadcaster.get('name')}
                    onDelete={async (e) => { e.preventDefault(); await this.deleteBroadcaster(broadcaster.get('id')); }}
                    onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`content/broadcasters/edit/${broadcaster.get('id')}`); }}/>
                ))}
                <Tile key={'createBroadcaster'} onCreate={() => { this.props.routerPushWithReturnTo('content/broadcasters/create'); }}/>
              </div>
            }
          </Container>
        </div>
      </div>
    );
  }
}