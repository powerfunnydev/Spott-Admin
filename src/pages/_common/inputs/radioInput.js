import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { colors } from '../styles';
import Label from './_label';

@Radium
export default class RadioInput extends Component {

  static propTypes = {
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    // Array with value and label.
    options: PropTypes.array.isRequired,
    optionsStyle: PropTypes.object,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func // Uses the field's onChange, and this one if provided.
  };

  onClick (value, e) {
    e.preventDefault();
    this.props.input.onChange(value);

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  }

  static styles = {
    padTop: {
      paddingTop: '1.25em'
    },
    container: {
      display: 'flex',
      paddingTop: '0.625em'
    },
    input: {
      cursor: 'pointer',
      opacity: 0,
      position: 'absolute'
    },
    radioButton: {
      borderRadius: 8,
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: '30px',
      height: 16,
      width: 16
    },
    label: {
      cursor: 'pointer',
      display: 'inline-block',
      fontFamily: 'Rubik-Regular',
      fontSize: '13px',
      marginRight: 25,
      paddingLeft: 15
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { first, input, label, labelStyle, options, optionsStyle, required, style } = this.props;

    const inputValue = input.value || false;

    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} style={labelStyle} text={label}/>}
        <div style={optionsStyle}>
          {options.map(({ label, value }, i) => {
            const onClick = this.onClick.bind(this, value);
            const checked = inputValue === value;

            const radioButtonStyle = [ styles.radioButton ];
            const labelStyle = [ styles.label ];

            if (checked) {
              radioButtonStyle.push({
                boxShadow: `inset 0px 0px 0px 4px ${colors.primaryBlue}`,
                backgroundColor: 'white'
              });
              labelStyle.push({ color: 'rgb(45, 48, 50)' });
            } else {
              radioButtonStyle.push({
                backgroundColor: 'white',
                border: `solid 1px ${colors.lightGray2}`
              });
              labelStyle.push({ color: colors.darkGray2 });
            }

            return (
              <label key={i} style={styles.container}>
                <input
                  checked={checked}
                  id={i}
                  style={styles.input}
                  type='radio'
                  onChange={onClick} />
                <span style={radioButtonStyle} onClick={onClick} />
                <span htmlFor={i} style={labelStyle} onClick={onClick}>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

    );
  }
}
