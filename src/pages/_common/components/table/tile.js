import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';
import Dropdown, { styles as dropdownStyles } from '../dropdown';

const plusIcon = require('../../../../assets/images/plus-gray.svg');

@Radium
export class Tile extends Component {
  static propTypes={
    imageUrl: PropTypes.string,
    text: PropTypes.string,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func
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
    }
  }
  render () {
    const { imageUrl, text, onCreate, onEdit } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={{ display: 'inline-block', paddingRight: '24px', paddingBottom: '24px' }}>
        {onEdit &&
          <div>
            <div style={[ styles.imageContainer, styles.image ]}>
              {imageUrl && <img src={imageUrl} style={styles.image}/>}
              {!imageUrl && <div>No image</div>}
                <Dropdown style={styles.dropdown}>
                  <div key={1} style={[ dropdownStyles.option ]} onClick={onEdit}>Edit</div>
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
