import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../_common/styles';

const searchIcon = require('../../../assets/images/searchIcon.png');

/**
 * TODO Styling placeholder
 */
@Radium
export default class SearchInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static propTypes = {
    pagination: PropTypes.bool
  };

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      border: `solid 1px ${colors.lightGray2}`,
      width: '370px',
      backgroundColor: 'white'
    },
    iconWrapper: {
      display: 'flex',
      width: '30px',
      height: '30px',
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      width: '15px',
      height: '15px'
    },
    input: {
      ':focus': {
        outline: 'none'
      },
      borderColor: 'transparent',
      height: '30px',
      fontSize: '12px',
      width: '100%'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { value, onChange } = this.props;

    return (
      <div style={styles.container}>
        <div style={styles.iconWrapper}>
          <img src={searchIcon} style={styles.icon}/>
        </div>
        <input placeholder='Search' style={styles.input} value={value} onChange={onChange}/>
      </div>
    );
  }
}
