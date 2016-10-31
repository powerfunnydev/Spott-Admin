import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import { fontWeights, makeTextStyle, colors } from '../../_common/styles';
const arrowGray = require('../../../assets/images/arrow-gray.svg');

/* eslint-disable react/prop-types */
/* eslint-disable react/no-set-state */

export const styles = {
  root: {
    position: 'relative',
    textAlign: 'right',
    ...makeTextStyle(fontWeights.regular, '11px', '0.3px')
  },
  topElement: {
    color: colors.darkGray2,
    display: 'inline-block',
    paddingRight: '12px',
    paddingTop: '3px',
    paddingBottom: '3px'
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
    display: 'inline-block',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '2px',
    color: '#333',
    ':hover': {
      boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)'
    }
  },
  menu: {
    textAlign: 'left',
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
    paddingTop: '3px',
    paddingBottom: '3px',
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'center',
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
    height: '6px'
  },
  arrowContainer: {
    display: 'inline-block',
    paddingTop: '3px',
    paddingBottom: '3px',
    paddingRight: '6px',
    paddingLeft: '6px'
  },
  paddingLeft: {
    paddingLeft: '10px'
  },
  seperator: {
    borderLeft: '1px solid #ccc'
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
      <div style={[ styles.root, style, { minWidth: '100px' } ]}>
        <div style={[ styles.control, elementShown && styles.paddingLeft ]}>
          {elementShown}
          <div style={[ styles.arrowContainer, styles.clickable, elementShown && styles.seperator ]} onMouseDown={this.handleMouseDown.bind(this)}>
            <img src={arrowGray} style={[ styles.arrow, !this.state.isOpen && styles.arrowUnder ]} />
          </div>
        </div>
        {menu}
      </div>
    );
  }

}

export default Dropdown;
