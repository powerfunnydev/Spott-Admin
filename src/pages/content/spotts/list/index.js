import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Masonry from 'react-masonry-component';
import moment from 'moment';
import { Root, Container } from '../../../_common/styles';
import { UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import ToolTip from '../../../_common/components/toolTip';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import * as actions from './actions';
import selector from './selector';
import Spott from './spott';
import { MOVIE, EPISODE, COMMERCIAL, SERIE, SEASON } from '../../../../constants/mediumTypes';

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteSpott: bindActionCreators(actions.deleteSpott, dispatch),
  deleteSpotts: bindActionCreators(actions.deleteSpotts, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Spotts extends Component {

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
    pageCount: PropTypes.number,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    spotts: ImmutablePropTypes.map.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCreateSpott = ::this.onCreateSpott;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  componentWillMount () {
    this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery)) {
      this.slowSearch(nextQuery);
    }
  }

  async deleteSpott (spottsId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteSpott(spottsId);
      await this.props.load(this.props.location.query);
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

  determineReadUrl (spott) {
    return `/content/spotts/read/${spott.get('id')}`;
  }

  determineEditUrl (spott) {
    return `/content/spotts/edit/${spott.get('id')}`;
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

  onCreateSpott (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/spotts/create');
  }

  async onClickDeleteSelected () {
    const spottIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        spottIds.push(key);
      }
    });
    await this.props.deleteSpotts(spottIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    // TODO implement link to source of medium
    const {
      spotts, children, deleteSpott, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString
    } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'TITLE', title: 'TITLE', clickable: true, getUrl: this.determineReadUrl, convert: this.getNameItem, colspan: 3 },
      { type: 'custom', title: 'SOURCE', clickable: true, getUrl: this.determineMediumReadUrl, convert: this.getSourceType, colspan: 3 },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy' },
      { type: 'custom', sort: true, sortField: 'LAST_MODIFIED', title: 'LAST UPDATED ON', convert: this.getLastUpdatedOn },
      { type: 'custom', title: 'PUBLISH STATUS', name: 'publishStatus' },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy= {[ { title: 'Spotts', url: '/content/spotts' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                isLoading={spotts.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='Add Spott'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onCreateSpott}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Spotts'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={spotts}
                    deleteItem={deleteSpott}
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
                </div>
              }
              {display === 'grid' &&
                <div>
                  <Masonry>
                    {spotts.get('data').map((spott, index) => (
                      <Spott
                        checked={isSelected.get(spott.get('id'))}
                        key={`spott${index}`}
                        spott={spott}
                        onCheckboxChange={selectCheckbox.bind(this, spott.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/spotts/read/${spott.get('id')}`); }}
                        onDelete={async (e) => { e.preventDefault(); await this.deleteSpott(spott.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/spotts/edit/${spott.get('id')}`); }}/>))}
                  </Masonry>
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
            </Container>
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
