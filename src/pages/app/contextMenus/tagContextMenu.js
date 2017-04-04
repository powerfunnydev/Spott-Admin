import React, { Component } from 'react';
import Radium from 'radium';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import menuItemStyle from '../../../tagger/components/contextMenus/menuItemStyle';

const trashImage = require('../../../tagger/components/contextMenus/images/trash.svg');

@Radium
export default class TagContextMenu extends Component {

  onSelect (data) {
    switch (data.menuItem) {
      case 'edit':
        data.onEdit(data.appearanceId);
        break;
      case 'delete':
        data.onRemove(data.appearanceId);
        break;
    }
  }

  render () {
    return (
      <ContextMenu identifier='TEST'>
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
