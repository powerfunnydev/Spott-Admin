import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { routerPushWithReturnTo } from '../../../actions/global';
import moment from 'moment';
import Header from '../../app/header';
import { Root, Container } from '../../_common/styles';
import { DropdownCel, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../_common/components/actionDropdown';
import UtilsBar from '../../_common/components/table/utilsBar';
import { confirmation } from '../../_common/askConfirmation';

/* eslint-disable react/no-set-state*/

const numberOfRows = 25;

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

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('tv-guide/create');
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
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
    const { children, isSelected, location, location: { query: { page, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, tvGuideEntries } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <div style={generalStyles.backgroundBar}>
          <Container>
            <UtilsBar
              numberSelected={numberSelected}
              textCreateButton='New Tv Guide Entry'
              onClickDeleteSelected={this.onClickDeleteSelected}
              onClickNewEntry={this.onClickNewEntry}/>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
            <Table>
              <Headers>
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>Channel</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>Title</CustomCel>
                <CustomCel
                  sortColumn={this.props.onSortField.bind(this, 'START')}
                  sortDirection={sortField === 'START' ? sortDirections[sortDirection] : NONE}
                  style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 1 } ]}>
                  Start
                </CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>End</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 0.8 } ]}>Updated by</CustomCel>
                <CustomCel
                  sortColumn={this.props.onSortField.bind(this, 'LAST_MODIFIED')}
                  sortDirection={sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE}
                  style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 1 } ]}>
                  Last updated on
                </CustomCel>
                <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
              </Headers>
              <Rows isLoading={tvGuideEntries.get('_status') !== 'loaded'}>
                {tvGuideEntries.get('data').map((tvGuideEntry, index) => {
                  return (
                    <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get(tvGuideEntry.get('id'))} onChange={selectCheckbox.bind(this, tvGuideEntry.get('id'))}/>
                      <CustomCel getValue={this.getChannelName} objectToRender={tvGuideEntry} style={{ flex: 1 }} /* onClick={selectEntity.bind(this, tvGuideEntry.get('id'))} *//>
                      <CustomCel getValue={this.getMediumTitle} objectToRender={tvGuideEntry} style={{ flex: 2 }}/>
                      <CustomCel getValue={this.getStartDate} objectToRender={tvGuideEntry} style={{ flex: 1 }}/>
                      <CustomCel getValue={this.getEndDate} objectToRender={tvGuideEntry} style={{ flex: 1 }}/>
                      <CustomCel getValue={this.getUpdatedBy} objectToRender={tvGuideEntry} style={{ flex: 0.8 }}/>
                      <CustomCel getValue={this.getLastUpdatedOn} objectToRender={tvGuideEntry} style={{ flex: 1 }}/>
                      <DropdownCel>
                        <Dropdown
                          elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`tv-guide/edit/${tvGuideEntry.get('id')}`); }}>Edit</div>}>
                          <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteTvGuideEntry(tvGuideEntry.get('id')); }}>Remove</div>
                        </Dropdown>
                      </DropdownCel>
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
