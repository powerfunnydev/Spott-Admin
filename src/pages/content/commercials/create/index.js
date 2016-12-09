import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import CheckboxInput from '../../../_common/inputs/checkbox';
import localized from '../../../_common/decorators/localized';
import PersistModal from '../../../_common/components/persistModal';
import { loadEpisodes } from '../../seasons/read/episodes/actions';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import SelectInput from '../../../_common/inputs/selectInput';
import { FETCHING } from '../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, hasTitle, number, seriesEntryId, seasonId, title } = values.toJS();
  if (!seriesEntryId) { validationErrors.seriesEntryId = t('common.errors.required'); }
  if (!seasonId) { validationErrors.seasonId = t('common.errors.required'); }
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!number || number < 1) { validationErrors.number = t('common.errors.required'); }
  if (hasTitle && !title) { validationErrors.title = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  fetchLastEpisode: bindActionCreators(actions.fetchLastEpisode, dispatch),
  loadEpisodes: bindActionCreators(loadEpisodes, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch)
}))
@reduxForm({
  form: 'episodeCreate',
  validate
})
@Radium
export default class CreateEpisodentryModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    currentSeasonId: PropTypes.string,
    currentSeriesEntryId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    fetchLastEpisode: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    hasTitle: PropTypes.bool,
    initialize: PropTypes.func.isRequired,
    loadEpisodes: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedSeasonIds: ImmutablePropTypes.map.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seasonsById: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    untouch: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
    this.onChangeSeason = ::this.onChangeSeason;
  }

  async componentWillMount () {
    const { fetchLastEpisode, searchSeasons, initialize,
        params: { seriesEntryId, seasonId }, currentLocale } = this.props;
    // We need to fetch seasons of a certain series. SelectInput component
    // will not do this automatically (cause we render first, and then initialize
    // our seasonId of our redux form).
    await searchSeasons(null, seriesEntryId);
    // 404 error when there is no last episode. We go further with the default value of
    // defaultLocale, content producers, broadcasters and number of an episode.
    let broadcasters;
    let characters;
    let contentProducers;
    let defaultLocale;
    let episodeNumber;
    // We need the id of the last episode for copying all characters.
    let lastEpisodeId;
    try {
      const lastEpisode = await fetchLastEpisode(seasonId);
      console.log('lastEpisode', lastEpisode);
      broadcasters = lastEpisode.broadcasters;
      characters = lastEpisode.characters;
      contentProducers = lastEpisode.contentProducers;
      defaultLocale = lastEpisode.defaultLocale;
      episodeNumber = lastEpisode.number + 1;
      lastEpisodeId = lastEpisode.id;
      console.log('lastEpisodeId', lastEpisodeId);
    } catch (e) {
      console.error('e', e);
      broadcasters = [];
      characters = [];
      contentProducers = [];
      // We will use the locale of the current user as default locale.
      defaultLocale = currentLocale;
      episodeNumber = 1;
    }
    await initialize({
      broadcasters,
      characters,
      contentProducers,
      defaultLocale,
      lastEpisodeId,
      number: episodeNumber,
      seasonId,
      seriesEntryId
    });
  }

  async submit (form) {
    try {
      const { change, dispatch, location, params, submit, untouch } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        this.props.loadEpisodes(loc.query, params.seasonId);
      }
      if (createAnother) {
        // If we create another episode, set the next episode number
        dispatch(change('number', parseInt(form.get('number'), 10) + 1));
        // and reset the title.
        dispatch(change('title', null));
        dispatch(untouch('defaultLocale', 'seriesEntryId', 'seasonId', 'number', 'hasTitle', 'title'));
      } else {
        this.onCloseClick();
      }
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  async onChangeSeason (currentSeasonId) {
    const { fetchLastEpisode, change, dispatch } = this.props;

    let episodeNumber;
    try {
      const { number } = await fetchLastEpisode(currentSeasonId);
      episodeNumber = number + 1;
    } catch (e) {
      // We get a 404 error when there is no last episode.
      // This is the first episode because there is no last episode.
      episodeNumber = 1;
    }
    // Set the next episode number
    dispatch(change('number', episodeNumber));
    // and reset the title.
    dispatch(change('title', null));
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('content/series', true);
  }

  static styles = {
    customTitle: {
      paddingBottom: '0.438em'
    },
    titleLabel: {
      paddingBottom: '0.7em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { hasTitle, localeNames, currentSeasonId, currentSeriesEntryId, searchSeriesEntries,
        seriesEntriesById, searchedSeriesEntryIds, searchSeasons, seasonsById,
        searchedSeasonIds, handleSubmit } = this.props;
    return (
      <PersistModal createAnother isOpen title='Create Episode Entry'
        onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(language) => localeNames.get(language)}
          getOptions={(language) => localeNames.keySeq().toArray()}
          label='Default language'
          name='defaultLocale'
          options={localeNames.keySeq().toArray()}
          placeholder='Default language'/>
        <Field
          component={SelectInput}
          getItemText={(id) => seriesEntriesById.getIn([ id, 'title' ])}
          getOptions={searchSeriesEntries}
          isLoading={searchedSeriesEntryIds.get('_status') === FETCHING}
          label='Series title'
          name='seriesEntryId'
          options={searchedSeriesEntryIds.get('data').toJS()}
          placeholder='Series title'
          onChange={() => {
            this.props.dispatch(this.props.change('seasonId', null));
          }} />
        {currentSeriesEntryId &&
          <Field
            component={SelectInput}
            getItemText={(id) => seasonsById.getIn([ id, 'title' ])}
            getOptions={(searchString) => { searchSeasons(searchString, currentSeriesEntryId); }}
            isLoading={searchedSeasonIds.get('_status') === FETCHING}
            label='Season title'
            name='seasonId'
            options={searchedSeasonIds.get('data').toJS()}
            placeholder='Season title'
            onChange={this.onChangeSeason} />}
        {currentSeriesEntryId && currentSeasonId &&
          <Field
            component={TextInput}
            label='Episode number'
            name='number'
            placeholder='Episode number'
            required
            type='number'/>}
        {currentSeriesEntryId && currentSeasonId &&
          <Field
            component={TextInput}
            content={
              <Field
                component={CheckboxInput}
                first
                label='Custom title'
                name='hasTitle'
                style={styles.customTitle} />}
            disabled={!hasTitle}
            label='Episode title'
            labelStyle={styles.titleLabel}
            name='title'
            placeholder='Episode title'
            required />}
      </PersistModal>
    );
  }

}
