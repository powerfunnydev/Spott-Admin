import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { makeTextStyle, fontWeights, colors, errorTextStyle } from '../styles';
import Label from './_label';

@Radium
export default class FileInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange (e) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });
    this.props.input.onChange(e);
  }

  static styles = {
    container: {
      position: 'relative'
    },
    file: {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      width: '100%',
      zIndex: 1
    },
    padTop: {
      paddingTop: '1.25em'
    },
    text: {
      base: {
        border: `1px solid ${colors.lightGray2}`,
        borderRadius: 2,
        cursor: 'pointer',
        fontSize: '1em',
        width: '100%',
        paddingTop: 0,
        paddingBottom: 0,
        position: 'relative',
        zIndex: -1,
        lineHeight: '30px'
      },
      error: {
        color: colors.errorColor,
        border: `1px solid ${colors.errorColor}`
      },
      disabled: {
        backgroundColor: colors.lightGray,
        color: colors.darkerGray
      },
      text: {
        paddingLeft: '10px',
        paddingRight: '10px',
        fontSize: '0.688em',
        color: colors.veryDarkGray
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { accept, disabled, input, first, label, meta, placeholder, required, style } = this.props;

    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <div style={styles.container}>
        {/* Actual file input. */}
        <input
          {...input}
          accept={accept}
          style={styles.file}
          type='file'
          onChange={this.onChange} />

        {/* Emulated file input. */}
        <input
          placeholder={placeholder}
          style={[
            styles.text.base,
            disabled && styles.text.disabled,
            meta.touched && meta.error && styles.text.error,
            styles.text.text,
            style
          ]}
          tabIndex={-1}
          type='text'
          value={this.state.value}
          onChange={() => null} />
        </div>
      </div>
    );
  }
}
