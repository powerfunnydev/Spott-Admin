/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors } from '../../styles';

@Radium
export default class DropDown extends Component {

  static propTypes = {
    children: PropTypes.any,
    label: PropTypes.string.isRequired,
    selectedItemText: PropTypes.string,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      open: false
    };

    this.handleHide = ::this.handleHide;
    this.handleToggle = ::this.handleToggle;
  }

  componentWillMount () {
    window.addEventListener('click', this.handleHide, false);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleHide, false);
  }

  handleToggle (e) {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  handleHide (e) {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  static styles = {
    wrapper: {
      width: '100%',
      position: 'relative'
    },
    menu: {
      backgroundColor: colors.darkerGray,
      top: 38,
      maxHeight: 400,
      width: '100%',
      overflow: 'auto',
      position: 'absolute',
      zIndex: 1
    },
    selectedItemText: {
      opacity: 0.5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    dropDown: {
      alignItems: 'center',
      backgroundColor: colors.darkestGray,
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      padding: 10,
      cursor: 'pointer'
    },
    downArrow: {
      fontSize: '8px',
      marginLeft: 6
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, label, selectedItemText, style } = this.props;

    return (
      <div style={[ styles.wrapper, style ]} onClick={this.handleToggle}>
        <div style={styles.dropDown}>
          <span style={styles.selectedItemText}>{selectedItemText || label}</span> <span style={styles.downArrow}>▼</span>
        </div>
        {this.state.open &&
          <div style={styles.menu}>
            {children}
          </div>}
      </div>
    );
  }

}
