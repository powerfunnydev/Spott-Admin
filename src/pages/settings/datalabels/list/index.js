import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Container, Root } from '../../../_common/styles';
import { UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import * as actions from './actions';
import selector from './selector';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

export const prefix = 'datalabels';

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteDatalabel: bindActionCreators(actions.deleteDatalabel, dispatch),
  deleteDatalabels: bindActionCreators(actions.deleteDatalabels, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Datalabels extends Component {

  static propTypes = {
    children: PropTypes.node,
    datalabels: ImmutablePropTypes.map.isRequired,
    deleteDatalabel: PropTypes.func.isRequired,
    deleteDatalabels: PropTypes.func.isRequired,
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

  async deleteDatalabel (datalabelId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteDatalabel(datalabelId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (datalabel) {
    return `/settings/datalabels/read/${datalabel.get('id')}`;
  }

  determineEditUrl (datalabel) {
    return `/settings/datalabels/edit/${datalabel.get('id')}`;
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/settings/datalabels/create');
  }

  async onClickDeleteSelected () {
    const datalabelIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        datalabelIds.push(key);
      }
    });
    await this.props.deleteDatalabels(datalabelIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { datalabels, children, deleteDatalabel, isSelected, location: { query, query: { datalabelsDisplay, datalabelsPage,
      datalabelsSearchString, datalabelsSortField, datalabelsSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'NAME', title: 'NAME', clickable: true, getUrl: this.determineReadUrl, name: 'name' },
      { type: 'custom', title: 'CREATED BY', name: 'createdBy', colspan: 2 },
      { type: 'custom', title: 'CREATED ON', name: 'createdOn', dataType: 'date', colspan: 2 },
      { type: 'custom', title: 'TYPE', name: 'type', colspan: 2 },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[ { title: 'Labels', url: '/settings/datalabels' } ]}/>
          <div style={generalStyles.tableFillPage}>
            <div style={generalStyles.backgroundBar}>
              <Container >
                <UtilsBar
                  display={datalabelsDisplay}
                  isLoading={datalabels.get('_status') !== 'loaded'}
                  numberSelected={numberSelected}
                  searchString={datalabelsSearchString}
                  textCreateButton='New DataLabel'
                  onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, datalabelsSearchString: value }); }}
                  onClickNewEntry={this.onClickNewEntry}/>
              </Container>
            </div>
            <Line/>
            <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
              <Container style={generalStyles.paddingTable}>
                <TotalEntries
                  entityType='Datalabels'
                  numberSelected={numberSelected}
                  totalResultCount={totalResultCount}
                  onDeleteSelected={this.onClickDeleteSelected}/>
                {(datalabelsDisplay === undefined || datalabelsDisplay === 'list') &&
                  <div>
                    <ListView
                      columns={columns}
                      data={datalabels}
                      deleteItem={deleteDatalabel}
                      getEditUrl={this.determineEditUrl}
                      isSelected={isSelected}
                      load={() => this.props.load(this.props.location.query)}
                      selectAllCheckboxes={selectAllCheckboxes}
                      sortDirection={datalabelsSortDirection}
                      sortField={datalabelsSortField}
                      onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                      onSortField={(name) => this.props.onSortField.bind(this, name)} />
                    <Pagination currentPage={(datalabelsPage && (parseInt(datalabelsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(datalabelsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(datalabelsPage, 10), true); }}/>
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
