import React, { Component } from 'react';
import TagContextMenu from './tagContextMenu';

require('../../../tagger/components/contextMenus/contextMenu.css');

export default class ContextMenus extends Component {

  render () {
    return (
      <div>
        <TagContextMenu />
      </div>
    );
  }

}
