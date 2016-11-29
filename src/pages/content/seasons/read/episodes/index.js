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
export const prefix = 'episodes';
@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteEpisode: bindActionCreators(actions.deleteEpisode, dispatch),
  deleteEpisodes: bindActionCreators(actions.deleteEpisodes, dispatch),
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
    isSelected: ImmutablePropTypes.map.isRequired,
    loadEpisodes: PropTypes.func.isRequired,
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
    this.slowSearch = slowdown(props.loadEpisodes, 300);
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
  }

  async componentWillMount () {
    if (this.props.params.seasonId) {
      await this.props.loadEpisodes(this.props.location.query, this.props.params.seasonId);
    }
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query, this.props.params.seasonId);
    }
  }

  async deleteEpisode (episodeId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteEpisode(episodeId);
      await this.props.loadEpisodes(this.props.location.query, this.props.params.seasonId);
    }
  }

  getLastUpdatedOn (seriesEntry) {
    const date = new Date(seriesEntry.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/series', true);
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const episodesIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        episodesIds.push(key);
      }
    });
    await this.props.deleteEpisodes(episodesIds);
    await this.props.loadEpisodes(this.props.location.query, this.props.params.seasonId);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const seasonId = this.props.params.seasonId;
    const seriesEntryId = this.props.params.seriesEntryId;
    if (seriesEntryId && seasonId) {
      this.props.routerPushWithReturnTo(`content/series/read/${seriesEntryId}/seasons/read/${seasonId}/create/episode`);
    }
  }

  render () {
    const { params, onChangeSearchString, onChangeDisplay, pageCount, selectAllCheckboxes, selectCheckbox, isSelected, totalResultCount, episodes,
       location: { query: { episodesDisplay, episodesPage,
         episodesSearchString, episodesSortField, episodesSortDirection } } } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={episodesDisplay}
              isLoading={episodes.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={episodesSearchString}
              textCreateButton='New episode'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage, generalStyles.whiteBackground ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected}/>
            {(episodesDisplay === undefined || episodesDisplay === 'list') &&
              <div>
                <Table style={generalStyles.lightGrayBorder}>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'TITLE')} sortDirection = {episodesSortField === 'TITLE' ? sortDirections[episodesSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 5 } ]}>Title</CustomCel>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NUMBER')} sortDirection = {episodesSortField === 'NUMBER' ? sortDirections[episodesSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { minWidth: 60 } ]}>#</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                    <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                  </Headers>
                  <Rows isLoading={episodes.get('_status') !== 'loaded'}>
                    {episodes.get('data').map((episode, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(episode.get('id'))} onChange={selectCheckbox.bind(this, episode.get('id'))}/>
                          <CustomCel
                            style={{ flex: 5 }}
                            onClick={() => { this.props.routerPushWithReturnTo(`content/series/read/${params.seriesEntryId}/seasons/read/${params.seasonId}/episodes/read/${episode.get('id')}`); }}>
                              {episode.get('title')}
                          </CustomCel>
                          <CustomCel
                            style={{ minWidth: 60 }}>
                              {episode.get('number')}
                          </CustomCel>
                          <CustomCel style={{ flex: 2 }}>{episode.get('lastUpdatedBy')}</CustomCel>
                          <CustomCel style={{ flex: 2 }}>{this.getLastUpdatedOn(episode)}</CustomCel>
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]}onClick={() => { this.props.routerPushWithReturnTo(`content/series/read/${params.seriesEntryId}/seasons/read/${params.seasonId}/episodes/edit/${episode.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={[ dropdownStyles.option, dropdownStyles.marginTop ]} onClick={async (e) => { e.preventDefault(); await this.deleteEpisode(episode.get('id')); }}>Remove</div>
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
              <div style={generalStyles.row}>
                {this.props.episodes.get('data').map((episode, index) => (
                  <Tile
                    imageUrl={episode.get('profileImage') && `${episode.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                    key={`episode${index}`}
                    text={episode.get('title')}
                    onDelete={async (e) => {
                      e.preventDefault();
                      await this.deleteEpisode(episode.get('id'));
                    }}
                    onEdit={(e) => {
                      e.preventDefault();
                      this.props.routerPushWithReturnTo(`content/episodes/edit/${episode.get('id')}`);
                    }}/>
                ))}
                <Tile key={'createEpisode'} onCreate={this.onClickNewEntry}/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}
