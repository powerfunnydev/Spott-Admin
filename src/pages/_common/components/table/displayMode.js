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
    onChangeDisplay: PropTypes.func
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: colors.white
    },
    first: {
      borderTopLeftRadius: '2px',
      borderBottomLeftRadius: '2px'
    },
    last: {
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px'
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
      marginLeft: '-1px'
    },
    clickable: {
      cursor: 'pointer',
      border: `solid 1px ${colors.lightGray2}`,
      ':hover': {
        border: `solid 1px ${colors.lightGray3}`,
        zIndex: 4
      },
      ':active': {
        backgroundColor: colors.lightGray4
      }
    },
    paddingLeft: {
      paddingLeft: '30px'
    }
  }

  render () {
    const { display, onChangeDisplay } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={styles.paddingLeft}>
        { onChangeDisplay && <div style={styles.row}>
          <div key='list' style={[ styles.center, onChangeDisplay && styles.clickable, styles.first ]} onClick={onChangeDisplay.bind(this, 'list')}>
            <img src={(display === undefined || display === 'list') ? listBlueIcon : listGrayIcon} style={styles.imageList}/>
          </div>
          <div key='grid' style={[ styles.center, onChangeDisplay && styles.clickable, styles.last, styles.notFirst ]} onClick={onChangeDisplay.bind(this, 'grid')}>
            <img src={(display === 'grid') ? gridBlueIcon : gridGrayIcon} style={styles.imageGrid}/>
          </div>
        </div>}
      </div>
    );
  }
}
