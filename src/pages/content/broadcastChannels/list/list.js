import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Container } from '../../../_common/styles';
import { isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import UtilsBar from '../../../_common/components/table/utilsBar';
import { slowdown } from '../../../../utils';

/* eslint-disable no-alert */

const numberOfRows = 25;

@tableDecorator
@connect(selector, (dispatch) => ({
  deleteBroadcastChannel: bindActionCreators(actions.deleteBroadcastChannel, dispatch),
  deleteBroadcastChannels: bindActionCreators(actions.deleteBroadcastChannels, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class BroadcastChannelList extends Component {

  static propTypes = {
    broadcastChannels: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    deleteBroadcastChannel: PropTypes.func.isRequired,
    deleteBroadcastChannels: PropTypes.func.isRequired,
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
    this.onClickNew = ::this.onClickNew;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    await this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery)) {
      await this.slowSearch(nextProps.location.query);
    }
  }

  async deleteBroadcastChannel (broadcastChannelsId) {
    const result = window.confirm('Are you sure you want to trigger this action?');
    if (result) {
      await this.props.deleteBroadcastChannel(broadcastChannelsId);
      await this.props.load(this.props.location.query);
    }
  }

  getName (broadcastChannel) {
    return broadcastChannel.get('name');
  }

  onClickNew (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('content/broadcast-channels/create');
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const broadcastChannelsIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        broadcastChannelsIds.push(key);
      }
    });
    await this.props.deleteBroadcastChannels(broadcastChannelsIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { broadcastChannels, children, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
      onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div>
        <div style={generalStyles.backgroundBar}>
          <Container>
            <UtilsBar
              display={display}
              isLoading={broadcastChannels.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={searchString}
              textCreateButton='New Broadcast Channel'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
              onClickDeleteSelected={this.onClickDeleteSelected}
              onClickNew={this.onClickNew}/>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
            {(display === undefined || display === 'list') &&
              <div>
                <Table>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>NAME</CustomCel>
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
                <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
              </div>
            }
            {display === 'grid' &&
              <div style={generalStyles.row}>
                { this.props.broadcastChannels.get('data').map((broadcastChannel, index) => (
                  <Tile imageUrl={broadcastChannel.getIn([ 'logo', 'url' ])} key={`broadcastChannel${index}`} text={broadcastChannel.get('name')} onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`content/broadcast-channels/edit/${broadcastChannel.get('id')}`); }}/>
                ))}
                <Tile key={'createBroadcastChannel'} onCreate={() => { this.props.routerPushWithReturnTo('content/broadcast-channels/create'); }}/>
              </div>
            }
          </Container>
        </div>
        {children}
      </div>
    );
  }
}
