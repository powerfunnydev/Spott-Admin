import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';

const gridGrayIcon = require('../../../../assets/images/grid-gray.svg');
const gridBlueIcon = require('../../../../assets/images/grid-blue.svg');
const listGrayIcon = require('../../../../assets/images/list-gray.svg');
const listBlueIcon = require('../../../../assets/images/list-blue.svg');
@Radium
export default class DisplayMode extends Component {

  static propTypes = {
    display: PropTypes.string,
    onChangeDisplay: PropTypes.func.isRequired
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: '2px',
      backgroundColor: colors.white,
      border: `solid 1px ${colors.lightGray2}`
    },
    center: {
      height: '30px',
      width: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageList: {
      width: '12px',
      height: '10px'
    },
    imageGrid: {
      width: '10px',
      height: '10px'
    },
    notFirst: {
      borderLeft: `solid 1px ${colors.lightGray2}`
    },
    clickable: {
      cursor: 'pointer'
    }
  }

  render () {
    const { display, onChangeDisplay } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        { onChangeDisplay && <div style={styles.row}>
          <div style={[ styles.center, onChangeDisplay && styles.clickable ]} onClick={onChangeDisplay.bind(this, 'list')}>
            <img src={(display === undefined || display === 'list') ? listBlueIcon : listGrayIcon} style={styles.imageList}/>
          </div>
          <div style={[ styles.center, onChangeDisplay && styles.clickable, styles.notFirst ]} onClick={onChangeDisplay.bind(this, 'grid')}>
            <img src={(display === 'grid') ? gridBlueIcon : gridGrayIcon} style={styles.imageGrid}/>
          </div>
        </div>}
      </div>
    );
  }
}
