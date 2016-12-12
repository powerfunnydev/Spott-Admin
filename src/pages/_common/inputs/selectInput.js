/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import Radium from 'radium';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';
import Immutable from 'immutable';

require('./styles/selectInputStyle.css');

const WrappedSelect = Radium(Select);

function mergeStyles (array) {
  let styles = {};
  for (const style of array) {
    styles = { ...styles, ...style };
  }
  return styles;
}

/**
 * Reusable component for selecting one or more items from a list, using items autocompleted.
 */
@Radium
export default class SelectInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    first: PropTypes.bool,
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
    this.state = { value: '' };
  }

  componentWillMount () {
    if (this.props.getOptions) {
      this.props.getOptions();
    }
  }

  onInternalChange (internalValue) {
    const { input, multiselect, onChange } = this.props;
    const newValue = multiselect
      ? internalValue.map((v) => v.value)
      : internalValue.value;
    // when the user clicked on 'Create option ...'
    if (internalValue.className === 'Select-create-option-placeholder') {
      this.props.onCreateOption(internalValue.value);
    } else {
      input.onChange && input.onChange(newValue);
      onChange && onChange(newValue);
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
    const { onCreateOption, disabled, first, getItemText, getOptions, input, isLoading, label, meta, maxSelect, multiselect, placeholder, required, style } = this.props;
    const options = this.props.options ? this.props.options.map((o) => ({ value: o, label: getItemText(o) })) : [];
    onCreateOption && this.state.value && options.push({ value: this.state.value, label: `Add ${this.state.value}`, className: 'Select-create-option-placeholder' });
    let value;
    // first time we initialize a multiselect, we retrieve a immutable List. The select components
    // expects a classic array. So we invoke toJS on the list.
    if (Immutable.Iterable.isIterable(input.value)) {
      value = (input.value || []).map((o) => ({ value: o, label: getItemText(o) })).toJS();
    } else if (multiselect) { // If it isn't a immutable List, but a classic array.
      // We fall back to [] because of https://github.com/erikras/redux-form/issues/621
      value = (input.value || []).map((o) => ({ value: o, label: getItemText(o) }));
    } else {
      value = input.value && { value: input.value, label: getItemText(input.value) };
    }

    const maxSelected = maxSelect ? ((input.value && input.value.length) || 0) >= maxSelect : false;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <WrappedSelect
          {...input}
          cache={false}
          clearable={false}
          disabled={disabled}
          filterOption={() => true}
          isLoading={isLoading}
          multi={multiselect}
          options={maxSelected ? [] : options}
          placeholder={placeholder}
          style={mergeStyles([
            styles.base,
            styles.text,
            disabled && styles.disabled,
            meta && meta.touched && meta.error && styles.error
          ])}
          value={value} // Overides value of of {...field}
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
