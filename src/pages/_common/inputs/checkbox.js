import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../_common/styles';

const checkIcon = require('../../../assets/images/check.svg');

@Radium
export class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    input: PropTypes.object,
    style: PropTypes.object,
    onChange: PropTypes.func // Uses the field's onChange, and this one if provided.
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange () {
    const { input } = this.props;
    this.props.onChange && this.props.onChange();
    if (input && input.onChange) {
      input.onChange(!input.value);
    }
  }

  static styles = {
    checkbox: {
      backgroundColor: colors.white,
      alignItems: 'center',
      border: `1px solid ${colors.darkGray}`,
      borderRadius: '2px',
      cursor: 'pointer',
      display: 'flex',
      height: '14px',
      justifyContent: 'center',
      minWidth: '14px',
      ':hover': {
        backgroundColor: colors.lightBlue
      }
    },
    checked: {
      border: `1px solid ${colors.primaryBlue}`,
      backgroundColor: colors.primaryBlue,
      ':hover': {
        backgroundColor: colors.blue3
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, input, style } = this.props;

    return (
      <div style={style}>
        <span style={[ styles.checkbox, (checked || input && input.value) && styles.checked ]} onClick={this.onChange}>
          {(checked || input && input.value) && <img src={checkIcon}/>}</span>
      </div>
    );
  }
}
