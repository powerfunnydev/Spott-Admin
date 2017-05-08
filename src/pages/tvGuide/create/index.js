import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { FormSubtitle } from '../../_common/styles';
import DateInput from '../../_common/inputs/dateInput';
import TimeInput from '../../_common/inputs/timeInput';
import SelectInput from '../../_common/inputs/selectInput';
import localized from '../../_common/decorators/localized';
import { FETCHING } from '../../../constants/statusTypes';
import PersistModal from '../../_common/components/persistModal';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../actions/global';

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
  clearPopUpMessage: bindActionCreators(actions.clearPopUpMessage, dispatch),
  fetchNextEpisode: bindActionCreators(actions.fetchNextEpisode, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBroadcastChannels: bindActionCreators(actions.searchBroadcastChannels, dispatch),
  searchEpisodes: bindActionCreators(actions.searchEpisodes, dispatch),
  searchMedia: bindActionCreators(actions.searchMedia, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  submit: bindActionCreators(actions.submit, dispatch)
}))
@reduxForm({
  form: 'tvGuideCreateEntry',
  validate
})
@Radium
export default class CreateTvGuideEntryModal extends Component {

  static propTypes = {
    broadcastChannelsById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    clearPopUpMessage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    fetchNextEpisode: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    mediaById: ImmutablePropTypes.map.isRequired,
    medium: ImmutablePropTypes.map.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    reset: PropTypes.func.isRequired,
    route: PropTypes.shape({
      load: PropTypes.func.isRequired
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
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async componentWillMount () {
    const { episodeId, seasonId, seriesEntryId, movieId } = this.props.params;
    // If we want to create an tv guide entry in the read page of a series entry,
    // season or episode, we want to prefill this information.
    if (seriesEntryId) {
      this.props.initialize({
        mediumId: seriesEntryId,
        seasonId,
        episodeId,
        endDate: moment().startOf('day'),
        endTime: moment(),
        startDate: moment().startOf('day'),
        startTime: moment()
      });
    } else if (movieId) {
      this.props.initialize({
        mediumId: movieId,
        endDate: moment().startOf('day'),
        endTime: moment(),
        startDate: moment().startOf('day'),
        startTime: moment()
      });
    } else {
      this.props.initialize({
        endDate: moment().startOf('day'),
        endTime: moment(),
        startDate: moment().startOf('day'),
        startTime: moment()
      });
    }
  }

  async submit (form) {
    try {
      const { route: { load }, submit, dispatch, fetchNextEpisode, change, searchEpisodes } = this.props;
      const fullForm = form.toJS();
      const { episodeId, seasonId, startDate, endDate } = fullForm;
      await submit(fullForm);
      const createAnother = form.get('createAnother');
      // Load the new list of items, using the location query of the previous page.
      load && load(this.props);
      if (createAnother) {
        if (episodeId) {
          const nextEpisode = await fetchNextEpisode(episodeId);
          await dispatch(change('startDate', moment(startDate).add(1, 'days')));
          await dispatch(change('endDate', moment(endDate).add(1, 'days')));
          await dispatch(change('seasonId', nextEpisode.season.id));
          // When there is a next episode, but not in the same season,
          // we need to fetch the episodes of this new season.
          if (seasonId !== nextEpisode.season.id) {
            await searchEpisodes();
          }
          await dispatch(change('episodeId', nextEpisode.id));
        }
      } else {
        this.onCloseClick();
      }
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('tv-guide', true);
  }

  static styles = {
    col2: {
      display: 'flex',
      flexDirection: 'row'
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
      broadcastChannelsById, clearPopUpMessage, handleSubmit, mediaById, popUpMessage, searchBroadcastChannels,
      searchEpisodes, searchMedia, searchSeasons, searchedBroadcastChannelIds,
      searchedEpisodeIds, searchedSeasonIds, searchedMediumIds, medium, t
    } = this.props;
    return (
      <PersistModal
        clearPopUpMessage={clearPopUpMessage}
        createAnother
        isOpen
        popUpObject={popUpMessage}
        title='New TV guide entry'
        onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemImage={(id) => mediaById.getIn([ id, 'posterImage', 'url' ])}
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
              getItemImage={(id) => mediaById.getIn([ id, 'posterImage', 'url' ])}
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
              getItemImage={(id) => mediaById.getIn([ id, 'posterImage', 'url' ])}
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
          getItemImage={(id) => broadcastChannelsById.getIn([ id, 'logo', 'url' ])}
          getItemText={(id) => broadcastChannelsById.getIn([ id, 'name' ])}
          getOptions={searchBroadcastChannels}
          isLoading={searchedBroadcastChannelIds.get('_status') === FETCHING}
          label='Channel'
          name='broadcastChannelId'
          options={searchedBroadcastChannelIds.get('data').toJS()}
          placeholder='Channel'
          required />
        <div style={styles.col2}>
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
        <div style={styles.col2}>
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
      </PersistModal>
    );
  }

}
