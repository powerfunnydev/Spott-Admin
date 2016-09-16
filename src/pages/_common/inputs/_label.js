import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../styles';

@Radium
export default class Label extends Component {

  static propTypes = {
    required: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.node.isRequired
  };

  static styles = {
    asterix: {
      color: colors.secondaryPink
    },
    container: {
      color: colors.darkerGray,
      display: 'block',
      fontSize: '16px',
      paddingBottom: '3px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { text, required, style, ...rest } = this.props;
    return (
      <label {...rest} style={[ styles.container, style ]}>{text} {required && <span style={styles.asterix}>*</span>}</label>
    );
  }

}
