import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../../actions/global';
import { DropdownCel, UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../_common/components/table/index';
import Dropdown, { styles as dropdownStyles } from '../../../../_common/components/actionDropdown';
import Line from '../../../../_common/components/line';
import { slowdown } from '../../../../../utils';
import { confirmation } from '../../../../_common/askConfirmation';

const numberOfRows = 25;
export const prefix = 'broadcasterChannels';
@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteBroadcastChannel: bindActionCreators(actions.deleteBroadcastChannel, dispatch),
  deleteBroadcastChannels: bindActionCreators(actions.deleteBroadcastChannels, dispatch),
  loadBroadcasterChannels: bindActionCreators(actions.loadBroadcasterChannels, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class List extends Component {

  static propTypes = {
    broadcasterChannels: ImmutablePropTypes.map.isRequired,
    deleteBroadcastChannel: PropTypes.func.isRequired,
    deleteBroadcastChannels: PropTypes.func.isRequired,
    error: PropTypes.any,
    isSelected: ImmutablePropTypes.map.isRequired,
    loadBroadcasterChannels: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
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
    this.redirect = ::this.redirect;
    this.onClickNewEntry = :: this.onClickNewEntry;
    this.slowSearch = slowdown(props.loadBroadcasterChannels, 300);
    this.onClickDeleteSelected = :: this.onClickDeleteSelected;
  }

  async componentWillMount () {
    const broadcasterId = this.props.params.broadcasterId;
    if (broadcasterId) {
      await this.props.loadBroadcasterChannels(this.props.location.query, broadcasterId);
    }
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query, this.props.params.broadcasterId);
    }
  }

  async deleteBroadcastChannel (broadcastChannelId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteBroadcastChannel(broadcastChannelId);
      await this.props.loadBroadcasterChannels(this.props.location.query, this.props.params.broadcasterId);
    }
  }

  getName (broadcaster) {
    return broadcaster.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/broadcasters', true);
  }

  async onClickDeleteSelected () {
    const broadcastChannelsIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        broadcastChannelsIds.push(key);
      }
    });
    await this.props.deleteBroadcastChannels(broadcastChannelsIds);
    await this.props.loadBroadcasterChannels(this.props.location.query, this.props.params.broadcasterId);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const broadcasterId = this.props.params.broadcasterId;
    if (broadcasterId) {
      this.props.routerPushWithReturnTo(`/content/broadcasters/read/${broadcasterId}/create/broadcast-channel`);
    }
  }

  render () {
    const { onChangeSearchString, onChangeDisplay, pageCount, selectAllCheckboxes, selectCheckbox, isSelected, totalResultCount, broadcasterChannels,
       location: { query: { broadcasterChannelsDisplay, broadcasterChannelsPage,
         broadcasterChannelsSearchString, broadcasterChannelsSortField, broadcasterChannelsSortDirection } } } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={broadcasterChannelsDisplay}
              isLoading={broadcasterChannels.get('_status') !== 'loaded'}
              searchString={broadcasterChannelsSearchString}
              textCreateButton='New Broadcast Channel'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage, generalStyles.whiteBackground ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              entityType='Broadcast Channels'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected}/>
            {(broadcasterChannelsDisplay === undefined || broadcasterChannelsDisplay === 'list') &&
              <div>
                <Table style={generalStyles.lightGrayBorder}>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {broadcasterChannelsSortField === 'NAME' ? sortDirections[broadcasterChannelsSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>NAME</CustomCel>
                    <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                  </Headers>
                  <Rows isLoading={broadcasterChannels.get('_status') !== 'loaded'}>
                    {broadcasterChannels.get('data').map((broadcastChannel, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(broadcastChannel.get('id'))} onChange={selectCheckbox.bind(this, broadcastChannel.get('id'))}/>
                          <CustomCel getValue={this.getName} objectToRender={broadcastChannel} style={{ flex: 5 }} />
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/broadcast-channels/edit/${broadcastChannel.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteBroadcastChannel(broadcastChannel.get('id')); }}>Remove</div>
                            </Dropdown>
                          </DropdownCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination currentPage={(broadcasterChannelsPage && (parseInt(broadcasterChannelsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(broadcasterChannelsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(broadcasterChannelsPage, 10), true); }}/>
              </div>
            }
            {broadcasterChannelsDisplay === 'grid' &&
              <div style={generalStyles.row}>
                { this.props.broadcasterChannels.get('data').map((broadcastChannel, index) => (
                  <Tile
                    imageUrl={broadcastChannel.get('logo') && `${broadcastChannel.getIn([ 'logo', 'url' ])}?height=310&width=310`}
                    key={`broadcastChannel${index}`}
                    text={broadcastChannel.get('name')}
                    onDelete={async (e) => {
                      e.preventDefault();
                      await this.deleteBroadcastChannel(broadcastChannel.get('id'));
                    }}
                    onEdit={(e) => {
                      e.preventDefault();
                      this.props.routerPushWithReturnTo(`/content/broadcast-channels/edit/${broadcastChannel.get('id')}`);
                    }}/>
                ))}
                <Tile key={'createBroadcastChannel'} onCreate={this.onClickNewEntry}/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}
