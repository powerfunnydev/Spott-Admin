import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Container, Root } from '../../../_common/styles';
import { UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import * as actions from './actions';
import selector from './selector';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

export const prefix = 'datalabeltypes';

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteDatalabeltype: bindActionCreators(actions.deleteDatalabeltype, dispatch),
  deleteDatalabeltypes: bindActionCreators(actions.deleteDatalabeltypes, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Broadcasters extends Component {

  static propTypes = {
    broadcasters: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    deleteDatalabeltype: PropTypes.func.isRequired,
    deleteDatalabeltypes: PropTypes.func.isRequired,
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

  async deleteDatalabeltype (datalabeltypeId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteDatalabeltype(datalabeltypeId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (datalabeltype) {
    return `/settings/datalabeltypes/read/${datalabeltype.get('id')}`;
  }

  determineEditUrl (datalabeltype) {
    return `/settings/datalabeltypes/edit/${datalabeltype.get('id')}`;
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/settings/datalabeltypes/create');
  }

  async onClickDeleteSelected () {
    const datalabeltypeIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        datalabeltypeIds.push(key);
      }
    });
    await this.props.deleteDatalabeltypes(datalabeltypeIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { broadcasters, children, deleteDatalabeltype, isSelected, location: { query, query: { broadcastersDisplay, broadcastersPage,
      broadcastersSearchString, broadcastersSortField, broadcastersSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
    onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'NAME', title: 'NAME', clickable: true, getUrl: this.determineReadUrl, name: 'name' },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[ { title: 'DataLabelTypes', url: '/settings/datalabeltypes' } ]}/>
          <div style={generalStyles.tableFillPage}>
            <div style={generalStyles.backgroundBar}>
              <Container >
                <UtilsBar
                  display={broadcastersDisplay}
                  isLoading={broadcasters.get('_status') !== 'loaded'}
                  numberSelected={numberSelected}
                  searchString={broadcastersSearchString}
                  textCreateButton='New DataLabelType'
                  onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, broadcastersSearchString: value }); }}
                  onClickNewEntry={this.onClickNewEntry}/>
              </Container>
            </div>
            <Line/>
            <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
              <Container style={generalStyles.paddingTable}>
                <TotalEntries
                  entityType='Datalabeltypes'
                  numberSelected={numberSelected}
                  totalResultCount={totalResultCount}
                  onDeleteSelected={this.onClickDeleteSelected}/>
                {(broadcastersDisplay === undefined || broadcastersDisplay === 'list') &&
                  <div>
                    <ListView
                      columns={columns}
                      data={broadcasters}
                      deleteItem={deleteDatalabeltype}
                      getEditUrl={this.determineEditUrl}
                      isSelected={isSelected}
                      load={() => this.props.load(this.props.location.query)}
                      selectAllCheckboxes={selectAllCheckboxes}
                      sortDirection={broadcastersSortDirection}
                      sortField={broadcastersSortField}
                      onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                      onSortField={(name) => this.props.onSortField.bind(this, name)} />
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
