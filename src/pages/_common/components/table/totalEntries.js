import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, makeTextStyle, fontWeights } from '../../../_common/styles';

@Radium
export class TotalEntries extends Component {

  static propTypes = {
    totalResultCount: PropTypes.number.isRequired
  }

  static styles = {
    base: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      paddingBottom: '1.25em'
    },
    entries: {
      ...makeTextStyle(fontWeights.regular)
    },
    entity: {
      color: colors.veryDarkGray,
      textTransform: 'uppercase'
    },
    count: {
      color: '#536970'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { totalResultCount } = this.props;
    return (
      <div style={styles.base}>
        <span style={styles.entity}>Entries</span><span style={styles.count}>&nbsp;&nbsp;{totalResultCount} <span style={styles.entries}>Entries</span></span>
      </div>
    );
  }
}
