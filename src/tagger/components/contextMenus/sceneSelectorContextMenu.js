import Radium from 'radium';
import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { downloadFile } from '../../../utils';
import menuItemStyle from './menuItemStyle';

const trashImage = require('./images/trash.svg');
const downloadImage = require('./images/download.svg');

@Radium
export default class SceneSelectorContextMenu extends Component {

  onPaste (data) {
    data.onPaste(data.sceneId);
  }

  onDownload (data) {
    downloadFile(data.sceneImage);
  }

  render () {
    return (
      <ContextMenu identifier='sceneSelector'>
        <MenuItem data={{ menuItem: 'paste' }} onSelect={this.onPaste}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${trashImage}')` } ]}>Paste</div>
        </MenuItem>
        <MenuItem data={{ menuItem: 'download' }} onSelect={this.onDownload}>
          <div style={[ menuItemStyle, { backgroundImage: `url('${downloadImage}')` } ]}>Download frame image</div>
        </MenuItem>
      </ContextMenu>
    );
  }

}
