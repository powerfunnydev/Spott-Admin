import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../_common/styles';
import Spinner from '../../_common/spinner';

const arrowGray = require('../../../assets/images/arrow-gray.svg');
const arrowLightGray = require('../../../assets/images/arrow-light-gray.svg');
const check = require('../../../assets/images/check.svg');

const generalStyles = {
  arrowUnder: { transform: 'rotateZ(180deg)' },
  arrowLeft: { transform: 'rotateZ(270deg)' },
  arrowRight: { transform: 'rotateZ(90deg)' }
};

export const sortDirections = {
  ASC: 1,
  DESC: 2
};
export const NONE = 0;
export const ASC = 1;
export const DESC = 2;

export function directionToString (direction) {
  if (direction === ASC) {
    return 'ASC';
  } else if (direction === DESC) {
    return 'DESC';
  }
  return '';
}

export function determineSortDirection (sortField, query) {
  let sortDirection = NONE;
  if (query.sortField === sortField && query.sortDirection) {
    // map string to number
    sortDirection = sortDirections[query.sortDirection];
  }
  return directionToString((sortDirection + 1) % 3);
}

@Radium
export default class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func // Uses the field's onChange, and this one if provided.
  };

  constructor (props) {
    super(props);
  }

  static styles = {
    checkbox: {
      height: 14,
      width: 14,
      border: `1px solid ${colors.darkGray}`,
      borderRadius: 2,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    checked: {
      backgroundColor: colors.primaryBlue
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, onChange } = this.props;

    return (
      <span style={[ styles.checkbox, checked && styles.checked ]} onClick={() => { console.log('test'); onChange(); }}>
        {checked && <img src={check}/>}</span>
    );
  }
}

@Radium
export class CheckBoxCel extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  static styles = {
    cel: {
      height: '42px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  render () {
    const { checked, style, onChange } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={[ styles.cel, style ]}>
        <Checkbox checked={checked} onChange={onChange}/>
        {/* <input checked={checked} type='checkbox' onClick={(e) => { onChange(); }}/>*/}
      </div>
    );
  }
}

/**
 * This component renders only children or a value by mean of getValue and objectToRender.
 * Don't pass both to this component.
 */
@Radium
export class TextCel extends Component {

  static propTypes = {
    children: PropTypes.node,
    getValue: PropTypes.func,
    objectToRender: PropTypes.object,
    sortColumn: PropTypes.func,
    sortDirection: PropTypes.number,
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  static styles = {
    cel: {
      paddingLeft: '16px',
      display: 'flex',
      alignItems: 'center',
      height: '40px',
      fontSize: '12px',
      color: colors.darkGray2
    },
    pointer: {
      cursor: 'pointer'
    },
    headerSelected: {
      backgroundColor: colors.veryLightGray
    },
    arrowRight: {
      marginLeft: 'auto',
      marginRight: '17px'
    },
    clickable: {
      color: colors.veryDarkGray
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, style, getValue, objectToRender, onClick, sortColumn, sortDirection } = this.props;

    return (
      <div style={[ styles.cel, style, (sortColumn || onClick) && styles.pointer,
            sortDirection && sortDirection !== NONE && styles.headerSelected,
            onClick && styles.clickable ]} onClick={sortColumn || onClick}>
        <div>
          {children}
          {getValue && objectToRender && getValue(objectToRender)}
        </div>
        <div style={styles.arrowRight}>
          {sortDirection === ASC && <img src={arrowGray}/>}
          {sortDirection === DESC && <img src={arrowGray} style={generalStyles.arrowUnder} />}
        </div>
      </div>
    );
  }
}

@Radium
export class Headers extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children } = this.props;
    return (
      <div style={styles.row}>
        {children}
      </div>
    );
  }
}

@Radium
export class Row extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number,
    isFirst: PropTypes.bool
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: colors.white
    },
    borderRow: {
      borderTop: `1px solid ${colors.veryLightGray}`
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, isFirst, index } = this.props;
    return (
      <div style={[ styles.row, (!isFirst) && styles.borderRow, index && index % 2 === 1 && { backgroundColor: colors.lightBlue } ]}>
        {children}
      </div>
    );
  }
}

@Radium
export class Rows extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool
  }

  static styles = {
    rows: {
      position: 'absolute',
      display: 'flex',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'gray',
      opacity: 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  render () {
    const { children, isLoading } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={{ position: 'relative', minHeight: '84px' }}>
        {isLoading &&
          <div style={styles.rows}>
           <Spinner style={{ height: '30px', width: '30px' }}/>
          </div>
        }
        {children}
      </div>
    );
  }
}

@Radium
export class Pagination extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onLeftClick: PropTypes.func.isRequired,
    onRightClick: PropTypes.func.isRequired
  }
  static styles = {
    pagination: {
      marginTop: '30px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '190px',
      height: '30px',
      display: 'flex',
      flexDirection: 'row',
      border: `solid 1px ${colors.lightGray2}`,
      backgroundColor: colors.white
    },
    smallButton: {
      width: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    },
    middle: {
      fontSize: '12px',
      width: '110px',
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
          <span>{currentPage} <span style={styles.gray}> of {pageCount}</span></span>
        </div>
        <div style={styles.smallButton} onClick={(currentPage < pageCount) && onRightClick}>
          {(currentPage < pageCount) && <img src={arrowGray} style={generalStyles.arrowRight}/>}
          {(currentPage >= pageCount) && <img src={arrowLightGray} style={generalStyles.arrowRight}/>}
        </div>
      </div>
    );
  }
}

@Radium
export class Table extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static propTypes = {
    style: PropTypes.object
  };

  static styles = {
    table: {
      border: `1px solid ${colors.lightGray3}`
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, style } = this.props;

    return (
      <div>
        <div style={[ styles.table, style ]}>
          {children}
        </div>
      </div>
    );
  }
}
