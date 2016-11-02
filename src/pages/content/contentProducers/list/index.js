import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Header from '../../../app/header';
import { Root, Container, buttonStyles } from '../../../_common/styles';
import { tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table';
import Line from '../../../_common/components/line';
import SearchInput from '../../../_common/inputs/searchInput';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SpecificHeader from '../../header';
import PlusButton from '../../../_common/buttons/plusButton';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';

const numberOfRows = 25;

@tableDecorator
@connect(selector, (dispatch) => ({
  deleteContentProducersEntry: bindActionCreators(actions.deleteContentProducerEntry, dispatch),
  deleteContentProducersEntries: bindActionCreators(actions.deleteContentProducerEntries, dispatch),
  load: bindActionCreators(actions.load, dispatch),
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
    routerPush: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
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

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPush({
      pathname: 'content/content-producers/create',
      state: { returnTo: this.props.location }
    });
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
    const { contentProducers, children, isSelected, location: { pathname, query: { page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount } = this.props;
    const { styles } = this.constructor;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentPath={pathname} hideHomePageLinks />
        <SpecificHeader/>
        <div style={generalStyles.backgroundBar}>
          <Container style={styles.searchContainer}>
            <SearchInput isLoading={contentProducers.get('_status') !== 'loaded'} value={searchString} onChange={this.props.onChangeSearchString}/>
            <div style={generalStyles.floatRight}>
              <button key='delete' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='button' onClick={this.onClickDeleteSelected}>Delete {numberSelected}</button>
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
                <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>NAME</CustomCel>
                <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                <CustomCel sortColumn={this.props.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
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
                          elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPush(`content/content-producers/edit/${cp.get('id')}`); }}>Edit</div>}>
                          <div key={1} style={[ dropdownStyles.option ]} onClick={(e) => { e.preventDefault(); this.deleteContentProducersEntry(cp.get('id')); }}>Remove</div>
                        </Dropdown>
                      </CustomCel>
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
