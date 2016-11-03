import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export class Headers extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children } = this.props;
    return (
      <div style={styles.row}>
        {children}
      </div>
    );
  }
}
