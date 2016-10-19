import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push as routerPush } from 'react-router-redux';
import moment from 'moment';
import Header from '../../app/header';
import { Container, colors, makeTextStyle } from '../../_common/styles';
import { determineSortDirection, NONE, sortDirections, CheckBoxCel, Table, Headers, TextCel, Rows, Row, Pagination } from '../../_common/components/table';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';

/* eslint-disable react/no-set-state*/
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
    tvGuideEntries: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
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

  getMediumTitle (tvGuideEntry) {
    // in case of a serie
    if (tvGuideEntry.get('medium') && tvGuideEntry.get('season') && tvGuideEntry.get('serie')) {
      const serie = tvGuideEntry.get('serie').get('title');
      const season = tvGuideEntry.get('season').get('title');
      const episode = tvGuideEntry.get('medium').get('title');
      return `${serie} - ${season} - ${episode}`;
    }
    // in case of a movie
    return tvGuideEntry.get('medium').get('title');
  }

  getChannelName (tvGuideEntry) {
    return tvGuideEntry.get('channel').get('name');
  }

  getUpdatedBy (tvGuideEntry) {
    return tvGuideEntry.get('lastUpdatedBy');
  }

  getLastUpdatedOn (tvGuideEntry) {
    const date = new Date(tvGuideEntry.get('lastUpdatedOn'));
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
    header: {
      height: '32px',
      color: colors.darkGray2,
      backgroundColor: colors.white,
      ...makeTextStyle(null, '11px', '0.50px')
    },
    firstHeader: {
      borderBottom: `1px solid ${colors.lightGray2}`
    },
    notFirstHeader: {
      borderLeft: `1px solid ${colors.lightGray2}`,
      borderBottom: `1px solid ${colors.lightGray2}`
    },
    searchContainer: {
      height: '70px',
      display: 'flex',
      alignItems: 'center' }
  }

  render () {
    const { isSelected, location: { pathname, query: { page, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, tvGuideEntries } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <Header currentPath={pathname} hideHomePageLinks />
        <div style={{ backgroundColor: colors.lightGray }}>
          <Container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <Table>
              <Headers>
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ styles.header, styles.firstHeader, { flex: 0.5 } ]} onChange={selectAllCheckboxes}/>
                <TextCel style={[ styles.header, styles.notFirstHeader, { flex: 1 } ]}>CHANNEL</TextCel>
                <TextCel style={[ styles.header, styles.notFirstHeader, { flex: 2 } ]}>TITLE</TextCel>
                <TextCel style={[ styles.header, styles.notFirstHeader, { flex: 1 } ]}>UPDATED BY</TextCel>
                <TextCel sortColumn={this.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE} style={[ styles.header, styles.notFirstHeader, { flex: 1 } ]}>LAST UPDATED ON</TextCel>
              </Headers>
              <Rows isLoading={tvGuideEntries.get('_status') !== 'loaded'}>
                {tvGuideEntries.get('data').map((tvGuideEntry, index) => {
                  return (
                    <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get(tvGuideEntry.get('id'))} style={{ flex: 0.5 }} onChange={selectCheckbox.bind(this, tvGuideEntry.get('id'))}/>
                      <TextCel getValue={this.getChannelName} objectToRender={tvGuideEntry} style={{ flex: 1 }}/>
                      <TextCel getValue={this.getMediumTitle} objectToRender={tvGuideEntry} style={{ flex: 2 }}/>
                      <TextCel getValue={this.getUpdatedBy} objectToRender={tvGuideEntry} style={{ flex: 1 }}/>
                      <TextCel getValue={this.getLastUpdatedOn} objectToRender={tvGuideEntry} style={{ flex: 1 }}/>
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
