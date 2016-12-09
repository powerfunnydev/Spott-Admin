/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Section from '../../../_common/components/section';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../_common/styles';
import Plus from '../../../_common/images/plus';
import EditButton from '../../../_common/components/buttons/editButton';
import RemoveButton from '../../../_common/components/buttons/removeButton';
import PersistAvailabilityModal from '../persist';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteAvailability: bindActionCreators(actions.deleteAvailability, dispatch),
  loadAvailabilities: bindActionCreators(actions.loadAvailabilities, dispatch),
  persistAvailiability: bindActionCreators(actions.persistAvailability, dispatch)
}))
@Radium
export default class Availabilities extends Component {

  static propTypes = {
    availabilities: ImmutablePropTypes.map.isRequired,
    countries: ImmutablePropTypes.map.isRequired,
    deleteAvailability: PropTypes.func.isRequired,
    loadAvailabilities: PropTypes.func.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistAvailiability: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.getAvailability = ::this.getAvailability;
    this.onClickCreateAvailability = ::this.onClickCreateAvailability;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadAvailabilities, mediumId } = this.props;
    loadAvailabilities({ mediumId });
  }

  // Transform the date + time + timezone to one date
  transformAvailability ({ countryId, endDate, endTime, id, mediumId, startDate, startTime, timezone, videoStatus }) {
    return {
      availabilityFrom: startDate && startTime && moment(`${startDate.format('YYYY-MM-DD')} ${startTime.format('HH:mm')} ${timezone}`, 'YYYY-MM-DD HH:mm Z').utc().toDate(),
      availabilityTo: endDate && endTime && moment(`${endDate.format('YYYY-MM-DD')} ${endTime.format('HH:mm')} ${timezone}`, 'YYYY-MM-DD HH:mm Z').utc().toDate(),
      countryId,
      id,
      mediumId,
      videoStatus
    };
  }

  getAvailability (index) {
    const mediumId = this.props.mediumId;
    const { availabilityFrom, availabilityTo, countryId, id, videoStatus } = this.props.availabilities.getIn([ 'data', index ]).toJS();
    return {
      countryId,
      endDate: availabilityTo && moment(availabilityTo).startOf('day'),
      endTime: availabilityTo && moment(availabilityTo).utc(),
      id,
      noEndDate: !availabilityTo,
      mediumId,
      startDate: availabilityFrom && moment(availabilityFrom).startOf('day'),
      startTime: availabilityFrom && moment(availabilityFrom).utc(),
      timezone: '+00:00',
      videoStatus
    };
  }

  onClickCreateAvailability (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteAvailability (availabilityId) {
    const { deleteAvailability, loadAvailabilities, mediumId } = this.props;
    await deleteAvailability({ availabilityId, mediumId });
    await loadAvailabilities({ mediumId });
  }

  async onSubmit (form) {
    const { loadAvailabilities, persistAvailiability, mediumId } = this.props;
    const availability = this.transformAvailability(form);
    await persistAvailiability(availability);
    await loadAvailabilities({ mediumId });
  }

  static styles = {
    add: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: colors.primaryBlue,
      flex: 8,
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 245, 245, 0.5)'
    },
    editButton: {
      marginRight: '0.75em'
    },
    description: {
      marginBottom: '1.25em'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '5px',
      paddingBottom: '5px',
      minHeight: '30px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { availabilities, countries, mediumId } = this.props;

    return (
      <Section>
        <FormSubtitle first>Availability</FormSubtitle>
        <FormDescription style={styles.description}>Where, when and how will people be able to sync on this content? (from a legal perspective)</FormDescription>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.header, headerStyles.firstHeader, styles.adaptedCustomCel, { flex: 2 } ]}>
              Country
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 2 } ]}>
              Start
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 2 } ]}>
              End
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 2 } ]}>
              Sync state
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 1 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {availabilities.get('data').map((availability, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {countries.getIn([ availability.get('countryId'), 'name' ]) || '-'}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {availability.get('availabilityFrom') ? moment(availability.get('availabilityFrom')).format('DD/MM/YYYY HH:mm') : '-'}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {availability.get('availabilityTo') ? moment(availability.get('availabilityTo')).format('DD/MM/YYYY HH:mm') : '-'}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {availability.get('videoStatus')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    <EditButton style={styles.editButton} onClick={() => this.setState({ edit: index })} />
                    <RemoveButton onClick={this.onClickDeleteAvailability.bind(this, availability.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={availabilities.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateAvailability}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add availability
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistAvailabilityModal
              initialValues={{
                countryId: 'BE',
                endDate: moment().startOf('day'),
                endTime: moment(),
                mediumId,
                startDate: moment().startOf('day'),
                startTime: moment(),
                timezone: '+01:00',
                videoStatus: 'DISABLED'
              }}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'number' &&
            <PersistAvailabilityModal
              edit
              initialValues={this.getAvailability(this.state.edit)}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
