import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle } from '../styles';

@Radium
export default class ProgressBar extends Component {

  static propTypes = {
    progress: PropTypes.number.isRequired,
    style: PropTypes.object,
    total: PropTypes.number.isRequired
  }

  static styles = {
    container: {
      position: 'relative'
    },
    backgroundDiv: {
      position: 'absolute',
      width: '100%',
      height: '8px',
      borderRadius: '100px',
      backgroundColor: colors.lightGray4,
      border: `solid 1px ${colors.lightGray2}`
    },
    progressDiv: {
      position: 'absolute',
      width: '25%',
      height: '8px',
      borderRadius: '100px',
      backgroundColor: colors.primaryBlue,
      border: `solid 1px ${colors.primaryBlue}`,
      transition: 'width .5s ease'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '12px'),
      fontWeight: 500,
      color: colors.darkGray2,
      textAlign: 'center',
      paddingBottom: '10px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { progress, style, total } = this.props;
    const percentage = (progress / total) * 100;

    return (
      <div style={style} title={`${Math.round(((total - progress) * 100) / (1024 * 1024)) / 100} MiB remaining - ${Math.round(percentage * 100) / 100}% completed`}>
        <div style={styles.title}>Uploading file...</div>
        <div style={styles.container}>
          <div style={styles.backgroundDiv}/>
          {progress !== 0 && <div style={[ styles.progressDiv, { width: `${percentage}%` } ]}/>}
        </div>
      </div>
    );
  }
}
