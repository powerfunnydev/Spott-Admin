import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import Header from '../../../app/header';
import { Root, Container } from '../../../_common/styles';
import localized from '../../../_common/localized';
import * as actions from './actions';
import SpecificHeader from '../../header';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import BreadCrumbs from '../../../_common/breadCrumbs';
import { UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
import Line from '../../../_common/components/line';

const numberOfRows = 25;

@tableDecorator
@localized
@connect(selector, (dispatch) => ({
  deleteBroadcastersEntry: bindActionCreators(listActions.deleteBroadcastersEntry, dispatch),
  loadBroadcaster: bindActionCreators(actions.loadBroadcaster, dispatch),
  loadBroadcasterChannels: bindActionCreators(actions.loadBroadcasterChannels, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class ReadBroadcastersEntry extends Component {

  static propTypes = {
    broadcastChannels: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    currentBroadcaster: PropTypes.object.isRequired,
    deleteBroadcastersEntry: PropTypes.func.isRequired,
    error: PropTypes.any,
    isSelected: ImmutablePropTypes.map.isRequired,
    loadBroadcaster: PropTypes.func.isRequired,
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
    t: PropTypes.func.isRequired,
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
  }

  async componentWillMount () {
    if (this.props.params.id) {
      await this.props.loadBroadcaster(this.props.params.id);
      await this.props.loadBroadcasterChannels({ ...this.props.location.query, broadcastersEntryId: this.props.params.id });
    }
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    await isQueryChanged(query, nextQuery) && this.props.loadBroadcasterChannels({ ...nextProps.location.query, broadcastersEntryId: this.props.params.id });
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
    const { onChangeSearchString, onChangeDisplay, numberSelected, pageCount, selectAllCheckboxes, selectCheckbox, isSelected, totalResultCount, children, broadcastChannels, currentBroadcaster,
       location, location: { query: { display, page, searchString, sortField, sortDirection } }, deleteBroadcastersEntry } = this.props;
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[ { title: 'List', url: '/content/broadcasters' }, { title: currentBroadcaster.get('name'), url: location.pathname } ]}/>
        <Container>
          {currentBroadcaster.get('_status') === 'loaded' && currentBroadcaster &&
            <EntityDetails image={currentBroadcaster.get('logo') && currentBroadcaster.getIn([ 'logo', 'url' ])} title={currentBroadcaster.getIn([ 'name' ])}
              onEdit={() => { this.props.routerPushWithReturnTo(`content/broadcasters/edit/${currentBroadcaster.getIn([ 'id' ])}`); }}
              onRemove={async () => { await deleteBroadcastersEntry(currentBroadcaster.getIn([ 'id' ])); this.redirect(); }}/>}
        </Container>
        <Line/>
        <div style={generalStyles.backgroundBar}>
          <Container >
            <UtilsBar
              display={display}
              isLoading={broadcastChannels.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={searchString}
              textCreateButton='New Broadcast Channel'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
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
                              <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteBroadcastChannelEntry(broadcastChannel.get('id')); }}>Remove</div>
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
                <Tile key={'createBroadcastChannel'} onCreate={this.onClickNewEntry}/>
              </div>
            }
          </Container>
        </div>
        {children}
      </Root>
    );
  }

}
