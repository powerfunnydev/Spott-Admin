import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { makeTextStyle, fontWeights, colors, errorTextStyle } from '../styles';
import Label from './_label';

@Radium
export default class FileInput extends Component {

  static propTypes = {
    accept: PropTypes.string,
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
    e.preventDefault();
    // Convert files to an array.
    const [ file = null ] = [ ...e.target.files ];
    this.props.input.onChange(file);
  }

  static styles = {
    container: {
      position: 'relative'
    },
    file: {
      cursor: 'pointer',
      left: 0,
      lineHeight: '32px', // + border
      opacity: 0, // Hide the actual file input.
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1
    },
    padTop: {
      paddingTop: '1.25em'
    },
    text: {
      button: {
        base: {
          ...makeTextStyle(fontWeights.regular, '0.75em', 0, '30px'),
          width: 80,
          textAlign: 'center',
          color: colors.darkGray2,
          border: `1px solid ${colors.lightGray2}`,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          marginLeft: -1
        },
        error: {
          border: `1px solid ${colors.errorColor}`
        }
      },
      container: {
        display: 'flex',
        position: 'relative'
      },
      input: {
        border: `1px solid ${colors.lightGray2}`,
        borderBottomLeftRadius: 2,
        borderTopLeftRadius: 2,
        cursor: 'pointer',
        fontSize: '1em',
        lineHeight: '30px',
        paddingBottom: 0,
        paddingTop: 0,
        textOverflow: 'ellipsis',
        width: '100%'
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
            accept={accept}
            style={styles.file}
            type='file'
            onChange={this.onChange} />

          {/* Emulated file input. */}
          <div style={styles.text.container}>
            <input
              placeholder={placeholder}
              style={[
                styles.text.input,
                disabled && styles.text.disabled,
                meta.touched && meta.error && styles.text.error,
                styles.text.text,
                style
              ]}
              tabIndex={-1}
              type='text'
              value={(input.value && input.value.name) || ''}
              onChange={() => null} />
            <div style={[ styles.text.button.base, meta.touched && meta.error && styles.text.button.error ]}>
              Browse...
            </div>
          </div>
        </div>
        {meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }
}
