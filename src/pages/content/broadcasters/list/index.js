import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Container, Root } from '../../../_common/styles';
import { DropdownCel, UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import * as actions from './actions';
import selector from './selector';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
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
    children: PropTypes.node,
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
    const result = await confirmation();
    if (result) {
      await this.props.deleteBroadcaster(broadcasterId);
      await this.props.load(this.props.location.query);
    }
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/broadcasters/create');
  }

  async onClickDeleteSelected () {
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
    const { broadcasters, children, isSelected, location: { query, query: { broadcastersDisplay, broadcastersPage,
      broadcastersSearchString, broadcastersSortField, broadcastersSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
    onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[ { title: 'Broadcasters', url: '/content/broadcasters' } ]}/>
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
                  onClickNewEntry={this.onClickNewEntry}/>
              </Container>
            </div>
            <Line/>
            <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
              <Container style={generalStyles.paddingTable}>
                <TotalEntries
                  entityType='Broadcasters'
                  numberSelected={numberSelected}
                  totalResultCount={totalResultCount}
                  onDeleteSelected={this.onClickDeleteSelected}/>
                {(broadcastersDisplay === undefined || broadcastersDisplay === 'list') &&
                  <div>
                    <Table>
                      <Headers>
                        {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                        <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                        <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {broadcastersSortField === 'NAME' ? sortDirections[broadcastersSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>NAME</CustomCel>
                        <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                      </Headers>
                      <Rows isLoading={broadcasters.get('_status') !== 'loaded'}>
                        {broadcasters.get('data').map((broadcaster, index) => {
                          return (
                            <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                              {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                              <CheckBoxCel checked={isSelected.get(broadcaster.get('id'))} onChange={selectCheckbox.bind(this, broadcaster.get('id'))}/>
                              <CustomCel style={{ flex: 5 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/broadcasters/read/${broadcaster.get('id')}`); }}>{broadcaster.get('name')}</CustomCel>
                              <DropdownCel>
                                <Dropdown
                                  elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/broadcasters/edit/${broadcaster.get('id')}`); }}>Edit</div>}>
                                  <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteBroadcaster(broadcaster.get('id')); }}>Remove</div>
                                </Dropdown>
                              </DropdownCel>
                            </Row>
                          );
                        })}
                      </Rows>
                    </Table>
                    <Pagination currentPage={(broadcastersPage && (parseInt(broadcastersPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(broadcastersPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(broadcastersPage, 10), true); }}/>
                  </div>
                }
                {broadcastersDisplay === 'grid' &&
                <div>
                  <div style={generalStyles.row}>
                    {broadcasters.get('data').map((broadcaster, index) => (
                      <Tile
                        checked={isSelected.get(broadcaster.get('id'))}
                        imageUrl={broadcaster.get('logo') && `${broadcaster.getIn([ 'logo', 'url' ])}?height=310&width=310`}
                        key={`broadcaster${index}`}
                        text={broadcaster.get('name')}
                        onCheckboxChange={selectCheckbox.bind(this, broadcaster.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/broadcasters/read/${broadcaster.get('id')}`); }}
                        onDelete={async (e) => {
                          e.preventDefault();
                          await this.deleteBroadcaster(broadcaster.get('id'));
                        }}
                        onEdit={(e) => {
                          e.preventDefault();
                          this.props.routerPushWithReturnTo(`/content/broadcasters/edit/${broadcaster.get('id')}`);
                        }}/>
                    ))}
                    <Tile key={'createBroadcaster'} onCreate={() => this.props.routerPushWithReturnTo('/content/broadcasters/create')}/>
                  </div>
                  <Pagination currentPage={(broadcastersPage && (parseInt(broadcastersPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(broadcastersPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(broadcastersPage, 10), true); }}/>
                </div>
                }
              </Container>
            </div>
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
