import Radium from 'radium';
import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import menuItemStyle from './menuItemStyle';

const trashImage = require('./images/trash.svg');

@Radium
export default class SidebarGlobalProductContextMenu extends Component {

  onSelect (data) {
    console.warn(`Clicked on menu ${data.menuItem} on ${data.appearanceId}`);
    switch (data.menuItem) {
      case 'delete':
        data.onRemove(data.appearanceId);
        break;
    }
  }

  render () {
    return (
      <ContextMenu identifier='sidebar-global-product'>
        <MenuItem data={{ menuItem: 'delete' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Remove from frame</div>
        </MenuItem>
      </ContextMenu>
    );
  }

}
