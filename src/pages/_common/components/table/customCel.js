import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../../_common/styles';
import { generalStyles, NONE, ASC, DESC } from './index';

const arrowGray = require('../../../../assets/images/arrow-gray.svg');

/**
 * This component renders only children or a value by mean of getValue and objectToRender.
 * Don't pass both to this component.
 */
@Radium
export class CustomCel extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentStyle: PropTypes.any,
    getValue: PropTypes.func,
    objectToRender: PropTypes.object,
    sortColumn: PropTypes.func,
    sortDirection: PropTypes.number,
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  static styles = {
    cell: {
      wordBreak: 'break-word',
      alignItems: 'center',
      color: colors.darkGray2,
      display: 'flex',
      fontSize: '0.75em',
      paddingLeft: '1em',
      paddingRight: '1em',
      minHeight: 40,
      paddingTop: '0.5em',
      paddingBottom: '0.5em',
      minWidth: 0
    },
    pointer: {
      cursor: 'pointer'
    },
    headerSelected: {
      color: colors.darkGray3,
      backgroundColor: colors.veryLightGray
    },
    arrowRight: {
      marginLeft: 'auto',
      marginRight: '1.063em'
    },
    clickable: {
      color: colors.veryDarkGray
    },
    inlineFlex: {
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, contentStyle, style, getValue, objectToRender, onClick, sortColumn, sortDirection } = this.props;

    return (
      <div style={[ styles.cell, (sortColumn || onClick) && styles.pointer,
        sortDirection && sortDirection !== NONE && styles.headerSelected,
        onClick && styles.clickable, style ]} onClick={sortColumn || onClick}>
        <div style={[ styles.inlineFlex, contentStyle ]}>
          {children}
          {getValue && objectToRender && getValue(objectToRender)}
        </div>
        { (sortDirection === ASC || sortDirection === DESC) && <div style={styles.arrowRight}>
          {sortDirection === ASC && <img src={arrowGray}/>}
          {sortDirection === DESC && <img src={arrowGray} style={generalStyles.arrowUnder} />}
        </div>}
      </div>
    );
  }
}
