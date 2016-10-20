import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

const requiredImage = require('./images/required.svg');

@Radium
export default class Label extends Component {

  static propTypes = {
    required: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.node
  };

  static styles = {
    asterix: {
      marginLeft: '0.313em',
      verticalAlign: 'middle'
    },
    container: {
      color: '#536970',
      display: 'block',
      fontSize: '0.625em',
      paddingBottom: '0.625em',
      textTransform: 'uppercase'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { text, required, style, ...rest } = this.props;
    return (
      <label {...rest} style={[ styles.container, style ]}>
        {text || '\u00a0'} {required && <img src={requiredImage} style={styles.asterix} />}
      </label>
    );
  }

}
