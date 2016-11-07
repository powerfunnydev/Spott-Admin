import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';

@Radium
export class Row extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number,
    isFirst: PropTypes.bool
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: colors.white
    },
    borderRow: {
      borderTop: `1px solid ${colors.veryLightGray}`
    },
    odd: {
      backgroundColor: 'rgba(230, 248, 253, 0.2)',
      transition: 'background-color .25s ease-in-out',
      ':hover': {
        backgroundColor: colors.lightBlue
      }
    },
    even: {
      backgroundColor: colors.white,
      transition: 'background-color .25s ease-in-out',
      ':hover': {
        backgroundColor: colors.lightGray4
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, isFirst, index } = this.props;
    return (
      <div style={[ styles.row, (!isFirst) && styles.borderRow, index && index % 2 === 1 ? styles.odd : styles.even ]}>
        {children}
      </div>
    );
  }
}
