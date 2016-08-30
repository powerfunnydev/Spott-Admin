import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { errorTextStyle } from '../../../../_common/styles';
import createMediaStyles from '../styles';

export default class Episode extends Component {

  static propTypes = {
    episode: PropTypes.object.isRequired,
    episodeTitle: PropTypes.object.isRequired,
    season: PropTypes.object.isRequired,
    seriesName: PropTypes.object.isRequired,
    submitFailed: PropTypes.bool.isRequired
  };

  componentDidMount () {
    // Focus the first input. For some weird reason this does not work
    // when not wrapped in a setTimeout(). To be investigated if someone
    // has a lot of time, but for now it'll do.
    setTimeout(() => {
      ReactDOM.findDOMNode(this.seriesNameInput).focus();
    }, 0);
  }

  static styles = {
    info: {
      display: 'flex',
      marginTop: 20
    },
    small: {
      width: 70,
      marginRight: 20
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { episode, episodeTitle, season, seriesName, submitFailed } = this.props;
    return (
      <div>
        <div>
          <label htmlFor='seriesName' style={createMediaStyles.label}>Series name</label>
          <input id='seriesName' placeholder='e.g., Suits'
            ref={(x) => { this.seriesNameInput = x; }}
            required style={createMediaStyles.inputText} type='text' {...seriesName} />
          {submitFailed && seriesName.touched && seriesName.error && <div style={errorTextStyle}>{seriesName.error}</div>}
        </div>

        <div style={styles.info}>
          <div style={styles.small}>
            <label htmlFor='season' style={createMediaStyles.label}>Season</label>
            <input id='season' max='9999' min='0' placeholder='SE' required
              style={createMediaStyles.inputText} type='number' {...season} />
          </div>
          <div style={styles.small}>
            <label htmlFor='episode' style={createMediaStyles.label}>Episode</label>
            <input id='episode' max='9999' min='0' placeholder='EP' required
              style={createMediaStyles.inputText} type='number' {...episode} />
          </div>
          <div>
            <label htmlFor='episodeTitle' style={createMediaStyles.label}>Episode title</label>
            <input id='episodeTitle' placeholder='e.g, Dogfight' required style={createMediaStyles.inputText}
              type='text' {...episodeTitle} />
          </div>
        </div>
        {submitFailed && season.touched && season.error && <div style={errorTextStyle}>{season.error}</div>}
        {submitFailed && episode.touched && episode.error && <div style={errorTextStyle}>{episode.error}</div>}
        {submitFailed && episodeTitle.touched && episodeTitle.error && <div style={errorTextStyle}>{episodeTitle.error}</div>}
      </div>
    );
  }
}
