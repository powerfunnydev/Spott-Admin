import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { Checkbox } from '../../inputs/checkbox';

@Radium
export class CheckBoxCel extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  static styles = {
    cell: {
      alignItems: 'center',
      display: 'flex',
      minHeight: '2.625em',
      justifyContent: 'center',
      flex: '0 0  56px'
    }
  }

  render () {
    const { checked, style, onChange } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={[ styles.cell, style ]}>
        <Checkbox checked={checked} onChange={onChange}/>
        {/* <input checked={checked} type='checkbox' onClick={(e) => { onChange(); }}/>*/}
      </div>
    );
  }
}
