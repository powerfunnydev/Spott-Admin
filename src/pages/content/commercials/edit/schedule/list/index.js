/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Section from '../../../../../_common/components/section';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../../_common/styles';
import Plus from '../../../../../_common/images/plus';
import EditButton from '../../../../../_common/components/buttons/editButton';
import RemoveButton from '../../../../../_common/components/buttons/removeButton';
import PersistScheduleEntryModal from '../persist';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteScheduleEntry: bindActionCreators(actions.deleteScheduleEntry, dispatch),
  loadScheduleEntry: bindActionCreators(actions.loadScheduleEntry, dispatch),
  loadScheduleEntries: bindActionCreators(actions.loadScheduleEntries, dispatch),
  persistScheduleEntry: bindActionCreators(actions.persistScheduleEntry, dispatch)
}))
@Radium
export default class Schedule extends Component {

  static propTypes = {
    commercialId: PropTypes.string.isRequired,
    deleteScheduleEntry: PropTypes.func.isRequired,
    loadScheduleEntries: PropTypes.func.isRequired,
    loadScheduleEntry: PropTypes.func.isRequired,
    persistScheduleEntry: PropTypes.func.isRequired,
    scheduleEntries: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.getScheduleEntry = ::this.getScheduleEntry;
    this.onClickCreateScheduleEntry = ::this.onClickCreateScheduleEntry;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadScheduleEntries, commercialId } = this.props;
    loadScheduleEntries({ commercialId });
  }

  // Transform the date + time + timezone to one date
  transformScheduleEntry ({ endDate, endTime, startDate, startTime, timezone, ...rest }) {
    return {
      ...rest,
      end: endDate && endTime && moment(`${endDate.format('YYYY-MM-DD')} ${endTime.format('HH:mm')} ${timezone}`, 'YYYY-MM-DD HH:mm Z').utc().toDate(),
      start: startDate && startTime && moment(`${startDate.format('YYYY-MM-DD')} ${startTime.format('HH:mm')} ${timezone}`, 'YYYY-MM-DD HH:mm Z').utc().toDate()
    };
  }

  getScheduleEntry (index) {
    const { broadcaster, broadcastChannels, commercialId, end, id, media, start } = this.props.scheduleEntries.getIn([ 'data', index ]).toJS();
    return {
      broadcasterId: broadcaster && broadcaster.id,
      broadcastChannelIds: broadcastChannels && broadcastChannels.map((bc) => bc.id),
      commercialId,
      endDate: end && moment(end).startOf('day'),
      endTime: end && moment(end).utc(),
      id,
      mediumIds: media && media.map((medium) => medium.id),
      noEndDate: !end,
      startDate: start && moment(start).startOf('day'),
      startTime: start && moment(start).utc(),
      timezone: '+00:00'
    };
  }

  onClickCreateScheduleEntry (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteScheduleEntry (scheduleEntryId) {
    const { commercialId, deleteScheduleEntry, loadScheduleEntries } = this.props;
    await deleteScheduleEntry({ scheduleEntryId });
    await loadScheduleEntries({ commercialId });
  }

  async onSubmit (form) {
    const { commercialId, loadScheduleEntries, persistScheduleEntry } = this.props;
    const availability = this.transformScheduleEntry(form);
    await persistScheduleEntry(availability);
    await loadScheduleEntries({ commercialId });
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
    const { commercialId, scheduleEntries, loadScheduleEntry } = this.props;

    return (
      <Section>
        <FormSubtitle first>Schedule</FormSubtitle>
        <FormDescription style={styles.description}>For what content and for how long should this advertisement run?</FormDescription>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.base, headerStyles.first, styles.adaptedCustomCel, { flex: 2 } ]}>
              Broadcaster
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              Channels
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              Content
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              Start
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              End
            </CustomCel>
            {/* <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              Status
            </CustomCel> */}
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 1 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {scheduleEntries.get('data').map((scheduleEntry, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {scheduleEntry.getIn([ 'broadcaster', 'name' ])}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {!scheduleEntry.get('broadcastChannels') || scheduleEntry.get('broadcastChannels').size === 0
                      ? 'All'
                      : scheduleEntry.get('broadcastChannels').map((channel) => channel.get('name')).join(', ')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {!scheduleEntry.get('media') || scheduleEntry.get('media').size === 0
                     ? 'All'
                     : scheduleEntry.get('media').map((medium) => medium.get('title')).join(', ')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {scheduleEntry.get('start') ? moment(scheduleEntry.get('start')).format('DD/MM/YYYY HH:mm') : '-'}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {scheduleEntry.get('end') ? moment(scheduleEntry.get('end')).format('DD/MM/YYYY HH:mm') : '-'}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    <EditButton style={styles.editButton} onClick={async () => {
                      await loadScheduleEntry({ scheduleEntryId: scheduleEntry.get('id') });
                      this.setState({ edit: index });
                    }} />
                    <RemoveButton onClick={this.onClickDeleteScheduleEntry.bind(this, scheduleEntry.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={scheduleEntries.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateScheduleEntry}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add entry
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistScheduleEntryModal
              initialValues={{
                commercialId,
                endDate: moment().startOf('day'),
                endTime: moment(),
                startDate: moment().startOf('day'),
                startTime: moment(),
                timezone: '+01:00'
              }}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'number' &&
            <PersistScheduleEntryModal
              edit
              initialValues={this.getScheduleEntry(this.state.edit)}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
