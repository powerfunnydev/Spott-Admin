import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { buttonStyles, fontWeights, makeTextStyle, colors } from '../../_common/styles';
import FilterSVG from '../../_common/images/filter';
import onClickOutside from 'react-onclickoutside';
/* eslint-disable react/no-set-state */

export const styles = {
  root: {
    position: 'relative'
  },
  clickable: {
    cursor: 'pointer'
  },
  // same as option, but without padding
  control: {
    position: 'relative',
    ...makeTextStyle(fontWeights.regular, '11px', '0.3px'),
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.lightGray2}`,
    borderLeft: `1px solid ${colors.lightGray2}`,
    borderRight: `1px solid ${colors.lightGray2}`,
    borderBottom: `1px solid ${colors.lightGray2}`,
    color: colors.darkGray2,
    zIndex: 0,
    ':hover': {
      zIndex: 10,
      borderTop: `1px solid ${colors.lightGray3}`,
      borderLeft: `1px solid ${colors.lightGray3}`,
      borderRight: `1px solid ${colors.lightGray3}`,
      borderBottom: `1px solid ${colors.lightGray3}`
    },
    ':active': {
      backgroundColor: colors.veryLightGray
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
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  floatOptions: {
    zIndex: 10,
    position: 'absolute',
    right: 0,
    top: 40,
    minWidth: '140px',
    borderRadius: '2px',
    backgroundColor: colors.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    border: `solid 1px ${colors.lightGray2}`
  },
  adaptedTop: {
    top: 30
  },
  line: {
    height: '1px',
    backgroundColor: colors.veryLightGray
  },
  filter: {
    display: 'inline-flex',
    paddingLeft: '10px',
    alignItems: 'center'
  }
};

@Radium
export class FilterContent extends Component {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
    onClearAllFilters: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  static filterContentStyles = {
    cancelAndSubmitComponent: {
      marginLeft: 'auto'
    },
    footer: {
      paddingBottom: '10px',
      paddingTop: '10px',
      paddingRight: '20px',
      paddingLeft: '20px',
      borderTop: `1px solid ${colors.lightGray2}`,
      backgroundColor: colors.veryLightGray,
      display: 'flex',
      width: '100%'
    },
    container: {
      borderRadius: '2px',
      border: `1px solid ${colors.lightGray2}`,
      minWidth: '300px',
      position: 'absolute',
      top: '60px',
      zIndex: 20
    },
    content: {
      backgroundColor: 'white',
      paddingTop: '30px',
      paddingBottom: '30px',
      paddingLeft: '20px',
      paddingRight: '20px'
    },
    clearAllFilters: {
      ...makeTextStyle(fontWeights.regular, '12px'),
      color: colors.red,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  };

  render () {
    const { filterContentStyles } = this.constructor;
    const { children, style, onCancel, onApply, onClearAllFilters } = this.props;

    return (
      <div style={[ filterContentStyles.container, style ]}>
        <div style={filterContentStyles.content}>
          {children}
        </div>
        {(onCancel || onApply) && <div style={filterContentStyles.footer}>
          {onClearAllFilters && <div style={filterContentStyles.clearAllFilters} onClick={onClearAllFilters}>
            Clear all filters
          </div> }
          <div style={filterContentStyles.cancelAndSubmitComponent}>
            {onCancel &&
              <button
                key='cancel'
                style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white ]}
                onClick={onCancel}>Cancel</button>}
            {onApply &&
              <button
                key='save'
                style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]}
                onClick={onApply}>Apply</button>}
          </div>
        </div>}
      </div>
    );
  }

}

@Radium
class Dropdown extends Component {

  static propTypes = {
    arrowStyle: PropTypes.object,
    children: PropTypes.node,
    color: PropTypes.string,
    customDropdown: PropTypes.bool,
    elementShown: PropTypes.node,
    filterContainerStyle: PropTypes.oneOfType(
      [
        PropTypes.object,
        PropTypes.array
      ]
    ),
    filterStyle: PropTypes.object,
    style: PropTypes.object
  }

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.mounted = true;
    this.toggleOpen = ::this.toggleOpen;
    this.handleMouseDown = ::this.handleMouseDown;
    this.handleClickOutside = ::this.handleClickOutside;
  }

  componentWillMount () {
    addEventListener('collapseFilterDropdown', this.handleClickOutside);
  }

  componentWillUnmount () {
    removeEventListener('collapseFilterDropdown', this.handleClickOutside);
  }

  toggleOpen (e) {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleMouseDown (e) {
    if (e.type === 'mousedown' && e.button !== 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.toggleOpen();
  }
  // Originate from onClickOutside (Higher order component)
  handleClickOutside () {
    if (this.mounted) {
      this.setState({ isOpen: false });
    }
  }

  render () {
    const { children, style, filterStyle } = this.props;
    return (
      <div key='dropdown' style={[ styles.root, style ]}>
        <div style={styles.row}>
          <div
            key='filter'
            style={[
              styles.borderRight,
              styles.borderLeft,
              styles.control,
              styles.clickable,
              filterStyle
            ]}
            // We need to stop the propagation, cause in components like Tile, we do not want
            // to trigger multiple onClick events. Dropdown has priority.
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onMouseDown={this.handleMouseDown}>
            <div style={styles.row}>
              <div>Filter</div>
              <div style={styles.filter}><FilterSVG color='#aab5b8'/></div>
            </div>
          </div>
        </div>
        {/* menu */}
        { this.state.isOpen &&
          <div>{ children }</div>
        }
      </div>
    );
  }
}

export default onClickOutside(Dropdown);
