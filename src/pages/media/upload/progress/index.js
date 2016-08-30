import React, { Component, PropTypes } from 'react';
// import { buttonStyles } from '../../_common/styles';

// TODO: support for cancelling an upload in progress
// TODO: known bug: pressing back while uploading does not cancel the pending upload
// TODO: also wait for processing to be done
export default class Progress extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    remainingTime: PropTypes.number // In seconds. May be null (unknown).
    // onCancel: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    // this.onCancel = ::this.onCancel;
  }

  // onCancel (e) {
  //   e.preventDefault();
  //   this.props.onCancel();
  // }

  static styles = {
    text: {
      color: 'white',
      fontFamily: 'Rubik-Light'
    },
    title: {
      base: {
        fontSize: '35px',
        marginBottom: 10,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      name: {
        fontFamily: 'Rubik-Bold'
      }
    },
    progress: {
      fontSize: '70px',
      fontFamily: 'Rubik-Regular'
    },
    remaining: {
      fontSize: '20px',
      marginBottom: 30
    }
  }

  render () {
    const { name, progress, remainingTime } = this.props;
    const styles = this.constructor.styles;

    // Determine "remaining time" string. This string includes a trailing space.
    let remainingTimeString = '';
    if (remainingTime) {
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime - (hours * 3600)) / 60);
      const seconds = remainingTime - (hours * 3600) - (minutes * 60);
      switch (hours) {
        case 0: remainingTimeString = ''; break;
        case 1: remainingTimeString += '1 hour '; break;
        default: remainingTimeString += `${hours} hours `; break;
      }
      switch (minutes) {
        case 0: remainingTimeString = ''; break;
        case 1: remainingTimeString += '1 minute '; break;
        default: remainingTimeString += `${minutes} minutes `; break;
      }
      switch (seconds) {
        case 1: remainingTimeString += '1 second '; break;
        default: remainingTimeString += `${seconds} seconds `; break;
      }
    } else {
      remainingTimeString = 'Unknown time ';
    }

    return (
      <div style={styles.text}>
        <div style={styles.title.base}>Uploading <span style={styles.title.name}>{name}</span>...</div>
        <div style={styles.progress}>{progress}%</div>
        <div style={styles.remaining}>{remainingTimeString}remaining</div>
        <div>
          {/* <button style={[ buttonStyles.base, buttonStyles.first, buttonStyles.bordered ]} onClick={this.onCancel}>Cancel</button> */}
        </div>
      </div>
    );
  }
}
