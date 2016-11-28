import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Header from '../../../app/header';
import { Root, Container } from '../../../_common/styles';
import { DropdownCel, Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SpecificHeader from '../../header';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';

const numberOfRows = 25;

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteSeriesEntry: bindActionCreators(actions.deleteSeriesEntry, dispatch),
  deleteSeriesEntries: bindActionCreators(actions.deleteSeriesEntries, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class SeriesEntries extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteSeriesEntries: PropTypes.func.isRequired,
    deleteSeriesEntry: PropTypes.func.isRequired,
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
    seriesEntries: ImmutablePropTypes.map.isRequired,
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
    if (isQueryChanged(query, nextQuery)) {
      this.slowSearch(nextQuery);
    }
  }

  async deleteSeriesEntry (seriesEntrysId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteSeriesEntry(seriesEntrysId);
      await this.props.load(this.props.location.query);
    }
  }

  getTitle (seriesEntry) {
    return seriesEntry.get('title');
  }

  getUpdatedBy (seriesEntry) {
    return seriesEntry.get('lastUpdatedBy');
  }

  getLastUpdatedOn (seriesEntry) {
    const date = new Date(seriesEntry.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('content/series/create');
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const seriesEntryIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        seriesEntryIds.push(key);
      }
    });
    await this.props.deleteSeriesEntries(seriesEntryIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { seriesEntries, children, isSelected, location, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <div style={generalStyles.backgroundBar}>
          <Container>
            <UtilsBar
              display={display}
              isLoading={seriesEntries.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={searchString}
              textCreateButton='New Series Entry'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
              onClickDeleteSelected={this.onClickDeleteSelected}
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
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'TITLE')} sortDirection = {sortField === 'TITLE' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>TITLE</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                    <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                  </Headers>
                  <Rows isLoading={seriesEntries.get('_status') !== 'loaded'}>
                    {seriesEntries.get('data').map((seriesEntry, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(seriesEntry.get('id'))} onChange={selectCheckbox.bind(this, seriesEntry.get('id'))}/>
                          <CustomCel getValue={this.getTitle} objectToRender={seriesEntry} style={{ flex: 2 }} onClick={() => { this.props.routerPushWithReturnTo(`content/series/read/${seriesEntry.get('id')}`); }}/>
                          <CustomCel getValue={this.getUpdatedBy} objectToRender={seriesEntry} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getLastUpdatedOn} objectToRender={seriesEntry} style={{ flex: 2 }}/>
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`content/series/edit/${seriesEntry.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteSeriesEntry(seriesEntry.get('id')); }}>Remove</div>
                            </Dropdown>
                          </DropdownCel>
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
                { seriesEntries.get('data').map((seriesEntry, index) => (
                  <Tile
                    imageUrl={seriesEntry.get('profileImage') && `${seriesEntry.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                    key={`seriesEntry${index}`}
                    text={this.getTitle(seriesEntry)}
                    onDelete={async (e) => { e.preventDefault(); await this.deleteSeriesEntry(seriesEntry.get('id')); }}
                    onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`content/series/edit/${seriesEntry.get('id')}`); }}/>
                ))}
                <Tile key={'createSeriesEntry'} onCreate={() => { this.props.routerPushWithReturnTo('content/series/create'); }}/>
              </div>
            }
          </Container>
        </div>
        {children}
      </Root>

    );
  }

}
