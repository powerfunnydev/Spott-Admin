import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Header from '../../app/header';
import { Root, FormSubtitle, colors, EditTemplate } from '../../_common/styles';
import DateInput from '../../_common/inputs/dateInput';
import TimeInput from '../../_common/inputs/timeInput';
import SelectInput from '../../_common/inputs/selectInput';
import localized from '../../_common/decorators/localized';
import { FETCHING } from '../../../constants/statusTypes';
import * as actions from './actions';
import selector from './selector';
import Section from '../../_common/components/section';
import { routerPushWithReturnTo } from '../../../actions/global';
import { Tabs, Tab } from '../../_common/components/formTabs';
import ensureEntityIsSaved from '../../_common/decorators/ensureEntityIsSaved';

function validate (values, { medium, t }) {
  const validationErrors = {};
  const { broadcastChannelId, endDate, endTime, episodeId, mediumId, seasonId, startDate, startTime } = values.toJS();
  if (!broadcastChannelId) { validationErrors.broadcastChannelId = t('common.errors.required'); }
  if (!endDate) { validationErrors.endDate = t('common.errors.required'); }
  if (!endTime) { validationErrors.endTime = t('common.errors.required'); }
  // When a series is selected, the episode is required.
  if (medium.get('type') === 'TV_SERIE' && !episodeId) { validationErrors.episodeId = t('common.errors.required'); }
  if (!mediumId) { validationErrors.mediumId = t('common.errors.required'); }
  // When a series is selected, the episode is required.
  if (medium.get('type') === 'TV_SERIE' && !seasonId) { validationErrors.seasonId = t('common.errors.required'); }
  if (!startDate) { validationErrors.startDate = t('common.errors.required'); }
  if (!startTime) { validationErrors.startTime = t('common.errors.required'); }

  if (!validationErrors.startDate && !validationErrors.startTime && !validationErrors.endDate && !validationErrors.endTime) {
    const start = startDate.clone().hours(startTime.hours()).minutes(startTime.minutes());
    const end = endDate.clone().hours(endTime.hours()).minutes(endTime.minutes());

    // Date/time is wrong! End before start.
    if (start.isSameOrAfter(end)) {
      // Check date.
      if (startDate.isAfter(endDate)) {
        // Date is wrong.
        validationErrors.endDate = 'End date must be after start date.';
      } else {
        // Date is oké, time is wrong.
        validationErrors.endTime = 'End time must be after start time.';
      }
    }
  }

  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBroadcastChannels: bindActionCreators(actions.searchBroadcastChannels, dispatch),
  searchEpisodes: bindActionCreators(actions.searchEpisodes, dispatch),
  searchMedia: bindActionCreators(actions.searchMedia, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  submit: bindActionCreators(actions.submit, dispatch)
}))
@reduxForm({
  form: 'tvGuideEditEntry',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditTvGuideEntry extends Component {

  static propTypes = {
    broadcastChannelsById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    // used for renderBreadCrumbs
    currentTvGuideEntry: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    mediaById: ImmutablePropTypes.map.isRequired,
    medium: ImmutablePropTypes.map.isRequired,
    params: PropTypes.object.isRequired,
    route: PropTypes.shape({
      renderBreadCrumbs: PropTypes.func.isRequired
    }).isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBroadcastChannels: PropTypes.func.isRequired,
    searchEpisodes: PropTypes.func.isRequired,
    searchMedia: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeries: PropTypes.func,
    searchedBroadcastChannelIds: ImmutablePropTypes.map.isRequired,
    searchedEpisodeIds: ImmutablePropTypes.map.isRequired,
    searchedMediumIds: ImmutablePropTypes.map.isRequired,
    searchedSeasonIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    if (this.props.params.tvGuideEntryId) {
      const editObj = await this.props.load(this.props.params.tvGuideEntryId);
      const initObj = {};
      // in case of a serie
      if (editObj.season) {
        initObj.mediumId = editObj.serie.id;
        initObj.seasonId = editObj.season.id;
        initObj.episodeId = editObj.medium.id;
      } else { // in case of a movie
        initObj.mediumId = editObj.medium.id;
      }
      this.props.initialize({
        ...initObj,
        broadcastChannelId: editObj.channel.id,
        endDate: moment(editObj.end).startOf('day'),
        endTime: moment(editObj.end),
        startDate: moment(editObj.start).startOf('day'),
        startTime: moment(editObj.start)
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('tv-guide', true);
  }

  async submit (form) {
    try {
      await this.props.submit({ id: this.props.params.tvGuideEntryId, ...form.toJS() });
      this.props.initialize(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    fullWidth: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    dividedFields: {
      display: 'flex',
      flexDirection: 'row'
    },
    cancelAndSubmitComponent: {
      paddingBottom: '10px',
      paddingTop: '10px',
      paddingRight: '22.5px',
      display: 'flex',
      justifyContent: 'flex-end',
      borderBottom: `1px solid ${colors.lightGray3}`,
      borderLeft: `1px solid ${colors.lightGray3}`,
      borderRight: `1px solid ${colors.lightGray3}`,
      backgroundColor: colors.veryLightGray,
      width: '100%'
    },
    background: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    dateInput: {
      flex: 1,
      paddingRight: '0.313em'
    },
    timeInput: {
      alignSelf: 'flex-end',
      flex: 1,
      paddingLeft: '0.313em'
    }
  };

  render () {
    const { styles } = this.constructor;
    const {
      location, broadcastChannelsById, handleSubmit, mediaById, searchBroadcastChannels,
      searchEpisodes, searchMedia, searchSeasons, searchedBroadcastChannelIds,
      searchedEpisodeIds, searchedSeasonIds, searchedMediumIds, medium, t, route: { renderBreadCrumbs }
    } = this.props;
    return (
      <Root style={styles.background}>
        <Header currentLocation={location} hideHomePageLinks />
        {renderBreadCrumbs(this.props)}
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
        <Tabs>
          <Tab title='Details'>
            <Section>
              <FormSubtitle>Content</FormSubtitle>
              <Field
                component={SelectInput}
                getItemText={(id) => mediaById.getIn([ id, 'title' ]) && `${mediaById.getIn([ id, 'title' ])} (${t(`mediaTypes.${mediaById.getIn([ id, 'type' ])}`)})`}
                getOptions={searchMedia}
                isLoading={searchedMediumIds.get('_status') === FETCHING}
                label='Medium title'
                name='mediumId'
                options={searchedMediumIds.get('data').toJS()}
                placeholder='Medium title'
                required
                onChange={() => {
                  this.props.dispatch(this.props.change('seasonId', null));
                  this.props.dispatch(this.props.change('episodeId', null));
                }} />
              {medium.get('type') === 'TV_SERIE' &&
                <div>
                  <Field
                    component={SelectInput}
                    getItemText={(id) => mediaById.getIn([ id, 'title' ])}
                    getOptions={searchSeasons}
                    isLoading={searchedSeasonIds.get('_status') === FETCHING}
                    label='Season'
                    name='seasonId'
                    options={searchedSeasonIds.get('data').toJS()}
                    placeholder='Season'
                    required
                    onChange={() => {
                      this.props.dispatch(this.props.change('episodeId', null));
                    }} />
                  <Field
                    component={SelectInput}
                    getItemText={(id) => mediaById.getIn([ id, 'title' ])}
                    getOptions={searchEpisodes}
                    isLoading={searchedEpisodeIds.get('_status') === FETCHING}
                    label='Episode'
                    name='episodeId'
                    options={searchedEpisodeIds.get('data').toJS()}
                    placeholder='Episode'
                    required />
                </div>}
              <FormSubtitle>Airtime</FormSubtitle>
              <Field
                component={SelectInput}
                getItemText={(id) => broadcastChannelsById.getIn([ id, 'name' ])}
                getOptions={searchBroadcastChannels}
                isLoading={searchedBroadcastChannelIds.get('_status') === FETCHING}
                label='Channel'
                name='broadcastChannelId'
                options={searchedBroadcastChannelIds.get('data').toJS()}
                placeholder='Channel'
                required />
              <div style={styles.dividedFields}>
                <Field
                  component={DateInput}
                  label='Start'
                  name='startDate'
                  required
                  style={styles.dateInput} />
                <Field
                  component={TimeInput}
                  name='startTime'
                  required
                  style={styles.timeInput} />
              </div>
              <div style={styles.dividedFields}>
                <Field
                  component={DateInput}
                  label='End'
                  name='endDate'
                  required
                  style={styles.dateInput} />
                <Field
                  component={TimeInput}
                  name='endTime'
                  required
                  style={styles.timeInput} />
              </div>
              </Section>
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
