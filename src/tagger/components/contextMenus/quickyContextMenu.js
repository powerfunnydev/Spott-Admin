import Radium from 'radium';
import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import menuItemStyle from './menuItemStyle';

const trashImage = require('./images/trash.svg');

@Radium
export default class QuickyContextMenu extends Component {

  onSelect (data) {
    switch (data.menuItem) {
      case 'delete':
        data.onRemove();
        break;
    }
  }

  render () {
    return (
      <ContextMenu identifier='quickiesBar-quicky'>
        <MenuItem data={{ menuItem: 'delete' }} onSelect={this.onSelect}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Delete</div>
        </MenuItem>
      </ContextMenu>
    );
  }

}
