import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { routerPushWithReturnTo } from '../../../actions/global';
import moment from 'moment';
import { Root, Container } from '../../_common/styles';
import { isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import ListView from '../../_common/components/listView/index';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import UtilsBar from '../../_common/components/table/utilsBar';
import { confirmation } from '../../_common/askConfirmation';
import { SideMenu } from '../../app/sideMenu';
import Header from '../../app/multiFunctionalHeader';

/* eslint-disable react/no-set-state*/

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteTvGuideEntries: bindActionCreators(actions.deleteTvGuideEntries, dispatch),
  deleteTvGuideEntry: bindActionCreators(actions.deleteTvGuideEntry, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch),
  selectEntity: bindActionCreators(actions.selectEntity, dispatch)
}))
@Radium
export default class TvGuideList extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteTvGuideEntries: PropTypes.func.isRequired,
    deleteTvGuideEntry: PropTypes.func.isRequired,
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
    tvGuideEntries: ImmutablePropTypes.map.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.onClickNewEntry = ::this.onClickNewEntry;
  }

  async componentWillMount () {
    await this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    await isQueryChanged(query, nextQuery) && this.props.load(nextProps.location.query);
  }

  getMediumTitle (tvGuideEntry) {
    // in case of a serie
    if (tvGuideEntry.get('medium') && tvGuideEntry.get('season') && tvGuideEntry.get('serie')) {
      const serie = tvGuideEntry.get('serie').get('title');
      const season = tvGuideEntry.get('season').get('title');
      const episode = tvGuideEntry.get('medium').get('title');
      return `${serie} - ${season} - ${episode}`;
    }
    // in case of a movie
    return tvGuideEntry.get('medium').get('title');
  }

  getStartDate (tvGuideEntry) {
    return moment(tvGuideEntry.get('start')).format('YYYY-MM-DD HH:mm');
  }

  getEndDate (tvGuideEntry) {
    return moment(tvGuideEntry.get('end')).format('YYYY-MM-DD HH:mm');
  }

  getChannelName (tvGuideEntry) {
    return tvGuideEntry.getIn([ 'channel', 'name' ]);
  }

  getUpdatedBy (tvGuideEntry) {
    return tvGuideEntry.get('lastUpdatedBy');
  }

  getLastUpdatedOn (tvGuideEntry) {
    return moment(tvGuideEntry.get('lastUpdatedOn')).format('YYYY-MM-DD HH:mm');
  }

  async deleteTvGuideEntry (tvGuideEntryId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteTvGuideEntry(tvGuideEntryId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (tvGuide) {
    return `/tvGuide/read/${tvGuide.get('id')}`;
  }

  determineEditUrl (tvGuide) {
    return `/tv-guide/edit/${tvGuide.get('id')}`;
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('tv-guide/create');
  }

  async onClickDeleteSelected () {
    const tvGuideEntryIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        tvGuideEntryIds.push(key);
      }
    });
    await this.props.deleteTvGuideEntries(tvGuideEntryIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { children, isSelected, deleteTvGuideEntry, location, location: { query: { page, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, tvGuideEntries } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', title: 'CHANNEL', name: 'channel', convert: (text) => text.get('name') },
      { type: 'custom', title: 'TITLE', colspan: 2, convert: this.getMediumTitle },
      { type: 'custom', sort: true, sortField: 'START', title: 'START', getUrl: this.determineReadUrl, convert: this.getStartDate },
      { type: 'custom', title: 'END', convert: this.getEndDate },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy', colspan: 0.8 },
      { type: 'custom', sort: true, sortField: 'LAST_MODIFIED', title: 'LAST UPDATED ON', convert: this.getLastUpdatedOn },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu location={location}>
        <Root>
          <Header hierarchy={[ { title: 'Tv-Guide', url: '/tv-guide' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                textCreateButton='New Tv Guide Entry'
                onClickNewEntry={this.onClickNewEntry}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='TV Guide'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              <ListView
                columns={columns}
                data={tvGuideEntries}
                deleteItem={deleteTvGuideEntry}
                getEditUrl={this.determineEditUrl}
                isSelected={isSelected}
                load={() => this.props.load(this.props.location.query)}
                routerPushWithReturnTo={this.props.routerPushWithReturnTo}
                selectAllCheckboxes={selectAllCheckboxes}
                sortDirection={sortDirection}
                sortField={sortField}
                onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                onSortField={(name) => this.props.onSortField.bind(this, name)} />
              <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
            </Container>
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
