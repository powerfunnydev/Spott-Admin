import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, makeTextStyle, fontWeights } from '../../../_common/styles';
import Dropdown, { styles as dropdownStyles } from '../actionDropdown';
/* eslint-disable no-alert */

const plusIcon = require('../../../../assets/images/plus-gray.svg');

@Radium
export class Tile extends Component {
  static propTypes={
    deleteText: PropTypes.string,
    imageUrl: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
    onCreate: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
  }

  constructor (props) {
    super(props);
  }

  static styles = {
    imageContainer: {
      position: 'relative',
      height: '103px',
      borderRadius: '2px',
      // backgroundColor: colors.lightGray5,
      border: `solid 1px ${colors.veryLightGray}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      objectFit: 'scale-down',
      width: '184px',
      height: '103px'
    },
    dropdown: {
      position: 'absolute',
      top: '7px',
      right: '7px'
    },
    title: {
      textAlign: 'center',
      paddingTop: '10px',
      ...makeTextStyle(fontWeights.regular, '12px', '0.5px'),
      color: colors.black2,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    darkGray: {
      border: `solid 1px ${colors.lightGray2}`
    },
    clickable: {
      cursor: 'pointer'
    },
    wrapper: {
      display: 'inline-block',
      paddingRight: '24px',
      paddingBottom: '24px'
    },
    noImage: {
      ...makeTextStyle(fontWeights.regular, '11px', '0.4px'),
      color: colors.lightGray3
    },
    width: {
      width: '184px'
    }
  }

  render () {
    const { imageUrl, text, onCreate, deleteText, onDelete, onEdit, onClick } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={styles.wrapper}>
        {onEdit &&
          <div style={styles.width}>
            <div style={[ styles.imageContainer, styles.image, onClick && styles.clickable ]} onClick={onClick}>
              {imageUrl && <img src={imageUrl} style={styles.image} />}
              {!imageUrl && <div style={styles.noImage}>No image</div>}
              <Dropdown style={styles.dropdown}>
                {onEdit && <div key='onEdit' style={dropdownStyles.floatOption} onClick={(e) => { e.stopPropagation(); onEdit(e); }}>Edit</div>}
                {onEdit && onDelete && <div style={dropdownStyles.line}/>}
                {onDelete && <div key='onDelete' style={dropdownStyles.floatOption} onClick={(e) => { e.stopPropagation(); onDelete(e); }}>{deleteText || 'Remove'}</div>}
              </Dropdown>
            </div>
            <div style={styles.title}>{text}</div>
          </div>
        }
        {onCreate &&
          <div style={[ styles.imageContainer, styles.image, styles.darkGray, styles.clickable ]} onClick={onCreate}>
            <img src={plusIcon}/>
          </div>
        }
      </div>
    );
  }
}
