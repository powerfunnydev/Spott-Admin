import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Toggle from 'react-toggle';
import { colors, fontWeights, makeTextStyle } from '../styles';

require('./styles/toggleInputStyle.css');

let counter = 0;
function newId () {
  return `toggle${counter++}`;
}

@Radium
export default class ToggleInput extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    // Input is optional, only used with redux-form.
    input: PropTypes.object,
    label: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func // Uses the field's onChange, and this one if provided.
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange (e) {
    e.preventDefault();
    e.stopPropagation();
    const { input } = this.props;
    this.props.onChange && this.props.onChange(input && !input.value);
    if (input && input.onChange) {
      input.onChange(!input.value);
    }
  }

  static styles = {
    container: {
      alignItems: 'center',
      display: 'flex',
      zIndex: 13
    },
    label: {
      ...makeTextStyle(fontWeights.regular, '0.688em'),
      color: colors.darkGray2,
      paddingLeft: '0.75em'
    },
    padTop: {
      paddingTop: '1.25em'
    },
    disabled: {
      opacity: 0.5
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, disabled, first, input, label, style } = this.props;

    return (
      <div key={newId()} style={[ styles.container, !first && styles.padTop, style ]}>
        <Toggle
          defaultChecked={(checked || input && input.value)}
          icons={false}
          onChange={this.onChange} />
        {label && <div style={[ styles.label, disabled && styles.disabled ]}>{label}</div>}
      </div>
    );
  }
}
