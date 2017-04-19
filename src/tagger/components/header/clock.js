/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import colors from '../colors';

const clockImage = require('./images/clock.svg');
const pauseImage = require('./images/pause.svg');
const playImage = require('./images/play.svg');

@Radium
export default class Clock extends Component {

  static propTypes = {
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.onMouseEnter = ::this.onMouseEnter;
    this.onMouseLeave = ::this.onMouseLeave;
    this.onPauseClick = ::this.onPauseClick;
    this.onPlayClick = ::this.onPlayClick;
    this.state = {
      hover: false,
      milliseconds: 0,
      play: true
    };
    setInterval(() => {
      // Update the time if clock is ticking (play).
      if (this.state.play) {
        this.setState({
          ...this.state,
          milliseconds: this.state.milliseconds + 1000
        });
      }
    }, 1000);
  }

  pad (num) {
    return num < 10 ? `0${num}` : num.toString();
  }

  onMouseEnter () {
    this.setState({
      ...this.state,
      hover: true
    });
  }

  onMouseLeave () {
    this.setState({
      ...this.state,
      hover: false
    });
  }

  onPauseClick (e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      play: false
    });
  }

  onPlayClick (e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      play: true
    });
  }

  static styles = {
    button: {
      display: 'flex',
      padding: '6px 10px'
    },
    image: {
      display: 'flex',
      padding: 4
    },
    container: {
      base: {
        border: `1px solid ${colors.veryLightGray}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        height: 24,
        width: 24,
        transition: 'all 0.3s ease-out'
      },
      pause: {
        backgroundColor: colors.vividRed,
        border: `1px solid ${colors.vividRed}`
      },
      show: {
        width: 105,
        transition: 'all 0.3s ease-in'
      }
    },
    time: {
      base: {
        color: colors.black2,
        overflow: 'hidden',
        marginLeft: 4,
        fontSize: '14px',
        letterSpacing: 0.4,
        userSelect: 'all',
        width: 0,
        transition: 'all 0.3s ease-out'
      },
      show: {
        color: 'white',
        width: 105,
        transition: 'all 0.3s ease-in'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { hover, milliseconds, play } = this.state;
    const time = new Date(milliseconds);
    const show = hover || !play;

    return (
      <div style={[ styles.container.base, !play && styles.container.pause, show && styles.container.show, this.props.style ]} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {!show && <div style={styles.image}><img src={clockImage} /></div>}
        {show &&
          (play
            ? <button style={styles.button} title='Pause timer' onClick={this.onPauseClick}><img src={pauseImage} /></button>
            : <button style={styles.button} title='Resume timer' onClick={this.onPlayClick}><img src={playImage} /></button>)}
        <div style={[ styles.time.base, show && styles.time.show ]}>
          <span>{this.pad(time.getHours() - 1)}:{this.pad(time.getMinutes())}:{this.pad(time.getSeconds())}</span>
        </div>
      </div>
    );
  }

}
