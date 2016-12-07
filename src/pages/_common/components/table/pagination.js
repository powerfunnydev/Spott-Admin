import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';
import { generalStyles } from './index';

const arrowGray = require('../../../../assets/images/arrow-gray.svg');
const arrowLightGray = require('../../../../assets/images/arrow-light-gray.svg');

@Radium
export class Pagination extends Component {

  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onLeftClick: PropTypes.func.isRequired,
    onRightClick: PropTypes.func.isRequired
  };

  static styles = {
    pagination: {
      marginTop: '1.875em',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '11.875em',
      height: '1.875em',
      display: 'flex',
      flexDirection: 'row',
      border: `solid 1px ${colors.lightGray2}`,
      backgroundColor: colors.white
    },
    smallButton: {
      width: '2.5em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    },
    middle: {
      fontSize: '0.75em',
      width: '100%',
      borderLeft: `solid 1px ${colors.lightGray2}`,
      borderRight: `solid 1px ${colors.lightGray2}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    gray: {
      color: colors.darkGray2
    }
  }
  render () {
    const { styles } = this.constructor;
    // currentPage is not an index. First page is 1, not 0.
    const { currentPage, pageCount, onLeftClick, onRightClick } = this.props;
    return (
      <div style={styles.pagination}>
        <div style={styles.smallButton} onClick={(currentPage > 1) && onLeftClick}>
          {(currentPage > 1) && <img src={arrowGray} style={generalStyles.arrowLeft}/>}
          {(currentPage <= 1) && <img src={arrowLightGray} style={generalStyles.arrowLeft}/>}
        </div>
        <div style={styles.middle}>
          <span>{currentPage} <span style={styles.gray}> of {pageCount || 1}</span></span>
        </div>
        <div style={styles.smallButton} onClick={(currentPage < pageCount) && onRightClick}>
          {(currentPage < pageCount) && <img src={arrowGray} style={generalStyles.arrowRight}/>}
          {(currentPage >= pageCount) && <img src={arrowLightGray} style={generalStyles.arrowRight}/>}
        </div>
      </div>
    );
  }
}
