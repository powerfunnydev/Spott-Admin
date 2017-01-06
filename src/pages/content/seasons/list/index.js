import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Root, Container } from '../../../_common/styles';
import { DropdownCel, Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';

const numberOfRows = 25;

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteSeason: bindActionCreators(actions.deleteSeason, dispatch),
  deleteSeasons: bindActionCreators(actions.deleteSeasons, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Seasons extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteSeason: PropTypes.func.isRequired,
    deleteSeasons: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
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

  async deleteSeason (seasonsId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteSeason(seasonsId);
      await this.props.load(this.props.location.query);
    }
  }

  getLastUpdatedOn (season) {
    const date = new Date(season.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/seasons/create');
  }

  async onClickDeleteSelected () {
    const seasonsIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        seasonsIds.push(key);
      }
    });
    await this.props.deleteSeasons(seasonsIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { seasons, children, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <SideMenu>
        <Root>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                isLoading={seasons.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Season Entry'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onClickNewEntry}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Seasons'
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
                            <CustomCel
                              style={{ flex: 2 }}
                              onClick={() => { this.props.routerPushWithReturnTo(`/content/seasons/read/${season.get('id')}`); }}>
                                {season.get('title')}
                            </CustomCel>
                            <CustomCel style={{ flex: 2 }}>{season.get('updatedBy')}</CustomCel>
                            <CustomCel getValue={this.getLastUpdatedOn} objectToRender={season} style={{ flex: 2 }}/>
                            <DropdownCel>
                              <Dropdown
                                elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/seasons/edit/${season.get('id')}`); }}>Edit</div>}>
                                <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteSeason(season.get('id')); }}>Remove</div>
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
                    {seasons.get('data').map((season, index) => (
                      <Tile
                        checked={isSelected.get(season.get('id'))}
                        imageUrl={season.get('profileImage') && `${season.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                        key={`season${index}`}
                        text={this.getTitle(season)}
                        onCheckboxChange={selectCheckbox.bind(this, season.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/seasons/read/${season.get('id')}`); }}
                        onDelete={async (e) => {
                          e.preventDefault();
                          await this.deleteSeason(season.get('id'));
                        }}
                        onEdit={(e) => {
                          e.preventDefault();
                          this.props.routerPushWithReturnTo(`/content/seasons/edit/${season.get('id')}`);
                        }}/>
                    ))}
                    <Tile key={'createSeason'} onCreate={() => { this.props.routerPushWithReturnTo('/content/seasons/create'); }}/>
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
