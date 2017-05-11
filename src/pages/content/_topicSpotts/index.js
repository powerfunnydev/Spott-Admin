import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Masonry from 'react-masonry-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { routerPushWithReturnTo } from '../../../actions/global';
import ListView from '../../_common/components/listView/index';
import { isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import UtilsBar from '../../_common/components/table/utilsBar';
import ToolTip from '../../_common/components/toolTip';
import { confirmation } from '../../_common/askConfirmation';
import { MOVIE, EPISODE, COMMERCIAL, SERIE, SEASON } from '../../../constants/mediumTypes';
import Spott from '../spotts/list/spott';
import { slowdown } from '../../../utils';

/* eslint-disable react/no-set-state */
export const prefix = 'spotts';
@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteSpotts: bindActionCreators(actions.deleteSpotts, dispatch),
  deleteSpott: bindActionCreators(actions.deleteSpott, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class SpottList extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteSpott: PropTypes.func.isRequired,
    deleteSpotts: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    // used in selectors
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    spotts: ImmutablePropTypes.map.isRequired,
    topicId: PropTypes.string.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    const { load, location, topicId } = this.props;
    await load(location.query, topicId);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query, this.props.topicId);
    }
  }

  determineMediumReadUrl (spott) {
    const medium = spott.getIn([ 'sourceMedium' ]);
    switch (medium && medium.get('type')) {
      case COMMERCIAL:
        return `/content/commercials/read/${medium.get('id')}`;
      case EPISODE:
        return `/content/series/read/${medium.getIn([ 'serie', 'id' ])}/seasons/read/${medium.getIn([ 'season', 'id' ])}/episodes/read/${medium.get('id')}`;
      case MOVIE:
        return `/content/movies/read/${medium.get('id')}`;
      case SEASON:
        return `/content/series/read/${medium.getIn([ 'serie', 'id' ])}/seasons/read/${medium.get('id')}`;
      case SERIE:
        return `/content/series/read/${medium.get('id')}`;
    }
  }

  determineEditUrl (spott) {
    return `/content/spotts/edit/${spott.get('id')}`;
  }
  determineReadUrl (spott) {
    return `/content/spotts/read/${spott.get('id')}`;
  }

  getLastUpdatedOn (spott) {
    const date = new Date(spott.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  getNameItem (spott) {
    const styles = {
      logo: {
        width: '22px',
        height: '22px',
        borderRadius: '2px'
      },
      logoContainer: {
        paddingRight: '10px',
        display: 'inline-flex'
      },
      logoPlaceholder: {
        paddingRight: '32px'
      },
      overlay: {
        height: '200px',
        objectFit: 'cover',
        width: '150px'
      }
    };
    return (
      <div style={{ alignItems: 'center', display: 'inline-flex' }}>
        {spott.get('image') && <div style={styles.logoContainer}>
          <ToolTip
            overlay={<img src={`${spott.getIn([ 'image', 'url' ])}?height=150&width=150`} style={styles.overlay}/>}
            placement='top'
            prefixCls='no-arrow'>
            <img src={`${spott.getIn([ 'image', 'url' ])}?height=150&width=150`} style={styles.logo} />
          </ToolTip>
        </div> || <div style={styles.logoPlaceholder}/>} {spott.get('title')}
      </div>
    );
  }

  getSourceType (spott) {
    const type = spott.getIn([ 'sourceMedium', 'type' ]);
    const mediumTitle = spott.getIn([ 'sourceMedium', 'title' ]);
    if (type === EPISODE) {
      const seasonTitle = spott.getIn([ 'sourceMedium', 'season', 'title' ]);
      const serieTitle = spott.getIn([ 'sourceMedium', 'serie', 'title' ]);
      return `${serieTitle} - ${seasonTitle} - ${mediumTitle}`;
    }
    return mediumTitle;
  }

  async deleteSpott (spottId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteSpott(spottId);
      await this.props.load(this.props.location.query, this.props.topicId);
    }
  }

  async onClickDeleteSelected () {
    const spottIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        spottIds.push(key);
      }
    });
    await this.props.deleteSpotts(spottIds);
    await this.props.load(this.props.location.query, this.props.topicId);
  }

  render () {
    const { deleteSpott, topicId, isSelected, pageCount, selectAllCheckboxes,
      selectCheckbox, totalResultCount, spotts, location: { query: { spottsPage,
      spottsSearchString, spottsSortField, spottsSortDirection, spottsDisplay } }, onChangeDisplay,
      onChangePage, onChangeSearchString, onSortField } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    console.warn('spotts', spotts.toJS());
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'TITLE', title: 'TITLE', clickable: true, getUrl: this.determineReadUrl, convert: this.getNameItem, colspan: 3 },
      { type: 'custom', title: 'SOURCE TYPE', clickable: true, getUrl: this.determineMediumReadUrl, convert: this.getSourceType, colspan: 3 },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy' },
      { type: 'custom', sort: true, sortField: 'LAST_MODIFIED', title: 'LAST UPDATED ON', convert: this.getLastUpdatedOn },
      { type: 'custom', title: 'PUBLISH STATUS', name: 'publishStatus' },
      { type: 'dropdown' }
    ];
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={spottsDisplay}
              isLoading={spotts.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={spottsSearchString}
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString} />
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              entityType='Spotts'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected}/>
            {(spottsDisplay === undefined || spottsDisplay === 'list') &&
              <div>
                <ListView
                  columns={columns}
                  data={spotts}
                  deleteItem={deleteSpott}
                  getEditUrl={this.determineEditUrl}
                  isSelected={isSelected}
                  load={() => this.props.load(this.props.location.query, topicId)}
                  routerPushWithReturnTo={this.props.routerPushWithReturnTo}
                  selectAllCheckboxes={selectAllCheckboxes.bind(this, topicId)}
                  sortDirection={spottsSortDirection}
                  sortField={spottsSortField}
                  onCheckboxChange={(id) => selectCheckbox.bind(this, id, topicId)}
                  onSortField={(name) => onSortField.bind(this, name)} />
                <Pagination
                  currentPage={(spottsPage && (parseInt(spottsPage, 10) + 1) || 1)}
                  pageCount={pageCount}
                  onLeftClick={() => { onChangePage(parseInt(spottsPage, 10), false); }}
                  onRightClick={() => { onChangePage(parseInt(spottsPage, 10), true); }}/>
              </div>
            }
            {spottsDisplay === 'grid' &&
              <div>
                <Masonry>
                  {spotts.get('data').map((spott, index) => (
                    <Spott
                      checked={isSelected.get(spott.get('id'))}
                      key={`crop${index}`}
                      spott={spott}
                      onCheckboxChange={selectCheckbox.bind(this, spott.get('id'), topicId)}
                      onClick={() => { this.props.routerPushWithReturnTo(`/content/spotts/read/${spott.get('id')}`); }}
                      onDelete={async (e) => { e.preventDefault(); await this.deleteSpott(spott.get('id')); }}
                      onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/spotts/edit/${spott.get('id')}`); }}/>))}
                </Masonry>
                <Pagination currentPage={(spottsPage && (parseInt(spottsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { onChangePage(parseInt(spottsPage, 10), false); }} onRightClick={() => { onChangePage(parseInt(spottsPage, 10), true); }}/>
              </div>
            }
        </div>
      </div>
    </div>

    );
  }

}
