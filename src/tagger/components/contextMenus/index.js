import React, { Component } from 'react';
import MarkerContextMenu from './markerContextMenu';
import QuickyContextMenu from './quickyContextMenu';
import SceneSelectorContextMenu from './sceneSelectorContextMenu';
import SidebarCharacterContextMenu from './sidebarCharacterContextMenu';
import SidebarGlobalProductContextMenu from './sidebarGlobalProductContextMenu';
import SidebarProductContextMenu from './sidebarProductContextMenu';

require('./contextMenu.css');

export default class ContextMenus extends Component {

  render () {
    return (
      <div>
        <MarkerContextMenu />
        <QuickyContextMenu />
        <SceneSelectorContextMenu />
        <SidebarCharacterContextMenu />
        <SidebarGlobalProductContextMenu />
        <SidebarProductContextMenu />
      </div>
    );
  }

}
