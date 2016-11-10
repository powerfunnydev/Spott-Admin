import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';
import Dropdown, { styles as dropdownStyles } from '../dropdown';
/* eslint-disable no-alert */

const plusIcon = require('../../../../assets/images/plus-gray.svg');

@Radium
export class Tile extends Component {
  static propTypes={
    imageUrl: PropTypes.string,
    text: PropTypes.string,
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
      width: '184px',
      height: '103px'
    },
    dropdown: {
      position: 'absolute',
      top: '7px',
      right: '7px'
    },
    broadcastChannel: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '10px'
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
    }
  }

  render () {
    const { imageUrl, text, onCreate, onDelete, onEdit } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={styles.wrapper}>
        {onEdit &&
          <div>
            <div style={[ styles.imageContainer, styles.image ]}>
              {imageUrl && <img src={imageUrl} style={styles.image}/>}
              {!imageUrl && <div>No image</div>}
                <Dropdown style={styles.dropdown}>
                  {onEdit && <div key='onEdit' style={[ dropdownStyles.option ]} onClick={onEdit}>Edit</div>}
                  {onDelete && <div key='onDelete' style={[ dropdownStyles.option ]} onClick={onDelete}>Remove</div>}
                </Dropdown>
            </div>
            <div style={styles.broadcastChannel}>{text}</div>
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
