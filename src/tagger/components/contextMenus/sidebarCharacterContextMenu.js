import Radium from 'radium';
import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import menuItemStyle from './menuItemStyle';

const trashImage = require('./images/trash.svg');

@Radium
export default class SidebarCharacterContextMenu extends Component {

  onSelect (data) {
    console.warn(`Clicked on menu ${data.menuItem} on ${data.appearanceId}`);
    switch (data.menuItem) {
      case 'copy':
        data.onCopy(data.appearanceId);
        break;
      case 'delete':
        data.onRemove(data.appearanceId);
        break;
    }
  }

  render () {
    return (
      <ContextMenu identifier='sidebar-character'>
        <MenuItem data={{ menuItem: 'copy' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Copy</div>
        </MenuItem>
        <MenuItem data={{ menuItem: 'delete' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Remove from frame</div>
        </MenuItem>
      </ContextMenu>
    );
  }

}
