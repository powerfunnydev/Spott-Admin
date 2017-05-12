import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import { fontWeights, makeTextStyle, colors } from '../../_common/styles';
import ArrowSVG from '../images/arrow';
import SelectedSVG from '../images/completed';
import PlusSVG from '../images/plus';

/* eslint-disable react/no-set-state */

@Radium
export default class Dropdown extends Component {

  static propTypes = {
    createOption: PropTypes.func,
    createOptionText: PropTypes.string,
    disabled: PropTypes.bool,
    getItemText: PropTypes.func.isRequired,
    getOptions: PropTypes.func,
    input: PropTypes.object,
    options: PropTypes.array.isRequired, // A list of id's...
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.mounted = true;
    this.handleDocumentClick = ::this.handleDocumentClick;
    this.toggleOpen = ::this.toggleOpen;
    this.renderTopElement = :: this.renderTopElement;
    this.renderMenu = ::this.renderMenu;
    this.onCreateOptionClick = :: this.onCreateOptionClick;
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
    this.setState(...this.state, { isOpen: !this.state.isOpen });
  }

  handleMouseDown (event) {
    // if (event.type === 'mousedown' && event.button !== 0) { return; }
    // event.stopPropagation();
    // event.preventDefault();

    this.toggleOpen();
  }

  handleDocumentClick (event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  optionSelected (optionId) {
    const { input, onChange } = this.props;
    input && input.onChange && input.onChange(optionId);
    onChange && onChange(optionId);
    this.setState({ ...this.state, isOpen: false });
  }

  onCreateOptionClick () {
    const { createOption } = this.props;
    this.toggleOpen();
    createOption();
  }

  static styles = {
    root: {
      position: 'relative',
      ...makeTextStyle(fontWeights.regular, '11px'),
      color: colors.darkGray2,
      minWidth: '140px'
    },
    isOpen: {
      backgroundColor: colors.veryLightGray
    },
    disabled: {
      color: colors.lightGray2,
      border: `1px solid ${colors.lightGray2}`
    },
    topElement: {
      width: '100%',
      paddingTop: '3px',
      paddingBottom: '3px',
      paddingLeft: '10px',
      backgroundColor: colors.white,
      border: `1px solid ${colors.lightGray2}`,
      borderRadius: '2px',
      display: 'flex',
      flexDirection: 'row',
      ':hover': {
        border: `1px solid ${colors.lightGray3}`
      },
      ':active': {
        backgroundColor: colors.veryLightGray
      }
    },
    topElementText: {
      width: '80%'
    },
    arrow: {
      width: '20%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    flipArrow: {
      transform: 'rotateZ(180deg)'
    },
    option: {
      color: colors.black2,
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '10px',
      backgroundColor: colors.white,
      display: 'flex',
      flexDirection: 'row',
      ':hover': {
        backgroundColor: colors.lightGray4
      }
    },
    createOption: {
      cursor: 'pointer',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'center',
      ...makeTextStyle(fontWeights.medium, '12px'),
      fontWeight: 500,
      color: colors.primaryBlue,
      ':hover': {
        backgroundColor: colors.lightGray4
      }
    },
    optionText: {
      flex: 0.8
    },
    optionSelected: {
      flex: 0.2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    options: {
      zIndex: 50,
      position: 'absolute',
      left: 0,
      top: 30,
      minWidth: '140px',
      borderRadius: '2px',
      backgroundColor: colors.white,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
      border: `solid 1px ${colors.lightGray2}`
    },
    line: {
      height: '1px',
      backgroundColor: colors.veryLightGray
    },
    plus: {
      paddingRight: '6px'
    }
  };

  renderTopElement () {
    const { disabled, placeholder, getItemText, input } = this.props;
    const { styles } = this.constructor;
    return (
      <div key='dropdownTopElement' style={[ styles.topElement, this.state.isOpen && styles.isOpen, disabled && styles.disabled ]} onMouseDown={!disabled && this.handleMouseDown.bind(this)}>
        { // get label of selected item
          input && input.value && <div style={styles.topElementText}>{getItemText(input.value)}</div> ||
         // if there is not an item selected, show placeholder
         <div style={[ styles.topElementText ]}>{placeholder}</div>}
         <div style={styles.arrow}>
          <ArrowSVG color={colors.darkGray2} style={[ !this.state.isOpen && styles.flipArrow ]} />
         </div>
      </div>);
  }

  renderMenu () {
    const { createOption, createOptionText, input, options, getItemText } = this.props;
    const { styles } = this.constructor;
    return (
      <div key='options' style={styles.options}>
        {options.map((id, index) => {
          return (
            <div key={`dropdownOptionWithLine${index}`}>
              <div
                key={`dropdownOption${index}`}
                style={styles.option}
                onClick={this.optionSelected.bind(this, id)}>
                  <div style={styles.optionText}>{getItemText(id)}</div>
                  {input && input.value === id && <div style={styles.optionSelected}><SelectedSVG color={colors.primaryBlue}/></div>}
              </div>
              {options.length - 1 !== index && <div style={styles.line}/>}
            </div>);
        })}
        {createOption &&
          <div>
            <div style={styles.line}/>
            <div style={styles.createOption} onClick={this.onCreateOptionClick}>
              <div style={styles.plus}><PlusSVG color={colors.primaryBlue}/></div>
              {createOptionText || 'Create option' }
            </div>
          </div>}
      </div>
    );
  }

  render () {
    const { style } = this.props;
    const { styles } = this.constructor;
    return (
      <div key='dropdown' style={[ styles.root, style ]}>
        {this.renderTopElement()}
        {this.state.isOpen && this.renderMenu()}
      </div>
    );
  }

}
