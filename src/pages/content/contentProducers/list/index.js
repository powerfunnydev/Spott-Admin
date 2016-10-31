import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Header from '../../../app/header';
import { Root, Container, buttonStyles } from '../../../_common/styles';
import { generalStyles, TotalEntries, headerStyles, determineSortDirection, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table';
import Line from '../../../_common/components/line';
import SearchInput from '../../../_common/inputs/searchInput';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SpecificHeader from '../../header';
import PlusButton from '../../../_common/buttons/plusButton';
import Button from '../../../_common/buttons/button';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';

const numberOfRows = 25;

@connect(selector, (dispatch) => ({
  deleteContentProducersEntry: bindActionCreators(actions.deleteContentProducerEntry, dispatch),
  deleteContentProducersEntries: bindActionCreators(actions.deleteContentProducerEntries, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class ContentProducers extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentProducers: ImmutablePropTypes.map.isRequired,
    deleteContentProducersEntries: PropTypes.func.isRequired,
    deleteContentProducersEntry: PropTypes.func.isRequired,
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
    totalResultCount: PropTypes.number.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeSearchString = ::this.onChangeSearchString;
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
  }

  componentWillMount () {
    this.props.load(this.props.location.query);
  }

  componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (query.page !== nextQuery.page ||
      query.pageSize !== nextQuery.pageSize ||
      query.sortDirection !== nextQuery.sortDirection ||
      query.sortField !== nextQuery.sortField ||
      query.searchString !== nextQuery.searchString) {
      this.props.load(nextProps.location.query);
    }
  }

  async deleteContentProducersEntry (contentProducersEntryId) {
    await this.props.deleteContentProducersEntry(contentProducersEntryId);
    await this.props.load(this.props.location.query);
  }

  getName (cp) {
    return cp.get('name');
  }

  getUpdatedBy (cp) {
    return cp.get('lastUpdatedBy');
  }

  getLastUpdatedOn (cp) {
    const date = new Date(cp.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onSortField (sortField) {
    const query = {
      ...this.props.location.query,
      page: 0,
      sortField,
      sortDirection: determineSortDirection(sortField, this.props.location.query)
    };
    // props will be updated -> componentWillReceiveProps
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      query
    });
  }

  onChangeSearchString (e) {
    const query = {
      ...this.props.location.query,
      searchString: e.target.value
    };
    // props will be updated -> componentWillReceiveProps
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      query
    });
  }

  onChangePage (page = 0, next = true) {
    const nextPage = next ? page + 1 : page - 1;
    const query = {
      ...this.props.location.query,
      page: nextPage
    };
    // props will be updated -> componentWillReceiveProps
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      query
    });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('content/content-producers/create');
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const contentProducersEntryIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        contentProducersEntryIds.push(key);
      }
    });
    await this.props.deleteContentProducersEntries(contentProducersEntryIds);
    await this.props.load(this.props.location.query);
  }

  static styles = {
    searchContainer: {
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center' }
  }

  render () {
    const { contentProducers, children, isSelected, location, location: { query: { page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount } = this.props;
    const { styles } = this.constructor;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <div style={generalStyles.backgroundBar}>
          <Container style={styles.searchContainer}>
            <SearchInput isLoading={contentProducers.get('_status') !== 'loaded'} value={searchString} onChange={this.onChangeSearchString}/>
            <div style={generalStyles.floatRight}>
              <Button key='delete' style={[ buttonStyles.blue ]} text={`Delete ${numberSelected}`} type='button' onClick={this.onClickDeleteSelected}/>
              <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text='New Content Producer' onClick={this.onClickNewEntry} />
            </div>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
            <Table>
              <Headers>
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                <CustomCel sortColumn={this.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>NAME</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                <CustomCel sortColumn={this.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}/>
              </Headers>
              <Rows isLoading={contentProducers.get('_status') !== 'loaded'}>
                {contentProducers.get('data').map((cp, index) => {
                  return (
                    <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get(cp.get('id'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, cp.get('id'))}/>
                      <CustomCel getValue={this.getName} objectToRender={cp} style={{ flex: 2 }} />
                      <CustomCel getValue={this.getUpdatedBy} objectToRender={cp} style={{ flex: 2 }}/>
                      <CustomCel getValue={this.getLastUpdatedOn} objectToRender={cp} style={{ flex: 2 }}/>
                      <CustomCel style={{ flex: 1 }}>
                        <Dropdown
                          elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`content/content-producers/edit/${cp.get('id')}`); }}>Edit</div>}>
                          <div key={1} style={[ dropdownStyles.option ]} onClick={(e) => { e.preventDefault(); this.deleteContentProducersEntry(cp.get('id')); }}>Remove</div>
                        </Dropdown>
                      </CustomCel>
                    </Row>
                  );
                })}
              </Rows>
            </Table>
            <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.onChangePage(parseInt(page, 10), true); }}/>
          </Container>
        </div>
        {children}
      </Root>

    );
  }

}
