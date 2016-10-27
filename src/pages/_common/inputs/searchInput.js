import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../_common/styles';

const searchIcon = require('../../../assets/images/searchIcon.png');
const borderRadius = '4px';
/**
 * TODO Styling placeholder
 */
@Radium
export default class SearchInput extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      border: `solid 1px ${colors.lightGray2}`,
      borderRadius,
      width: '370px',
      backgroundColor: 'white',
      ':hover': {
        border: `solid 1px ${colors.lightGray3}`
      },
      ':focus': {
        border: `solid 1px ${colors.lightGray3}`
      }
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
    }
  }

  render () {
    const { styles } = this.constructor;
    const { isLoading, value, onChange } = this.props;

    return (
      <div key={'searchInputContainer'} style={styles.container}>
        <div style={styles.iconWrapper}>
          <img src={searchIcon} style={styles.icon}/>
        </div>
        <input placeholder='Search' style={styles.input} value={value} onChange={onChange}/>
        {value && <div style={{ fontSize: '11px', letterSpacing: '0.5px', color: colors.primaryBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '10px' }}>
          {isLoading && <div>LOADING</div>}
        </div>}
      </div>
    );
  }
}
