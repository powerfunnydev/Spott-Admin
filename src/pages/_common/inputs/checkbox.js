import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../_common/styles';

const checkIcon = require('../../../assets/images/check.svg');

@Radium
export class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func // Uses the field's onChange, and this one if provided.
  };

  static styles = {
    checkbox: {
      backgroundColor: colors.white,
      alignItems: 'center',
      border: `1px solid ${colors.darkGray}`,
      borderRadius: 2,
      cursor: 'pointer',
      display: 'flex',
      height: 14,
      justifyContent: 'center',
      width: 14
    },
    checked: {
      backgroundColor: colors.primaryBlue
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, onChange } = this.props;

    return (
      <span style={[ styles.checkbox, checked && styles.checked ]} onClick={onChange}>
        {checked && <img src={checkIcon}/>}</span>
    );
  }
}
