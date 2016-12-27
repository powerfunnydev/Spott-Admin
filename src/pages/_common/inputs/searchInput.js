import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../_common/styles';
import FilterDropdown from '../components/filterDropdown';

const searchIcon = require('../../../assets/images/searchIcon.png');
const borderRadius = '4px';

@Radium
export default class SearchInput extends Component {
  static propTypes = {
    filterContent: PropTypes.object,
    isLoading: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      backgroundColor: 'white',
      borderRadius
    },
    searchContainer: {
      width: '370px',
      display: 'flex',
      flexDirection: 'row',
      border: `solid 1px ${colors.lightGray2}`,
      zIndex: 0,
      ':hover': {
        zIndex: 10,
        border: `solid 1px ${colors.lightGray3}`
      },
      ':focus': {
        zIndex: 10,
        border: `solid 1px ${colors.lightGray3}`
      }
    },
    // radius of left border
    borderLeft: {
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px'
    },
    // radius of right border
    borderRight: {
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px'
    },
    iconWrapper: {
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      display: 'flex',
      padding: '10px',
      height: '30px',
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      width: '15px',
      height: '15px'
    },
    input: {
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      ':focus': {
        outline: 'none'
      },
      borderColor: 'transparent',
      height: '30px',
      fontSize: '12px',
      width: '100%',
      color: colors.veryDarkGray
    },
    loading: {
      fontSize: '11px',
      letterSpacing: '0.5px',
      color: colors.primaryBlue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: '10px'
    },
    filter: {
      padding: '9px',
      marginLeft: '-1px',
      width: '75px',
      // no border radius on the left side
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { isLoading, value, onChange, filterContent } = this.props;
    return (
      <div key={'searchInputContainer'} style={styles.container}>
        <div key='searchContainer' style={[ styles.searchContainer, styles.borderLeft, !filterContent && styles.borderRight ]}>
          <div style={styles.iconWrapper}>
            <img src={searchIcon} style={styles.icon}/>
          </div>
          <input placeholder='Search' style={styles.input} value={value} onChange={(e) => onChange(e.target.value)}/>
          {value && <div style={styles.loading}>
            {isLoading && <div>LOADING</div>}
          </div>}
        </div>
        {filterContent && <FilterDropdown filterStyle={styles.filter}>
          {filterContent}
        </FilterDropdown> }
      </div>
    );
  }
}
