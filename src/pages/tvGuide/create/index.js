import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import { push as routerPush } from 'react-router-redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { FormSubtitle } from '../../_common/styles';
import DateInput from '../../_common/inputs/dateInput';
import SelectInput from '../../_common/inputs/selectInput';
import localized from '../../_common/localized';
import { FETCHING } from '../../../constants/statusTypes';
import CreateModal from '../../_common/createModal';
import * as actions from './actions';
import selector from './selector';

// function validate (values) {
//   const validationErrors = {};
//   const { email, password } = values.toJS();
//   const emailError = !email;
//   // !values.get('email') || !values.get('email').match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
//   if (emailError) { validationErrors.email = 'invalid'; }
//   const passwordError = !password || !password.match(/^.{6,}$/);
//   if (passwordError) { validationErrors.password = 'invalid'; }
//   // Done
//   return validationErrors;
// }

@localized
@connect(selector, (dispatch) => ({
  routerPush: bindActionCreators(routerPush, dispatch),
  searchEpisodes: bindActionCreators(actions.searchEpisodes, dispatch),
  searchMedia: bindActionCreators(actions.searchMedia, dispatch),
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  // TODO
  submit: bindActionCreators(actions.searchMedia, dispatch)
}))
@reduxForm({
  form: 'tvGuideCreateEntry',
  initialValues: {
    endDate: moment().startOf('day'),
    startDate: moment().startOf('day')
  }
})
@Radium
export default class LoginModal extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPush: PropTypes.func.isRequired,
    searchEpisodes: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    searchSeries: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  // The autofocus attribute will only work when the page loads initially.
  // When a popup opens we still need to manually focus the field.
  componentDidMount () {
    // setTimeout(() => {
    //   ReactDOM.findDOMNode(this._email).focus();
    // }, 0);
  }

  async submit (form) {
    try {
      await this.props.submit(form.toJS());
      this.props.routerPush((this.props.location && this.props.location.state && this.props.location.state.returnTo) || '/');
    } catch (error) {
      if (error === 'incorrect') {
        throw new SubmissionError({ _error: 'login.errors.incorrect' });
      }
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPush((this.props.location && this.props.location.state && this.props.location.state.returnTo) || '/');
  }

  static styles = {
  };

  render () {
    const { styles } = this.constructor;
    const {
      broadcastChannelsById, error, handleSubmit, mediaById, searchBroadcastChannels,
      searchEpisodes, searchMedia, searchSeasons, searchedBroadcastChannelIds,
      searchedEpisodeIds, searchedSeasonIds, searchedMediumIds, medium, t
    } = this.props;

    console.warn('broadcastChannelsById', broadcastChannelsById && broadcastChannelsById.toJS());
    return (
      <CreateModal isOpen title='New TV guide entry' onClose={this.onCloseClick}>
        <FormSubtitle style={{ marginTop: 0 }}>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(id) => `${mediaById.getIn([ id, 'title' ])} (${t(`mediaTypes.${mediaById.getIn([ id, 'type' ])}`)})`}
          getOptions={searchMedia}
          isLoading={searchedMediumIds.get('_status') === FETCHING}
          label='Medium title'
          name='mediumId'
          options={searchedMediumIds.get('data').toJS()}
          placeholder='Series'
          required />
        {medium.get('type') === 'TV_SERIE' &&
          <div>
            <Field
              component={SelectInput}
              getItemText={(id) => mediaById.getIn([ id, 'title', mediaById.getIn([ id, 'defaultLocale' ]) ])}
              getOptions={searchSeasons}
              isLoading={searchedSeasonIds.get('_status') === FETCHING}
              label='Season'
              name='seasonId'
              options={searchedSeasonIds.get('data').toJS()}
              placeholder='Season'
              required />
            <Field
              component={SelectInput}
              getItemText={(id) => mediaById.getIn([ id, 'title', mediaById.getIn([ id, 'defaultLocale' ]) ])}
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
          getItemText={(id) => broadcastChannelsById.getIn([ id, 'title', broadcastChannelsById.getIn([ id, 'defaultLocale' ]) ])}
          getOptions={searchBroadcastChannels}
          isLoading={searchedBroadcastChannelIds.get('_status') === FETCHING}
          label='Channel'
          name='broadcastChannelId'
          options={searchedBroadcastChannelIds.get('data').toJS()}
          placeholder='Channel'
          required />
        <Field
          component={DateInput}
          label='Start'
          name='startDate'
          required />
        <Field
          component={DateInput}
          label='End'
          name='endDate'
          required />
        {/* <Field component={renderField} name='email' placeholder={t('login.email')} ref={(c) => { this._email = c; }} />
        <Field component={renderField} name='password' placeholder={t('login.password')} type='password' /> */}
      </CreateModal>
    );
  }

}
