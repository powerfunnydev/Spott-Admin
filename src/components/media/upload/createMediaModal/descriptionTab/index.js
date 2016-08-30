import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form/immutable';
import { buttonStyles, colors } from '../../../../_common/styles';
import createMediaStyles from '../styles';
import Episode from './episode';
import { EPISODE } from '../../../../../constants/mediaTypes';

function validate ({ episode, episodeTitle, season, seriesName }) {
  const errors = {};
  // Validate seriesName
  if (typeof seriesName === 'undefined' || seriesName === '') {
    errors.seriesName = 'Series name is required.';
  }
  // Validate season
  if (typeof season === 'undefined' || season === '') {
    errors.season = 'Season number is required.';
  }
  // Validate episode
  if (typeof episode === 'undefined' || episode === '') {
    errors.episode = 'Episode number is required.';
  }
  // Validate episode title
  if (typeof episodeTitle === 'undefined' || episodeTitle === '') {
    errors.episodeTitle = 'Episode title is required.';
  }
  // Done, return
  return errors;
}

@reduxForm({
  destroyOnUnmount: false,
  fields: [ 'episode', 'episodeTitle', 'season', 'seriesName' ],
  form: 'createMedia',
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint), // Get the `form` state (reduxMountPoint = 'form' by default).
  validate
})
@Radium
export default class DescriptionTab extends Component {

  static propTypes = {
    currentMediaType: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool.isRequired,
    onSelectMediaType: PropTypes.func.isRequired
  }

  static styles = {
    info: {
      display: 'flex',
      marginTop: 20
    },
    mediaTypes: {
      borderBottom: `1px solid ${colors.lightGray}`,
      margin: '0 -34px 30px -34px',
      padding: '0 34px 0 34px'
    },
    small: {
      width: 70,
      marginRight: 20
    }
  };

  // TODO: prefill data when medium is given
  render () {
    // const styles = this.constructor.styles;
    const { currentMediaType, fields: { episode, episodeTitle, season, seriesName }, handleSubmit, submitFailed } = this.props;

    return (
      <form noValidate onSubmit={handleSubmit}>
        <div style={createMediaStyles.body}>
          <h1 style={createMediaStyles.title}>About your upload</h1>

          {/* TODO: support other media types
            <MediaTypes
            currentMediaType={currentMediaType}
            style={styles.mediaTypes}
            onMediaTypeClick={onSelectMediaType} />*/}
          <p>Note: currently, only episodes are supported.</p>

          {currentMediaType === EPISODE &&
            <Episode
              episode={episode}
              episodeTitle={episodeTitle}
              season={season}
              seriesName={seriesName}
              submitFailed={submitFailed} />}

        </div>

        <div style={createMediaStyles.footer.container}>
          <button key='next' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.first, buttonStyles.blue ]} type='submit'>NEXT</button>
        </div>
      </form>
    );
  }
}
