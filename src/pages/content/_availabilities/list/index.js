/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Field } from 'redux-form/immutable';
import moment from 'moment';
import { fromJS } from 'immutable';
import Section from '../../../_common/components/section';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../_common/styles';
import Plus from '../../../_common/images/plus';
import EditButton from '../../../_common/buttons/editButton';
import RemoveButton from '../../../_common/buttons/removeButton';
import PersistAvailabilityModal from '../persist';
import selector from './selector';

@connect(selector)
@Radium
export default class Availabilities extends Component {

  static propTypes = {
    availabilities: ImmutablePropTypes.list.isRequired,
    countries: ImmutablePropTypes.map.isRequired,
    fields: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.persistAvailiability = ::this.persistAvailiability;
    this.onClickCreate = ::this.onClickCreate;
    this.getAvailability = ::this.getAvailability;
    this.state = {
      create: false,
      edit: false
    };
  }

  // Transform the date + time + timezone to one date
  transformAvailability ({ countryId, endDate, endTime, startDate, startTime, timezone, videoStatus }) {
    return {
      availabilityFrom: startDate && startTime && moment(`${startDate.format('YYYY-MM-DD')} ${startTime.format('HH:mm')} ${timezone}`, 'YYYY-MM-DD HH:mm Z').utc().toDate(),
      availabilityTo: endDate && endTime && moment(`${endDate.format('YYYY-MM-DD')} ${endTime.format('HH:mm')} ${timezone}`, 'YYYY-MM-DD HH:mm Z').utc().toDate(),
      countryId,
      videoStatus
    };
  }

  persistAvailiability (index, data) {
    const availability = this.transformAvailability(data);
    this.props.fields.remove(index);
    this.props.fields.insert(index, fromJS(availability));
  }

  getAvailability (index) {
    const { availabilityFrom, availabilityTo, countryId, videoStatus } = this.props.availabilities.get(index).toJS();
    return {
      countryId,
      endDate: availabilityTo && moment(availabilityTo).startOf('day'),
      endTime: availabilityTo && moment(availabilityTo),
      noEndDate: !availabilityTo,
      startDate: availabilityFrom && moment(availabilityFrom).startOf('day'),
      startTime: availabilityFrom && moment(availabilityFrom),
      timezone: '+00:00',
      videoStatus
    };
  }

  onClickCreate (e) {
    e.preventDefault();
    this.setState({ create: true });
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
    const { fields, countries } = this.props;

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
            {fields.map((availability, index) => {
              return (
                <Row isFirst={index === 0} key={`availabilityRow${index}`} >
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    <Field
                      component={({ input: { value: countryId } }) => <span>{countries.getIn([ countryId, 'name' ]) || '-'}</span>}
                      name={`${availability}.countryId`} />
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    <Field
                      component={({ input: { value: availabilityFrom } }) => <span>{availabilityFrom ? moment(availabilityFrom).format('DD/MM/YYYY HH:mm') : '-'}</span>}
                      name={`${availability}.availabilityFrom`} />
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    <Field
                      component={({ input: { value: availabilityTo } }) => <span>{availabilityTo ? moment(availabilityTo).format('DD/MM/YYYY HH:mm') : '-'}</span>}
                      name={`${availability}.availabilityTo`} />
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    <Field
                      component={({ input: { value: videoStatus } }) => <span>{videoStatus}</span>}
                      name={`${availability}.videoStatus`} />
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    <EditButton style={styles.editButton} onClick={() => this.setState({ edit: index })} />
                    <RemoveButton onClick={() => fields.remove(index)} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={fields.length === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreate}>
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
                startDate: moment().startOf('day'),
                startTime: moment(),
                timezone: '+01:00',
                videoStatus: 'DISABLED'
              }}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.persistAvailiability.bind(this, this.props.fields.length)} />}
          {typeof this.state.edit === 'number' &&
            <PersistAvailabilityModal
              edit
              initialValues={this.getAvailability(this.state.edit)}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.persistAvailiability.bind(this, this.state.edit)} />}
        </Table>
      </Section>
    );
  }

}
