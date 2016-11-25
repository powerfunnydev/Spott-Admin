import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

const editIcon = require('../../../assets/images/edit.svg');

@Radium
export default class EditButton extends Component {

  static propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired
  };

  render () {
    const { style, onClick } = this.props;
    return (
      <button style={style} onClick={onClick}>
        <img src={editIcon}/>
      </button>
    );
  }
}
