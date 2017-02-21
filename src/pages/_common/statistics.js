import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class Statistics extends Component {

  static propTypes = {
    blocks: PropTypes.array.isRequired
  };

  static styles = {
    root: {
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '13px'
    },
    statistic: {
      width: '184px',
      height: '70px',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      border: 'solid 1px #ced6da',
      display: 'inline-block',
      margin: '12px',
      vereticalAlign: 'top'
    },
    statcontent: {
      height: '28px',
      fontFamily: 'Rubik-Medium',
      fontSize: '24px',
      fontWeight: '500',
      letterSpacing: '0.7px',
      marginTop: '10px',
      textAlign: 'center'
    },
    stattitle: {
      height: '14px',
      fontFamily: 'Rubik',
      fontSize: '12px',
      letterSpacing: '0.5px',
      marginTop: '8px',
      textAlign: 'center',
      color: '#aab5b8'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { blocks } = this.props;

    return (
      <div style={styles.root}>
      { (blocks || []).map((block, index) =>
          <div key={index} style={styles.statistic}>
            <div style={[ styles.statcontent, { color: block.color } ]}>
              {block.content}
            </div>
            <div style={styles.stattitle}>
              {block.title}
            </div>
          </div>
      )}
      </div>
    );
  }
}
