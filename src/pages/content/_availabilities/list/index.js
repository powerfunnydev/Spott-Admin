import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
// import Header from '../../../app/header';
// import { Root, Container } from '../../../_common/styles';
import { DropdownCel, Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Section from '../../../_common/components/section';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../_common/styles';
// import Line from '../../../_common/components/line';
import Radium from 'radium';
// import * as actions from './actions';
// import selector from './selector';
// import SpecificHeader from '../../header';
// import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
// import { slowdown } from '../../../../utils';
// import { confirmation } from '../../../_common/askConfirmation';
import selector from './selector';
import Plus from '../../../_common/images/plus';

// @tableDecorator('availabilities')
@connect(selector, (dispatch) => ({
  // deleteAvailability: bindActionCreators(actions.deleteAvailability, dispatch),
  // deleteAvailabilities: bindActionCreators(actions.deleteAvailabilities, dispatch),
  // load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
  // selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  // selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Availabilities extends Component {

  static propTypes = {
    availabilities: ImmutablePropTypes.list.isRequired,
    // children: PropTypes.node,
    // deleteAvailabilities: PropTypes.func.isRequired,
    // deleteAvailability: PropTypes.func.isRequired,
    // isSelected: ImmutablePropTypes.map.isRequired,
    // load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    })
    // pageCount: PropTypes.number,
    // routerPushWithReturnTo: PropTypes.func.isRequired,
    // selectAllCheckboxes: PropTypes.func.isRequired,
    // selectCheckbox: PropTypes.func.isRequired,
    // totalResultCount: PropTypes.number.isRequired,
    // onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickNewEntry = ::this.onClickNewEntry;
    // this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    // this.slowSearch = slowdown(props.load, 300);
  }

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

  onClickNewEntry (e) {
    e.preventDefault();
    const location = this.props.location;
    this.props.routerPushWithReturnTo({
      ...location,
      pathname: `${location.pathname}/create/availability`
    });
  }

  static styles = {
    add: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: colors.primaryBlue,
      flex: 8,
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 245, 245, 0.5)'
    },
    description: {
      marginBottom: '1.25em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { availabilities, countries } = this.props;

    return (
      <Section>
        <FormSubtitle first>Availability</FormSubtitle>
        <FormDescription style={styles.description}>Where, when and how will people be able to sync on this content? (from a legal perspective)</FormDescription>
        <Table>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            {/* <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/> */}
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>
              Countries
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>
              Start
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>
              End
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>
              Sync state
            </CustomCel>
            {/* <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/> */}
          </Headers>
          <Rows>
            {availabilities.map((availability, index) => {
              return (
                <Row index={index} isFirst={index === 0} key={index} >
                  {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                  {/* <CheckBoxCel checked={isSelected.get(seriesEntry.get('id'))} onChange={selectCheckbox.bind(this, seriesEntry.get('id'))}/>*/}
                  <CustomCel style={{ flex: 2 }}>
                    {countries.getIn([ availability.get('countryId'), 'name' ]) || '-'}
                  </CustomCel>
                  <CustomCel style={{ flex: 2 }}>
                    {availability.get('availabilityFrom') ? moment(new Date(availability.get('availabilityFrom'))).format('YYYY-MM-DD HH:mm') : '-'}
                  </CustomCel>
                  <CustomCel style={{ flex: 2 }}>
                    {availability.get('availabilityTo') ? moment(new Date(availability.get('availabilityTo'))).format('YYYY-MM-DD HH:mm') : '-'}
                  </CustomCel>
                  <CustomCel style={{ flex: 2 }}>
                    {availability.get('videoStatus')}
                  </CustomCel>
                  {/* <DropdownCel>
                    <Dropdown
                      elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`content/series/edit/${seriesEntry.get('id')}`); }}>Edit</div>}>
                      <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteSeriesEntry(seriesEntry.get('id')); }}>Remove</div>
                    </Dropdown>
                  </DropdownCel> */}
                </Row>
              );
            })}
            <Row index={availabilities.size} key={availabilities.size}>
              <CustomCel style={styles.add} onClick={this.onClickNewEntry}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add availability
              </CustomCel>
            </Row>
          </Rows>
        </Table>
      </Section>
    );
  }

}
