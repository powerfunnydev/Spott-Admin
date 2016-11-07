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
    position: 'relative',
    display: 'inline-block',
    backgroundColor: colors.white,
    boxSizing: 'borderBox',
    border: `1px solid ${colors.lightGray2}`,
    color: colors.darkGray2,
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
  menu: {
    textAlign: 'left',
    backgroundColor: colors.white,
    border: '1px solid #ccc',
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
    cursor: 'pointer'
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
      <div key='dropdown' style={[ styles.root, style, { minWidth: '100px' } ]}>
        <div>
          <div style={[ elementShown && styles.paddingLeft, styles.control, elementShown && styles.borderLeft ]}>
            {elementShown}
          </div>
          <div key='arrow' style={[ styles.borderRight, !elementShown && styles.borderLeft, styles.control, styles.arrowContainer, styles.clickable ]} onMouseDown={this.handleMouseDown.bind(this)}>
            <img src={arrowGray} style={[ styles.arrow, !this.state.isOpen && styles.arrowUnder ]} />
          </div>
        </div>
        {menu}
      </div>
    );
  }

}

export default Dropdown;
