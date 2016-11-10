import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../../actions/global';
import { UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../_common/components/table/index';
import Dropdown, { styles as dropdownStyles } from '../../../../_common/components/dropdown';
import Line from '../../../../_common/components/line';
import { slowdown } from '../../../../../utils';

/* eslint-disable no-alert */

const numberOfRows = 25;
export const prefix = 'broadcasterChannels';
@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteBroadcastChannel: bindActionCreators(actions.deleteBroadcastChannel, dispatch),
  loadBroadcasterChannels: bindActionCreators(actions.loadBroadcasterChannels, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class List extends Component {

  static propTypes = {
    broadcastChannels: ImmutablePropTypes.map.isRequired,
    deleteBroadcastChannel: PropTypes.func.isRequired,
    error: PropTypes.any,
    isSelected: ImmutablePropTypes.map.isRequired,
    loadBroadcasterChannels: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    numberSelected: PropTypes.number,
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
  }

  async componentWillMount () {
    if (this.props.params.id) {
      await this.props.loadBroadcasterChannels(this.props.location.query, this.props.params.id);
    }
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    console.log('query changed', isQueryChanged(query, nextQuery));
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query, this.props.params.id);
    }
  }

  async deleteBroadcastChannel (broadcastChannelId) {
    const result = window.confirm('Are you sure you want to trigger this action?');
    if (result) {
      await this.props.deleteBroadcastChannel(broadcastChannelId);
      await this.props.loadBroadcasterChannels(this.props.location.query, this.props.params.id);
    }
  }

  getName (broadcaster) {
    return broadcaster.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/broadcasters', true);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const broadcasterId = this.props.params.id;
    if (broadcasterId) {
      this.props.routerPushWithReturnTo(`content/broadcasters/read/${broadcasterId}/create/broadcast-channel`);
    }
  }

  render () {
    const { onChangeSearchString, onChangeDisplay, numberSelected, pageCount, selectAllCheckboxes, selectCheckbox, isSelected, totalResultCount, broadcastChannels,
       location: { query: { broadcastChannelsDisplay, broadcastChannelsPage,
         broadcasterChannelsSearchString, broadcastChannelsSortField, broadcastChannelsSortDirection } } } = this.props;
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={broadcastChannelsDisplay}
              isLoading={broadcastChannels.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={broadcasterChannelsSearchString}
              textCreateButton='New Broadcast Channel'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries totalResultCount={totalResultCount}/>
            {(broadcastChannelsDisplay === undefined || broadcastChannelsDisplay === 'list') &&
              <div>
                <Table>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {broadcastChannelsSortField === 'NAME' ? sortDirections[broadcastChannelsSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>NAME</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}/>
                  </Headers>
                  <Rows isLoading={broadcastChannels.get('_status') !== 'loaded'}>
                    {broadcastChannels.get('data').map((broadcastChannel, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(broadcastChannel.get('id'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, broadcastChannel.get('id'))}/>
                          <CustomCel getValue={this.getName} objectToRender={broadcastChannel} style={{ flex: 5 }} />
                          <CustomCel style={{ flex: 1 }}>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`content/broadcast-channels/edit/${broadcastChannel.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteBroadcastChannel(broadcastChannel.get('id')); }}>Remove</div>
                            </Dropdown>
                          </CustomCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination currentPage={(broadcastChannelsPage && (parseInt(broadcastChannelsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(broadcastChannelsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(broadcastChannelsPage, 10), true); }}/>
              </div>
            }
            {broadcastChannelsDisplay === 'grid' &&
              <div style={generalStyles.row}>
                { this.props.broadcastChannels.get('data').map((broadcastChannel, index) => (
                  <Tile
                    imageUrl={broadcastChannel.getIn([ 'logo', 'url' ])}
                    key={`broadcastChannel${index}`}
                    text={broadcastChannel.get('name')}
                    onDelete={async (e) => { e.preventDefault(); await this.deleteBroadcastChannel(broadcastChannel.get('id')); }}
                    onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`content/broadcast-channels/edit/${broadcastChannel.get('id')}`); }}/>
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
