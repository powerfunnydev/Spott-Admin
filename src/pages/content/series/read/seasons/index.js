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
import moment from 'moment';

const numberOfRows = 25;
export const prefix = 'seasons';
@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteSeason: bindActionCreators(actions.deleteSeason, dispatch),
  deleteSeasons: bindActionCreators(actions.deleteSeasons, dispatch),
  loadSeasons: bindActionCreators(actions.loadSeasons, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class List extends Component {

  static propTypes = {
    deleteSeason: PropTypes.func.isRequired,
    deleteSeasons: PropTypes.func.isRequired,
    error: PropTypes.any,
    isSelected: ImmutablePropTypes.map.isRequired,
    loadSeasons: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    numberSelected: PropTypes.number,
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    seasons: ImmutablePropTypes.map.isRequired,
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
    this.onCreateSeason = :: this.onCreateSeason;
    this.onCreateEpisode = :: this.onCreateEpisode;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.loadSeasons, 300);
  }

  async componentWillMount () {
    if (this.props.params.seriesEntryId) {
      await this.props.loadSeasons(this.props.location.query, this.props.params.seriesEntryId);
    }
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query, this.props.params.seriesEntryId);
    }
  }

  async deleteSeason (seasonId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteSeason(seasonId);
      await this.props.loadSeasons(this.props.location.query, this.props.params.seriesEntryId);
    }
  }

  getLastUpdatedOn (seriesEntry) {
    const date = new Date(seriesEntry.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/seasons', true);
  }

  onCreateEpisode (e) {
    e.preventDefault();
    const seriesEntryId = this.props.params.seriesEntryId;
    if (seriesEntryId) {
      this.props.routerPushWithReturnTo(`/content/series/read/${seriesEntryId}/create/episode`);
    }
  }

  onCreateSeason (e) {
    e.preventDefault();
    const seriesEntryId = this.props.params.seriesEntryId;
    if (seriesEntryId) {
      this.props.routerPushWithReturnTo(`/content/series/read/${seriesEntryId}/create/season`);
    }
  }

  async onClickDeleteSelected () {
    const seasonIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        seasonIds.push(key);
      }
    });
    await this.props.deleteSeasons(seasonIds);
    await this.props.loadSeasons(this.props.location.query, this.props.params.seriesEntryId);
  }

  render () {
    const { params, onChangeSearchString, onChangeDisplay, pageCount, selectAllCheckboxes, selectCheckbox, isSelected, totalResultCount, seasons,
       location: { query: { seasonsDisplay, seasonsPage,
         seasonsSearchString, seasonsSortField, seasonsSortDirection } } } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={seasonsDisplay}
              isLoading={seasons.get('_status') !== 'loaded'}
              menu= {<div style={dropdownStyles.floatOptions}>
                <div key='menuElementEpisode' style={[ dropdownStyles.floatOption ]} onClick={this.onCreateEpisode}>
                  Add Episode
                </div>
              </div>}
              searchString={seasonsSearchString}
              textCreateButton='New season'
              topElement={<div onClick={this.onCreateSeason}>Add Season</div>}
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onCreateSeason}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage, generalStyles.whiteBackground ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              entityType='Seasons'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected} />
            {(seasonsDisplay === undefined || seasonsDisplay === 'list') &&
              <div>
                <Table style={generalStyles.lightGrayBorder}>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'TITLE')} sortDirection = {seasonsSortField === 'TITLE' ? sortDirections[seasonsSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>TITLE</CustomCel>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NUMBER')} sortDirection = {seasonsSortField === 'NUMBER' ? sortDirections[seasonsSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { minWidth: 60 } ]}>#</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                    <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                  </Headers>
                  <Rows isLoading={seasons.get('_status') !== 'loaded'}>
                    {seasons.get('data').map((season, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(season.get('id'))} onChange={selectCheckbox.bind(this, season.get('id'))}/>
                          <CustomCel style={{ flex: 5 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${season.get('id')}`); }}>{season.get('title')}</CustomCel>
                          <CustomCel style={{ minWidth: 60 }}>{season.get('number')}</CustomCel>
                          <CustomCel style={{ flex: 2 }}>{season.get('lastUpdatedBy')}</CustomCel>
                          <CustomCel style={{ flex: 2 }}>{this.getLastUpdatedOn(season)}</CustomCel>
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/edit/${season.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteSeason(season.get('id')); }}>Remove</div>
                            </Dropdown>
                          </DropdownCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination currentPage={(seasonsPage && (parseInt(seasonsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(seasonsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(seasonsPage, 10), true); }}/>
              </div>
            }
            {seasonsDisplay === 'grid' &&
              <div>
                <div style={generalStyles.row}>
                  {seasons.get('data').map((season, index) => (
                    <Tile
                      checked={isSelected.get(season.get('id'))}
                      imageUrl={season.get('profileImage') && `${season.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                      key={`season${index}`}
                      text={season.get('title')}
                      onCheckboxChange={selectCheckbox.bind(this, season.get('id'))}
                      onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${season.get('id')}`); }}
                      onDelete={async (e) => { e.preventDefault(); await this.deleteSeason(season.get('id')); }}
                      onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/edit/${season.get('id')}`); }}/>
                  ))}
                  <Tile key={'createSeason'} onCreate={this.onClickNewEntry}/>
                </div>
                <Pagination currentPage={(seasonsPage && (parseInt(seasonsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(seasonsPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(seasonsPage, 10), true); }}/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}
