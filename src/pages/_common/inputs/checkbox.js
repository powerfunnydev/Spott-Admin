import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle } from '../styles';
import CheckedSVG from '../images/completed';

let counter = 0;
function newId () {
  return `checkbox${counter++}`;
}

@Radium
export default class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    color: PropTypes.string,
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
    this.props.onChange && this.props.onChange(!input.valu);
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
      minHeight: '14px',
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
    },
    blueCheckbox: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.primaryBlue}`
    },
    blueChecked: {
      border: `1px solid ${colors.primaryBlue}`,
      backgroundColor: colors.white,
      ':hover': {
        backgroundColor: colors.blue3
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, color, first, input, label, style } = this.props;

    // return (
    //   <div style={[ styles.container, !first && styles.padTop, style ]}>
    //     <span style={[ styles.checkbox, (checked || input && input.value) && styles.checked ]} onClick={this.onChange}>
    //       {(checked || input && input.value) && <img src={checkIcon}/>}</span>

    return (
      <div key={newId()} style={[ styles.container, !first && styles.padTop, style ]}>
        <span
          style={[
            styles.checkbox,
            // overwrite styles.checkbox
            color === 'blue' && styles.blueCheckbox,
            (checked || input && input.value) && styles.checked,
            // overwrite styles.checked
            color === 'blue' && (checked || input && input.value) && styles.blueChecked
          ]}
          onClick={this.onChange}>
          {(checked || input && input.value) && <CheckedSVG color={color === 'blue' && colors.primaryBlue || colors.white}/>}
        </span>
        {label && <div style={styles.label}>{label}</div>}
      </div>
    );
  }
}
