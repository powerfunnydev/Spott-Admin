import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle } from '../../_common/styles';

const checkIcon = require('../../../assets/images/check.svg');

@Radium
export default class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object,
    label: PropTypes.string,
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
    container: {
      alignItems: 'center',
      display: 'flex'
    },
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
    },
    label: {
      ...makeTextStyle(fontWeights.regular, '0.688em'),
      color: colors.darkGray2,
      paddingLeft: '0.75em'
    },
    padTop: {
      paddingTop: '1.25em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, first, input, label, style } = this.props;

    return (
      <div style={[ styles.container, !first && styles.padTop, style ]}>
        <span style={[ styles.checkbox, (checked || input && input.value) && styles.checked ]} onClick={this.onChange}>
          {(checked || input && input.value) && <img src={checkIcon}/>}</span>
          {label && <div style={styles.label}>{label}</div>}
      </div>
    );
  }
}
