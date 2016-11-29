import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, makeTextStyle, fontWeights } from '../../../_common/styles';
import BulkOperationDropdown from './bulkOperationDropdown';

@Radium
export class TotalEntries extends Component {

  static propTypes = {
    entityType: PropTypes.string.isRequired,
    numberSelected: PropTypes.number,
    totalResultCount: PropTypes.number.isRequired,
    onDeleteSelected: PropTypes.func
  };

  static styles = {
    base: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '20px'
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
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: '1.25em'
    },
    paddingLeft: {
      paddingLeft: '10px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { onDeleteSelected, numberSelected, entityType, totalResultCount } = this.props;
    return (
      <div style={styles.row}>
        <div style={styles.base}>
          <span style={styles.entity}>{entityType}</span><span style={styles.count}>&nbsp;&nbsp;{totalResultCount} <span style={styles.entries}>Entries</span></span>
        </div>
        <div style={styles.paddingLeft}>
          <BulkOperationDropdown numberSelected={numberSelected} onDeleteSelected={onDeleteSelected}/>
        </div>
      </div>
    );
  }
}
