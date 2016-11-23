import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
// import Header from '../../../app/header';
// import { Root, Container } from '../../../_common/styles';
// import { DropdownCel, Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
// import Line from '../../../_common/components/line';
import Radium from 'radium';
// import * as actions from './actions';
// import selector from './selector';
// import SpecificHeader from '../../header';
// import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
// import { routerPushWithReturnTo } from '../../../../actions/global';
// import { slowdown } from '../../../../utils';
// import { confirmation } from '../../../_common/askConfirmation';

const numberOfRows = 25;

@tableDecorator('availabilities')
@connect(selector, (dispatch) => ({
  // deleteAvailability: bindActionCreators(actions.deleteAvailability, dispatch),
  // deleteAvailabilities: bindActionCreators(actions.deleteAvailabilities, dispatch),
  // load: bindActionCreators(actions.load, dispatch),
  // routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  // selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  // selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Availabilities extends Component {

  static propTypes = {
    availabilities: ImmutablePropTypes.list.isRequired
    // children: PropTypes.node,
    // deleteAvailabilities: PropTypes.func.isRequired,
    // deleteAvailability: PropTypes.func.isRequired,
    // isSelected: ImmutablePropTypes.map.isRequired,
    // load: PropTypes.func.isRequired,
    // location: PropTypes.shape({
    //   pathname: PropTypes.string.isRequired,
    //   query: PropTypes.object.isRequired
    // }),
    // pageCount: PropTypes.number,
    // routerPushWithReturnTo: PropTypes.func.isRequired,
    // selectAllCheckboxes: PropTypes.func.isRequired,
    // selectCheckbox: PropTypes.func.isRequired,
    // totalResultCount: PropTypes.number.isRequired,
    // onSortField: PropTypes.func.isRequired
  };

  // constructor (props) {
  //   super(props);
  //   this.onClickNewEntry = ::this.onClickNewEntry;
  //   this.onClickDeleteSelected = ::this.onClickDeleteSelected;
  //   this.slowSearch = slowdown(props.load, 300);
  // }

  // async componentWillMount () {
  //   await this.props.load(this.props.location.query);
  // }
  //
  // async componentWillReceiveProps (nextProps) {
  //   const nextQuery = nextProps.location.query;
  //   const query = this.props.location.query;
  //   if (isQueryChanged(query, nextQuery)) {
  //     this.slowSearch(nextQuery);
  //   }
  // }

  // async deleteAvailability (availabilityId) {
  //   const result = await confirmation();
  //   if (result) {
  //     await this.props.deleteAvailability(availabilityId);
  //     await this.props.load(this.props.location.query);
  //   }
  // }
  //
  // getTitle (seriesEntry) {
  //   return seriesEntry.get('title');
  // }
  //
  // getUpdatedBy (seriesEntry) {
  //   return seriesEntry.get('lastUpdatedBy');
  // }
  //
  // getLastUpdatedOn (seriesEntry) {
  //   const date = new Date(seriesEntry.get('lastUpdatedOn'));
  //   return moment(date).format('YYYY-MM-DD HH:mm');
  // }
  //
  // onClickNewEntry (e) {
  //   e.preventDefault();
  //   this.props.routerPushWithReturnTo('content/series/create');
  // }
  //
  // async onClickDeleteSelected (e) {
  //   e.preventDefault();
  //   const seriesEntryIds = [];
  //   this.props.isSelected.forEach((selected, key) => {
  //     if (selected && key !== 'ALL') {
  //       seriesEntryIds.push(key);
  //     }
  //   });
  //   await this.props.deleteAvailabilities(seriesEntryIds);
  //   await this.props.load(this.props.location.query);
  // }

  render () {
    return (
      <Section>
        <FormSubtitle first>Availability</FormSubtitle>
        <FormDescription>Where, when and how will people be able to sync on this content? (from a legal perspective)</FormDescription>
      </Section>
    );
  }

}
