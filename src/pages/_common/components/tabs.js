import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { makeTextStyle, fontWeights, colors } from '../styles';

@Radium
export class Tab extends Component {

  static propTypes = {
    children: PropTypes.node,
    first: PropTypes.bool,
    last: PropTypes.bool,
    onClick: PropTypes.func
  };

  static styles = {
    tab: {
      ...makeTextStyle(fontWeights.regular, '12px'),
      color: colors.darkGray3,
      minWidth: '100px',
      height: '30px',
      backgroundColor: colors.white,
      border: `solid 1px ${colors.lightGray2}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '10px',
      paddingRight: '10px',
      marginLeft: '-1px',
      zIndex: 0,
      ':hover': {
        zIndex: 10,
        border: `1px solid ${colors.lightGray3}`
      },
      ':active': {
        backgroundColor: colors.veryLightGray
      }
    },
    borderLeft: {
      borderTopLeftRadius: '2px',
      borderBottomLeftRadius: '2px',
      marginRight: '-1px'
    },
    borderRight: {
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px'
    },
    clickable: {
      cursor: 'pointer'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, first, last, onClick } = this.props;
    // Determine items
    return (
      <div style={[ styles.tab, first && styles.borderLeft, last && styles.borderRight, onClick && styles.clickable ]}>
        {children}
      </div>
    );
  }
}

@Radium
export class Tabs extends Component {

  static propTypes = {
    children: PropTypes.node
  };

  static styles = {
    tabs: {
      minHeight: '56px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children } = this.props;
    // Determine items
    return (
      <div style={styles.tabs}>
        {children}
      </div>
    );
  }
}
