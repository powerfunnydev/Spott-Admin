import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import { colors } from '../../_common/styles';
const arrowGray = require('../../../assets/images/arrow-gray.svg');

/* eslint-disable react/prop-types */
/* eslint-disable react/no-set-state */

export const styles = {
  root: {
    position: 'relative',
    height: '20px'
  },
  topElement: {
    color: colors.darkGray2,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '12px'
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clickable: {
    cursor: 'pointer'
  },
  control: {
    height: '20px',
    display: 'flex',
    paddingLeft: '10px',
    flexDirection: 'row',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '2px',
    color: '#333',
    ':hover': {
      boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)'
    }
  },
  menu: {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)',
    boxSizing: 'border-box',
    marginTop: '-1px',
    maxHeight: '200px',
    position: 'absolute',
    top: '100%',
    width: '100%',
    zIndex: 1000
  },
  option: {
    color: colors.darkGray2,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    height: '20px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f2f9fc',
      color: '#333'
    }
  },
  arrowUnder: { transform: 'rotateZ(180deg)' },
  arrow: {
    width: '8px',
    height: '5px'
  },
  arrowContainer: {
    borderLeft: '1px solid #ccc',
    display: 'flex',
    paddingRight: '12px',
    paddingLeft: '12px',
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent:
    'center'
  }
};

@Radium
class Dropdown extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.mounted = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }

  componentWillUnmount () {
    this.mounted = false;
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }

  toggleOpen () {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleMouseDown (event) {
    if (event.type === 'mousedown' && event.button !== 0) { return; }
    event.stopPropagation();
    event.preventDefault();

    this.toggleOpen();
  }

  handleDocumentClick (event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  render () {
    const { children, elementShown, style } = this.props;
    const menu = this.state.isOpen ? <div style={styles.menu} onClick={this.toggleOpen}>{children}</div> : null;

    return (
      <div style={[ styles.root, style ]}>
        <div style={styles.control}>
          {elementShown}
          <div style={[ styles.arrowContainer, styles.clickable ]} onMouseDown={this.handleMouseDown.bind(this)}>
            <img src={arrowGray} style={[ styles.arrow, !this.state.isOpen && styles.arrowUnder ]} />
          </div>
        </div>
        {menu}
      </div>
    );
  }

}

export default Dropdown;
