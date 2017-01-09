import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import { Root, Container } from '../../../_common/styles';
import { DropdownCel, Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { mediumTypes, MOVIE, EPISODE, COMMERCIAL, SERIE, SEASON } from '../../../../constants/mediumTypes';

const numberOfRows = 25;

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteMedium: bindActionCreators(actions.deleteMedium, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Media extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteMedium: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    listMedia: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    media: ImmutablePropTypes.map.isRequired,
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
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  componentWillMount () {
    this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    // routeUrl is the url that corresponds with this route.
    const routeUrl = '/content/media';
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    const nextPathname = nextProps.location.pathname;
    const pathname = this.props.location.pathname;
    // If we opened a modal, like a create modal and we have created a entity, we come back
    // to the previous page. If this page is the same as routeUrl, we do a load.
    // If the query changed (e.g. searchString changed), we do also a load.
    if ((pathname !== routeUrl && nextPathname === routeUrl) || isQueryChanged(query, nextQuery)) {
      this.slowSearch(nextQuery);
    }
  }

  async deleteMedium (mediumId, type) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteMedium(mediumId, type);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (medium) {
    switch (medium.get('type')) {
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

  determineEditUrl (medium) {
    switch (medium.get('type')) {
      case COMMERCIAL:
        return `/content/commercials/edit/${medium.get('id')}`;
      case EPISODE:
        return `/content/series/read/${medium.getIn([ 'serie', 'id' ])}/seasons/read/${medium.getIn([ 'season', 'id' ])}/episodes/edit/${medium.get('id')}`;
      case MOVIE:
        return `/content/movies/edit/${medium.get('id')}`;
      case SEASON:
        return `/content/series/read/${medium.getIn([ 'serie', 'id' ])}/seasons/edit/${medium.get('id')}`;
      case SERIE:
        return `/content/series/edit/${medium.get('id')}`;
    }
  }

  getLastUpdatedOn (medium) {
    const date = new Date(medium.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onCreateEntity (type) {
    let createUrl;
    switch (type) {
      case COMMERCIAL:
        createUrl = '/content/media/create/commercial'; break;
      case EPISODE:
        createUrl = '/content/media/create/episode'; break;
      case MOVIE:
        createUrl = '/content/media/create/movie'; break;
      case SEASON:
        createUrl = '/content/media/create/season'; break;
      case SERIE:
        createUrl = '/content/media/create/seriesEntry'; break;
    }
    createUrl && this.props.routerPushWithReturnTo(createUrl);
  }

  async onClickDeleteSelected (type) {
    const isSelectedJS = this.props.isSelected.toJS();
    for (const key of Object.keys(isSelectedJS)) {
      const selected = isSelectedJS[key];
      if (selected && key !== 'ALL') {
        await this.props.deleteMedium(key, this.props.listMedia.getIn([ key, 'type' ]));
      }
    }
    await this.props.load(this.props.location.query);
  }

  render () {
    const { media, children, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Media', url: '/content/media' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                isLoading={media.get('_status') !== 'loaded'}
                menu= {<div style={[ dropdownStyles.floatOptions, dropdownStyles.extraWide ]}>
                  <div key='menuElementSeason' style={[ dropdownStyles.floatOption ]} onClick={this.onCreateEntity.bind(this, SEASON)}>
                    Add Season
                  </div>
                  <div style={dropdownStyles.line}/>
                  <div key='menuElementEpisode' style={[ dropdownStyles.floatOption ]} onClick={this.onCreateEntity.bind(this, EPISODE)}>
                    Add Episode
                  </div>
                  <div key='menuElementCommercial' style={[ dropdownStyles.floatOption ]} onClick={this.onCreateEntity.bind(this, COMMERCIAL)}>
                    Add Commercial
                  </div>
                </div>}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Series Entry'
                topElement={<div onClick={this.onCreateEntity.bind(this, SERIE)}>Add Series</div>}
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='All media'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <Table>
                    <Headers>
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'TITLE')} sortDirection = {sortField === 'TITLE' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>TITLE</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>MEDIA TYPE</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                      <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                    </Headers>
                    <Rows isLoading={media.get('_status') !== 'loaded'}>
                      {media.get('data').map((medium, index) => {
                        return (
                          <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                            <CheckBoxCel checked={isSelected.get(medium.get('id'))} onChange={selectCheckbox.bind(this, medium.get('id'))}/>
                            <CustomCel style={{ flex: 2 }} onClick={() => { const readUrl = this.determineReadUrl(medium); readUrl && this.props.routerPushWithReturnTo(readUrl); }}>
                              {medium.get('title')}
                            </CustomCel>
                            <CustomCel style={{ flex: 2 }}>
                              {mediumTypes[medium.get('type')]}
                            </CustomCel>
                            <CustomCel style={{ flex: 2 }}>
                              {medium.get('lastUpdatedBy')}
                            </CustomCel>
                            <CustomCel getValue={this.getLastUpdatedOn} objectToRender={medium} style={{ flex: 2 }}/>
                            <DropdownCel>
                              <Dropdown
                                elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { const editUrl = this.determineEditUrl(medium); editUrl && this.props.routerPushWithReturnTo(editUrl); }}>Edit</div>}>
                                <div key={1} style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); this.deleteMedium(medium.get('id'), medium.get('type')); }}>Remove</div>
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
                <div>
                  <div style={generalStyles.row}>
                    {media.get('data').map((medium, index) => (
                      <Tile
                        checked={isSelected.get(medium.get('id'))}
                        imageUrl={medium.get('profileImage') && `${medium.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                        key={`medium${index}`}
                        text={medium.get('title')}
                        onCheckboxChange={selectCheckbox.bind(this, medium.get('id'))}
                        onClick={() => { const readUrl = this.determineReadUrl(medium); readUrl && this.props.routerPushWithReturnTo(readUrl); }}
                        onDelete={async (e) => { await this.deleteMedium(medium.get('id'), medium.get('type')); }}
                        onEdit={(e) => { const editUrl = this.determineEditUrl(medium); editUrl && this.props.routerPushWithReturnTo(editUrl); }}/>
                    ))}
                    <Tile key={'createMedium'} onCreate={this.onCreateEntity.bind(this, SERIE)}/>
                  </div>
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
