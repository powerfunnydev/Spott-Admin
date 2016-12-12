import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Dropdown, { styles as dropdownStyles } from './actionDropdown';
import { downloadFile } from '../../../utils';

@Radium
export class ImageWithDropdown extends Component {
  static propTypes={
    downloadUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  constructor (props) {
    super(props);
  }

  static styles = {
    root: {
      position: 'relative'
    },
    dropdown: {
      position: 'absolute',
      top: 10,
      right: 10
    },
    imageContainer: {
      marginRight: '20px',
      marginBottom: '20px'
    },
    image: {
      objectFit: 'contain',
      height: '180px',
      borderRadius: '2px'
    }
  }

  render () {
    const { downloadUrl, imageUrl, onDelete } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={[ styles.root, styles.imageContainer ]}>
        <img src={imageUrl} style={styles.image} />
        { (downloadUrl || onDelete) && <Dropdown style={styles.dropdown}>
          {downloadUrl && <div key='downloadImage' style={dropdownStyles.floatOption} onClick={(e) => { downloadFile(downloadUrl); }}>Download</div>}
          {downloadUrl && onDelete && <div style={dropdownStyles.line}/>}
          {onDelete && <div key='onDelete' style={dropdownStyles.floatOption} onClick={(e) => { onDelete(e); }}>Remove</div>}
        </Dropdown> }
      </div>
    );
  }
}
