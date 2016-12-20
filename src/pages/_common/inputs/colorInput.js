/* eslint no-return-assign: 0 */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ColorPicker from 'react-colors-picker';
import { colors } from '../styles';
import Label from './_label';

import 'react-colors-picker/assets/index.css';
import './styles/colorPicker.css';

@Radium
export default class ColorInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    first: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange ({ color }) {
    this.props.input.onChange(color);
  }

  static styles = {
    padTop: {
      paddingTop: '1.25em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { disabled, first, input, label, labelStyle, required, style } = this.props;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} style={labelStyle} text={label} />}
        <div>
          {!disabled &&
            <ColorPicker
              alpha={100}
              animation='slide-up'
              color={input.value}
              placement='bottomRight'
              onChange={this.onChange} />}
          {disabled &&
            <span className='react-colorpicker'>
              <span className='react-colorpicker-trigger' style={{ backgroundColor: colors.lightGray4 }} unselectable='true' />
            </span>}
        </div>
      </div>
    );
  }

}
