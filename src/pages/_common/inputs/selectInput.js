/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import Radium from 'radium';
import Immutable from 'immutable';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';
import ToolTip from '../../_common/components/toolTip';

require('./styles/selectInputStyle.css');
require('./styles/customSelectInputStyle.css');

const WrappedSelect = Radium(Select);

function mergeStyles (array) {
  let styles = {};
  for (const style of array) {
    styles = { ...styles, ...style };
  }
  return styles;
}

@Radium
class optionWithImage extends Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    isDisabled: React.PropTypes.bool,
    isFocused: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    option: React.PropTypes.object.isRequired,
    onFocus: React.PropTypes.func,
    onSelect: React.PropTypes.func
  }
  constructor (props, context) {
    super(props, context);
    this.handleMouseDown = ::this.handleMouseDown;
    this.handleMouseEnter = ::this.handleMouseEnter;
    this.handleMouseMove = ::this.handleMouseMove;
  }

  handleMouseDown (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }
  handleMouseEnter (event) {
    this.props.onFocus(this.props.option, event);
  }
  handleMouseMove (event) {
    if (this.props.isFocused) { return; }
    this.props.onFocus(this.props.option, event);
  }
  render () {
    const imageStyle = {
      display: 'inline-block',
      backgroundColor: colors.lightGray,
      marginRight: 10,
      position: 'relative',
      verticalAlign: 'middle',
      height: '30px',
      width: '30px',
      objectFit: 'contain'
    };
    const optionImageStyle = {
      display: 'inline-block',
      backgroundColor: colors.lightGray,
      position: 'relative',
      height: '100%',
      width: '100%',
      maxHeight: '150px',
      maxWidth: '150px',
      objectFit: 'contain'
    };
    const optionStyle = {
      padding: '0px 0px',
      ':hover': {

      },
      ':selected': {

      },
      ':focused': {

      },
      ':lastChild': {
        borderBottomRightRadius: '2px',
        borderBottomLeftRadius: '2px'
      }
    };
    const lineStyle = {
      height: '1px',
      backgroundColor: colors.veryLightGray
    };
    const option = this.props.option;
    const imageSection = option.image
    ? (<ToolTip
      overlay={<img src={`${option.image}?height=150&width=150`} style={optionImageStyle}/>}
      placement='top'
      prefixCls='no-arrow'>
      <img src={`${option.image}?height=150&width=150`} style={imageStyle}/>
    </ToolTip>)
    : option.hasImages && (option.image ? <img src={`${option.image}?height=150&width=150`} style={imageStyle}/> : <span style={imageStyle}/>);
    return (
			<div
  className={this.props.className}
  style={option.hasImages ? optionStyle : {}}
  title={option.title}
  onMouseDown={this.handleMouseDown}
  onMouseEnter={this.handleMouseEnter}
  onMouseMove={this.handleMouseMove}>
  {imageSection}
				{this.props.children}
        {option.hasImages && <div style={lineStyle}/>}
			</div>
    );
  }
}

@Radium
class valueWithImage extends Component {

  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.object,
    onClick: React.PropTypes.func,
    onRemove: React.PropTypes.func
  }

  constructor (props, context) {
    super(props, context);
    this.onRemove = ::this.onRemove;
    this.renderRemoveIcon = ::this.renderRemoveIcon;
    this.handleTouchEndRemove = ::this.handleTouchEndRemove;
    this.handleTouchMove = ::this.handleTouchMove;
    this.handleTouchStart = ::this.handleTouchStart;
    this.handleMouseDown = ::this.handleMouseDown;
  }
  handleMouseDown (event) {
    if (event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    if (this.props.onClick) {
      event.stopPropagation();
      this.props.onClick(this.props.value, event);
      return;
    }
    if (this.props.value.href) {
      event.stopPropagation();
    }
  }

  handleTouchEndRemove (event) {
  // Check if the view is being dragged, In this case
  // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) { return; }

  // Fire the mouse events
    this.onRemove(event);
  }

  handleTouchMove (event) {
		// Set a flag that the view is being dragged
    this.dragging = true;
  }

  handleTouchStart (event) {
		// Set a flag that the view is not being dragged
    this.dragging = false;
  }

  onRemove (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRemove(this.props.value);
  }

  renderRemoveIcon () {
    if (this.props.disabled || !this.props.onRemove) { return; }
    return (
			<span
  aria-hidden='true'
  className='Select-value-icon'
  onMouseDown={this.onRemove}
  onTouchEnd={this.handleTouchEndRemove}
  onTouchMove={this.handleTouchMove}
  onTouchStart={this.handleTouchStart}>
				&times;
			</span>
    );
  }
  render () {
    const imageStyle = {
      display: 'inline-block',
      position: 'relative',
      backgroundColor: colors.lightGray,
      verticalAlign: 'middle',
      height: '24px',
      width: '24px',
      borderTopLeftRadius: '1px',
      borderBottomLeftRadius: '1px',
      objectFit: 'contain',
      marginLeft: '5px'
    };
    const valueImageStyle = {
      display: 'inline-block',
      backgroundColor: colors.lightGray,
      position: 'relative',
      height: '100%',
      width: '100%',
      maxHeight: '150px',
      maxWidth: '150px',
      objectFit: 'contain'
    };
    const valueContainerStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };
    const valueStyle = {
      marginLeft: '10px',
      marginRight: '10px',
      width: '80%',
      overflow: 'hidden'
    };
    const value = this.props.value;
    const imageSection = value.image
    ? (<ToolTip
      overlay={<img src={`${value.image}?height=150&width=150`} style={valueImageStyle}/>}
      placement='top'
      prefixCls='no-arrow'>
      <img src={`${value.image}?height=150&width=150`} style={imageStyle}/>
    </ToolTip>)
    : value.hasImages && (value.image ? <img src={`${value.image}?height=150&width=150`} style={imageStyle}/> : null);
    return (
			<div className='Select-value' title={value.title}>
				<div className='Select-value-label' style={valueContainerStyle}>
          {imageSection}
					{/* {value.hasImages && (value.image ? <img src={value.image} style={imageStyle}/> : <span style={imageStyle}/>)} */}
          {/* <img src={value.image} style={imageStyle}/> */}
					<div style={valueStyle}>
            {this.props.children}
          </div>
        {this.renderRemoveIcon()}
      </div>
			</div>
    );
  }
}

/**
 * Reusable component for selecting one or more items from a list, using items autocompleted.
 */
@Radium
export default class SelectInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    filter: PropTypes.func,
    first: PropTypes.bool,
    getItemImage: PropTypes.func,
    getItemText: PropTypes.func.isRequired, // Takes a value (an id) and produces the string for its visualization.
    getOptions: PropTypes.func, // Triggered on search text change, responsible for getting the new options.
    input: PropTypes.object.isRequired, // Provides value and onChange. Note that value is an id.
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    maxSelect: PropTypes.number,
    meta: PropTypes.object,
    multiselect: PropTypes.bool,
    options: PropTypes.array, // A list of id's...
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func,
    onCreateOption: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onInternalChange = ::this.onInternalChange;
    this.getItemImage = ::this.getItemImage;
    this.state = { value: '' };
  }

  componentWillMount () {
    if (this.props.getOptions) {
      this.props.getOptions();
    }
  }

  getItemImage (option) {
    const getItemImage = this.props.getItemImage;
    if (getItemImage) {
      return getItemImage(option);
    }
    return null;
  }

  // Will be invoked when an item is selected, not when we are typing in the input (that triggers onInputChange, see render)
  onInternalChange (internalValue) {
    const { input, multiselect, onChange } = this.props;
    if (internalValue) { // When we have picked an item from the list.
      const newValue = multiselect
        ? internalValue.map((v) => v.value)
        : internalValue.value;
      // When the user clicked on 'Create option ...'
      if (internalValue.className === 'Select-create-option-placeholder' || (multiselect && internalValue[internalValue.length - 1] && internalValue[internalValue.length - 1].className === 'Select-create-option-placeholder')) {
        if (multiselect) {
          this.props.onCreateOption(internalValue[internalValue.length - 1].value);
        } else {
          this.props.onCreateOption(internalValue.value);
        }
      } else {
        input.onChange && input.onChange(newValue);
        onChange && onChange(newValue);
      }
    } else { // It is possible to clear our selectInput.
      input.onChange && input.onChange(null);
      onChange && onChange(null);
    }
  }

  static styles = {
    padTop: {
      paddingTop: '1.25em'
    },
    base: {
      border: `1px solid ${colors.lightGray2}`,
      borderRadius: 2,
      fontSize: '1em',
      width: '100%'
    },
    error: {
      color: colors.errorColor,
      border: `1px solid ${colors.errorColor}`
    },
    disabled: {
      backgroundColor: colors.lightGray4,
      color: colors.lightGray3
    },
    info: {
      color: colors.lightGray2,
      paddingBottom: '0.188em',
      paddingTop: '0.188em',
      fontSize: '0.688em',
      float: 'right'
    },
    text: {
      cursor: 'pointer',
      lineHeight: '30px',
      fontSize: '0.688em',
      color: colors.veryDarkGray
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      onCreateOption, disabled, first, getItemImage, getItemText, getOptions, filter, input,
      isLoading, label, meta, maxSelect, multiselect, placeholder,
      required, style
    } = this.props;
    const hasImages = getItemImage;
    const options = this.props.options ? this.props.options.map((o) => ({ value: o, label: getItemText(o), image: this.getItemImage(o), hasImages })) : [];
    onCreateOption && this.state.value && options.push({ value: this.state.value, label: `Add ${this.state.value}`, className: 'Select-create-option-placeholder' });
    let value;
    // first time we initialize a multiselect, we retrieve a immutable List. The select components
    // expects a classic array. So we invoke toJS on the list.
    if (Immutable.Iterable.isIterable(input.value)) {
      value = (input.value || []).map((o) => ({ value: o, label: getItemText(o), image: this.getItemImage(o), hasImages })).toJS();
    } else if (multiselect) { // If it isn't a immutable List, but a classic array.
      // We fall back to [] because of https://github.com/erikras/redux-form/issues/621
      value = (input.value || []).map((o) => ({ value: o, label: getItemText(o), image: this.getItemImage(o), hasImages }));
    } else {
      value = input.value && { value: input.value, label: getItemText(input.value), image: this.getItemImage(input.value), hasImages };
    }

    const maxSelected = maxSelect ? ((input.value && input.value.length) || 0) >= maxSelect : false;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <WrappedSelect
          {...input}
          cache={false}
          clearable
          disabled={disabled}
          filterOption={filter ? filter : () => true}
          isLoading={isLoading}
          multi={multiselect}
          optionComponent={optionWithImage}
          options={maxSelected ? [] : options}
          placeholder={placeholder}
          style={mergeStyles([
            styles.base,
            styles.text,
            disabled && styles.disabled,
            meta && meta.touched && meta.error && styles.error
          ])}
          value={value} // Overides value of of {...field}
          valueComponent={valueWithImage}
          onBlur={() => input.onBlur && input.onBlur(input.value)} // Overides onBlur of {...field}
          onChange={this.onInternalChange}  // Overides onChange of {...field};
          onInputChange={(val) => {
            this.setState({ value: val });
            getOptions && getOptions(val);
          }}
          onOpen={getOptions} />
        {typeof maxSelect === 'number' && <span style={styles.info}>{(input.value && input.value.length) || 0}/{maxSelect} selected</span>}
        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
