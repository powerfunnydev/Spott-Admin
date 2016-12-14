import Radium from 'radium';
import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import menuItemStyle from './menuItemStyle';

const trashImage = require('./images/trash.svg');

@Radium
export default class MarkerContextMenu extends Component {

  onSelect (data) {
    switch (data.menuItem) {
      case 'copy':
        data.onCopy();
        break;
      case 'delete':
        data.onRemove();
        break;
      case 'edit':
        data.onEdit();
        break;
    }
  }

  render () {
    return (
      <ContextMenu identifier='sceneEditor-marker'>
        <MenuItem data={{ menuItem: 'copy' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Copy</div>
        </MenuItem>
        <MenuItem data={{ menuItem: 'edit' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Edit</div>
        </MenuItem>
        <MenuItem data={{ menuItem: 'delete' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Delete</div>
        </MenuItem>
      </ContextMenu>
    );
  }

}
