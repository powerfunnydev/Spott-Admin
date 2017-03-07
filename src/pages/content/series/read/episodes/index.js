import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { initialize, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../../actions/global';
import { DropdownCel, UtilsBar, isQueryChanged, Tile, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../_common/components/table/index';
import Dropdown, { styles as dropdownStyles } from '../../../../_common/components/actionDropdown';
import Line from '../../../../_common/components/line';
import { slowdown } from '../../../../../utils';
import { confirmation } from '../../../../_common/askConfirmation';
import SelectionDropdown from '../../../../_common/components/selectionDropdown';
import { FilterContent } from '../../../../_common/components/filterDropdown';
import { filterStyles } from '../../../../_common/styles';

import publishStatusTypes from '../../../../../constants/publishStatusTypes';

const numberOfRows = 25;
export const prefix = 'episodes';
// Those are the names of the redux form fields of the filter component
export const filterArray = [ 'publishStatus' ];

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteEpisode: bindActionCreators(actions.deleteEpisode, dispatch),
  deleteEpisodes: bindActionCreators(actions.deleteEpisodes, dispatch),
  initializeForm: bindActionCreators(initialize, dispatch),
  loadEpisodes: bindActionCreators(actions.loadEpisodes, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class List extends Component {

  static propTypes = {
    deleteEpisode: PropTypes.func.isRequired,
    deleteEpisodes: PropTypes.func.isRequired,
    episodes: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    getFilterObjectFromQuery: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    loadEpisodes: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    numberSelected: PropTypes.number,
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
    // reset: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
    this.onCreateEpisode = :: this.onCreateEpisode;
    this.onCreateEpisode = :: this.onCreateEpisode;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.loadEpisodes, 300);
  }

  async componentWillMount () {
    const { getFilterObjectFromQuery, initializeForm } = this.props;
    if (this.props.params.seriesEntryId) {
      await this.props.loadEpisodes(this.props.location.query, this.props.params.seriesEntryId);
    }
    initializeForm('episodeList', getFilterObjectFromQuery(filterArray));
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix, filterArray)) {
      await this.slowSearch(nextProps.location.query, this.props.params.seriesEntryId);
    }
  }

  async deleteEpisode (episodeId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteEpisode(episodeId);
      await this.props.loadEpisodes(this.props.location.query, this.props.params.seriesEntryId);
    }
  }

  getLastUpdatedOn (seriesEntry) {
    const date = new Date(seriesEntry.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/series', true);
  }

  onCreateEpisode (e) {
    e.preventDefault();
    const seriesEntryId = this.props.params.seriesEntryId;
    if (seriesEntryId) {
      this.props.routerPushWithReturnTo(`/content/series/read/${seriesEntryId}/create/episode`);
    }
  }

  async onClickDeleteSelected () {
    const episodeIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        episodeIds.push(key);
      }
    });
    await this.props.deleteEpisodes(episodeIds);
    await this.props.loadEpisodes(this.props.location.query, this.props.params.seriesEntryId);
  }

  render () {
    const { params, onChangeFilter, onChangeSearchString, onChangeDisplay, pageCount, selectAllCheckboxes, selectCheckbox, isSelected, totalResultCount, episodes,
       location: { query: { episodesDisplay, episodesPage,
         episodesSearchString, episodesSortField, episodesSortDirection } } } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={episodesDisplay}
              filterContent={
                <FilterContent
                  form='episodeList'
                  initialValues={{ publishStatus: null }}
                  style={filterStyles.filterContent}
                  onApplyFilter={onChangeFilter}>
                  <div style={filterStyles.row}>
                    <div style={filterStyles.title}>Publish Status</div>
                    <Field
                      component={SelectionDropdown}
                      getItemText={(key) => publishStatusTypes[key]}
                      name='publishStatus'
                      options={Object.keys(publishStatusTypes)}
                      placeholder='Publish Status'
                      style={filterStyles.fullWidth}/>
                  </div>
                </FilterContent>
              }
              isLoading={episodes.get('_status') !== 'loaded'}
              searchString={episodesSearchString}
              textCreateButton='New episode'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onCreateEpisode}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage, generalStyles.whiteBackground ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              entityType='Episodes'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected} />
            {(episodesDisplay === undefined || episodesDisplay === 'list') &&
              <div>
                <Table style={generalStyles.lightGrayBorder}>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.base, headerStyles.first ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'TITLE')} sortDirection = {episodesSortField === 'TITLE' ? sortDirections[episodesSortDirection] : NONE} style={[ headerStyles.base, headerStyles.clickable, { flex: 5 } ]}>TITLE</CustomCel>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NUMBER')} sortDirection = {episodesSortField === 'NUMBER' ? sortDirections[episodesSortDirection] : NONE} style={[ headerStyles.base, headerStyles.clickable, { minWidth: 60 } ]}>#</CustomCel>
                    <CustomCel style={[ headerStyles.base, { flex: 5 } ]}>SEASON TITLE</CustomCel>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'SEASON_NUMBER')} sortDirection = {episodesSortField === 'SEASON_NUMBER' ? sortDirections[episodesSortDirection] : NONE} style={[ headerStyles.base, headerStyles.clickable, { minWidth: 100 } ]}>SEASON #</CustomCel>
                    <CustomCel style={[ headerStyles.base, { minWidth: 130 } ]}>PUBLISH STATUS</CustomCel>
                    <CustomCel style={[ headerStyles.base, { flex: 3 } ]}>UPDATED BY</CustomCel>
                    <CustomCel style={[ headerStyles.base, { flex: 3 } ]}>LAST UPDATED ON</CustomCel>
                    <DropdownCel style={[ headerStyles.base ]}/>
                  </Headers>
                  <Rows isLoading={episodes.get('_status') !== 'loaded'}>
                    {episodes.get('data').map((episode, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(episode.get('id'))} onChange={selectCheckbox.bind(this, episode.get('id'))}/>
                          <CustomCel style={{ flex: 5 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${episode.getIn([ 'season', 'id' ])}/episodes/read/${episode.get('id')}`); }}>{episode.get('title')}</CustomCel>
                          <CustomCel style={{ minWidth: 60 }}>{episode.get('number')}</CustomCel>
                          <CustomCel style={{ flex: 5 }} onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${episode.getIn([ 'season', 'id' ])}`); }}>{episode.getIn([ 'season', 'title' ])}</CustomCel>
                          <CustomCel style={{ minWidth: 100 }}>{episode.getIn([ 'season', 'number' ])}</CustomCel>
                          <CustomCel style={{ minWidth: 130 }}>{publishStatusTypes[episode.get('publishStatus')]}</CustomCel>
                          <CustomCel style={{ flex: 3 }}>{episode.get('lastUpdatedBy')}</CustomCel>
                          <CustomCel style={{ flex: 3 }}>{this.getLastUpdatedOn(episode)}</CustomCel>
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${episode.getIn([ 'season', 'id' ])}/episodes/edit/${episode.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteEpisode(episode.get('id')); }}>Remove</div>
                            </Dropdown>
                          </DropdownCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination currentPage={(episodesPage && (parseInt(episodesPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(episodesPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(episodesPage, 10), true); }}/>
              </div>
            }
            {episodesDisplay === 'grid' &&
              <div>
                <div style={generalStyles.row}>
                  {episodes.get('data').map((episode, index) => (
                    <Tile
                      checked={isSelected.get(episode.get('id'))}
                      imageUrl={episode.get('profileImage') && `${episode.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                      key={`episode${index}`}
                      text={episode.get('title')}
                      onCheckboxChange={selectCheckbox.bind(this, episode.get('id'))}
                      onClick={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${episode.getIn([ 'season', 'id' ])}/episodes/read/${episode.get('id')}`); }}
                      onDelete={async (e) => { e.preventDefault(); await this.deleteEpisode(episode.get('id')); }}
                      onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${episode.getIn([ 'season', 'id' ])}/episodes/edit/${episode.get('id')}`); }}/>
                  ))}
                  <Tile key={'createEpisode'} onCreate={this.onClickNewEntry}/>
                </div>
                <Pagination currentPage={(episodesPage && (parseInt(episodesPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(episodesPage, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(episodesPage, 10), true); }}/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}
