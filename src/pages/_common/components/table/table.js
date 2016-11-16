import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';

@Radium
export class Table extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static propTypes = {
    style: PropTypes.object
  };

  static styles = {
    table: {
      border: `1px solid ${colors.lightGray3}`,
      borderRadius: '2px',
      backgroundColor: colors.white
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, style } = this.props;
    return (
      <div>
        <div style={[ styles.table, style ]}>
          {children}
        </div>
      </div>
    );
  }
}
