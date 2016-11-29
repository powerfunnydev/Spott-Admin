import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import { fontWeights, makeTextStyle, colors } from '../../_common/styles';
import ArrowSVG from '../images/arrow';

/* eslint-disable react/no-set-state */

export const styles = {
  root: {
    position: 'relative',
    ...makeTextStyle(fontWeights.regular, '11px', '0.3px')
  },
  option: {
    position: 'relative',
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightGray2}`,
    color: colors.darkGray2,
    paddingRight: '12px',
    paddingTop: '3px',
    paddingBottom: '3px',
    paddingLeft: '10px',
    cursor: 'pointer',
    ':hover': {
      zIndex: 10,
      border: `1px solid ${colors.lightGray3}`
    },
    ':active': {
      backgroundColor: colors.veryLightGray
    }
  },
  clickable: {
    cursor: 'pointer'
  },
  control: {
    position: 'relative',
    backgroundColor: colors.white,
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
    borderBottomLeftRadius: '2px'
  },
  borderRight: {
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '2px'
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.white,
    right: 0,
    minWidth: '100px',
    zIndex: 9
  },
  arrowUnder: { transform: 'rotateZ(180deg)' },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
    minHeight: '20px'
  },
  elementShown: {
    marginRight: '-1px'
  },
  marginTop: {
    marginTop: '-1px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  blue: {
    backgroundColor: colors.primaryBlue,
    border: `1px solid ${colors.primaryBlue}`,
    color: colors.white,
    ':hover': {
      zIndex: 10,
      border: `1px solid ${colors.primaryBlue}`
    },
    ':active': {
      backgroundColor: colors.primaryBlue
    }
  }
};

@Radium
class Dropdown extends Component {

  static propTypes = {
    children: PropTypes.node,
    color: PropTypes.string,
    elementShown: PropTypes.node,
    style: PropTypes.object
  }

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
    const { color, children, elementShown, style } = this.props;

    return (
      <div key='dropdown' style={[ styles.root, style ]}>
        <div style={styles.row}>
          {elementShown && <div style={[ styles.elementShown ]}>
            {elementShown}
          </div>}
          <div
            key='arrow'
            style={[ styles.borderRight, !elementShown && styles.borderLeft, styles.control, styles.arrowContainer, styles.clickable, color === 'blue' && styles.blue ]}
            // we need to stop the propagation, cause in components like Tile, we do not want
            // to trigger multiple onClick events. Dropdown has priority.
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onMouseDown={this.handleMouseDown.bind(this)}>
            <ArrowSVG color={color === 'blue' && colors.white || colors.darkGray2} style={[ !this.state.isOpen && styles.arrowUnder ]} />
          </div>
        </div>
        {/* menu */}
        { this.state.isOpen &&
          <div style={styles.menu} onClick={this.toggleOpen}>{children}</div>
        }
      </div>
    );
  }

}

export default Dropdown;
