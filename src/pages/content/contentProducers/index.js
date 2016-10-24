import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push as routerPush } from 'react-router-redux';
import moment from 'moment';
import Header from '../../app/header';
import { Container, colors } from '../../_common/styles';
import { TotalEntries, headerStyles, determineSortDirection, NONE, sortDirections, CheckBoxCel, Table, Headers, TextCel, Rows, Row, Pagination } from '../../_common/components/table';
import SearchInput from '../../_common/components/searchInput';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';

const numberOfRows = 25;

@connect(selector, (dispatch) => ({
  load: bindActionCreators(actions.load, dispatch),
  routerPush: bindActionCreators(routerPush, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class ContentProducers extends Component {

  static propTypes = {
    contentProducers: ImmutablePropTypes.map.isRequired,
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
    totalResultCount: PropTypes.number.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeSearchString = ::this.onChangeSearchString;
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
    this.props.routerPush({
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
    this.props.routerPush({
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
    this.props.routerPush({
      ...this.props.location,
      query
    });
  }

  static styles = {
    searchContainer: {
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center' }
  }

  render () {
    const { contentProducers, isSelected, location: { pathname, query: { page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <Header currentPath={pathname} hideHomePageLinks />
        <div style={{ backgroundColor: colors.veryLightGray }}>
          <Container style={styles.searchContainer}>
            <SearchInput isLoading={contentProducers.get('_status') !== 'loaded'} value={searchString} onChange={this.onChangeSearchString}/>
          </Container>
        </div>
        <div style={{ backgroundColor: colors.lightGray }}>
          <Container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <TotalEntries totalResultCount={totalResultCount}/>
            <Table>
              <Headers>
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                <TextCel sortColumn={this.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>NAME</TextCel>
                <TextCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</TextCel>
                <TextCel sortColumn={this.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</TextCel>
              </Headers>
              <Rows isLoading={contentProducers.get('_status') !== 'loaded'}>
                {contentProducers.get('data').map((cp, index) => {
                  return (
                    <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get(cp.get('id'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, cp.get('id'))}/>
                      <TextCel getValue={this.getName} objectToRender={cp} style={{ flex: 2 }} onClick={() => { }} />
                      <TextCel getValue={this.getUpdatedBy} objectToRender={cp} style={{ flex: 2 }}/>
                      <TextCel getValue={this.getLastUpdatedOn} objectToRender={cp} style={{ flex: 2 }}/>
                    </Row>
                  );
                })}
              </Rows>
            </Table>
            <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.onChangePage(parseInt(page, 10), true); }}/>
          </Container>
        </div>
      </div>

    );
  }

}
