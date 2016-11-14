import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { CustomCel } from './customCel';

@Radium
export class DropdownCel extends Component {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
  }

  static styles = {
    dropdown: {
      flex: '0 0 110px',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  render () {
    const { children, style } = this.props;
    const { styles } = this.constructor;
    return (
      <CustomCel style={[ styles.dropdown, style ]}>
        {children}
      </CustomCel>
    );
  }
}
