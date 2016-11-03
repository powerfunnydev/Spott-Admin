import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { colors } from '../styles';

@Radium
export default class Line extends Component {

  static propTypes = {
    children: PropTypes.node,
    first: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.node
  };

  static styles = {
    line: {
      width: '100%',
      minHeight: '1px',
      backgroundColor: colors.lightGray2
    }
  }

  render () {
    const { styles } = this.constructor;
    const { style } = this.props;
    // Determine items
    return (
      <div style={[ styles.line, style ]}/>
    );
  }
}
