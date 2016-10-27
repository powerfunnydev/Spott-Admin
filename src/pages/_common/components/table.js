import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, makeTextStyle, fontWeights } from '../../_common/styles';
import Spinner from '../../_common/spinner';

const arrowGray = require('../../../assets/images/arrow-gray.svg');
const arrowLightGray = require('../../../assets/images/arrow-light-gray.svg');
const check = require('../../../assets/images/check.svg');

export const generalStyles = {
  arrowUnder: { transform: 'rotateZ(180deg)' },
  arrowLeft: { transform: 'rotateZ(270deg)' },
  arrowRight: { transform: 'rotateZ(90deg)' },
  searchContainer: {
    minHeight: '70px',
    display: 'flex',
    alignItems: 'center'
  },
  paddingTable: {
    paddingTop: '50px',
    paddingBottom: '50px'
  },
  backgroundBar: {
    backgroundColor: colors.veryLightGray
  },
  backgroundTable: {
    backgroundColor: colors.lightGray
  },
  fillPage: {
    flex: 1
  },
  floatRight: {
    marginLeft: 'auto'
  }
};

export const headerStyles = {
  header: {
    minHeight: '32px',
    ...makeTextStyle(null, '11px', '0.50px'),
    textTransform: 'uppercase',
    ':hover': {
      backgroundColor: colors.lightGray4
    }
  },
  firstHeader: {
    borderBottom: `1px solid ${colors.lightGray2}`
  },
  notFirstHeader: {
    borderLeft: `1px solid ${colors.lightGray2}`,
    borderBottom: `1px solid ${colors.lightGray2}`
  }
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
export class TotalEntries extends Component {

  static propTypes = {
    totalResultCount: PropTypes.number.isRequired
  }

  static styles = {
    base: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      paddingBottom: '1.25em'
    },
    entries: {
      ...makeTextStyle(fontWeights.regular)
    },
    entity: {
      color: colors.veryDarkGray,
      textTransform: 'uppercase'
    },
    count: {
      color: '#536970'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { totalResultCount } = this.props;
    return (
      <div style={styles.base}>
        <span style={styles.entity}>Entries</span><span style={styles.count}>&nbsp;&nbsp;{totalResultCount} <span style={styles.entries}>Entries</span></span>
      </div>
    );
  }
}

@Radium
export class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func // Uses the field's onChange, and this one if provided.
  };

  static styles = {
    checkbox: {
      backgroundColor: colors.white,
      alignItems: 'center',
      border: `1px solid ${colors.darkGray}`,
      borderRadius: 2,
      cursor: 'pointer',
      display: 'flex',
      height: 14,
      justifyContent: 'center',
      width: 14
    },
    checked: {
      backgroundColor: colors.primaryBlue
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, onChange } = this.props;

    return (
      <span style={[ styles.checkbox, checked && styles.checked ]} onClick={onChange}>
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
    cell: {
      alignItems: 'center',
      display: 'flex',
      minHeight: '2.625em',
      justifyContent: 'center'
    }
  }

  render () {
    const { checked, style, onChange } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={[ styles.cell, style ]}>
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
export class CustomCel extends Component {

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
    cell: {
      alignItems: 'center',
      color: colors.darkGray2,
      display: 'flex',
      fontSize: '0.75em',
      paddingLeft: '1em',
      paddingRight: '1em',
      minHeight: '2.625em',
      paddingTop: '1em',
      paddingBottom: '1em'
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
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, style, getValue, objectToRender, onClick, sortColumn, sortDirection } = this.props;

    return (
      <div style={[ styles.cell, (sortColumn || onClick) && styles.pointer,
            sortDirection && sortDirection !== NONE && styles.headerSelected,
            onClick && styles.clickable, style ]} onClick={sortColumn || onClick}>
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
    },
    odd: {
      backgroundColor: 'rgba(230, 248, 253, 0.5)',
      transition: 'background-color .25s ease-in-out',
      ':hover': {
        backgroundColor: colors.lightBlue
      }
    },
    even: {
      backgroundColor: colors.white,
      transition: 'background-color .25s ease-in-out',
      ':hover': {
        backgroundColor: colors.lightGray4
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, isFirst, index } = this.props;
    return (
      <div style={[ styles.row, (!isFirst) && styles.borderRow, index && index % 2 === 1 ? styles.odd : styles.even ]}>
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
      backgroundColor: '#f4f5f5',
      opacity: 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  render () {
    const { children, isLoading } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={{ position: 'relative', minHeight: '5.25em' }}>
        {isLoading &&
          <div style={styles.rows}>
           <Spinner style={{ height: '1.875em', width: '1.875em' }}/>
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
      border: `1px solid ${colors.lightGray3}`,
      borderRadius: '2px',
      backgroundColor: colors.white
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
