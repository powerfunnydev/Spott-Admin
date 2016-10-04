import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import Radium from 'radium';
import { colors, defaultSpacing, errorTextStyle } from '../styles';
import Label from './_label';

import 'react-select/dist/react-select.min.css';

const WrappedSelect = Radium(Select);

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
    meta: PropTypes.object.isRequired,
    multiselect: PropTypes.bool,
    options: PropTypes.array, // A list of id's...
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onInternalChange = ::this.onInternalChange;
  }

  componentWillMount () {
    if (this.props.getOptions) {
      this.props.getOptions();
    }
  }

  onInternalChange (internalValue) {
    const { input, multiselect } = this.props;
    const newValue = multiselect
      ? internalValue.map((v) => v.value)
      : internalValue.value;

    input.onChange(newValue);
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  static styles = {
    padTop: {
      paddingTop: defaultSpacing * 0.75
    },
    base: {
      border: `1px solid ${colors.darkGray}`,
      borderRadius: 4,
      fontSize: '16px',
      width: '100%'
    },
    disabled: {
      backgroundColor: colors.lightGray,
      color: colors.darkerGray
    },
    info: {
      color: colors.darkGray,
      paddingBottom: 3,
      paddingTop: 3,
      fontSize: '11px',
      float: 'right'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { disabled, first, getItemText, getOptions, input, isLoading, label, meta, maxSelect, multiselect, placeholder, required, style } = this.props;
    const options = this.props.options ? this.props.options.map((o) => ({ value: o, label: getItemText(o) })) : [];

    let value;
    if (multiselect) {
      value = (input.value || []).map((o) => ({ value: o, label: getItemText(o) })); // We fall back to [] because of https://github.com/erikras/redux-form/issues/621
    } else {
      value = input.value && { value: input.value, label: getItemText(input.value) };
    }

    const maxSelected = maxSelect ? input.value.length >= maxSelect : false;

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
          style={[ styles.base, disabled && styles.disabled ]}
          value={value} // Overides value of of {...field}
          onBlur={() => input.onBlur(input.value)} // Overides onBlur of of {...field}
          onChange={this.onInternalChange}  // Overides onChange of of {...field};
          onInputChange={getOptions}
          onOpen={getOptions} />
        {typeof maxSelect === 'number' && <span style={styles.info}>{input.value.length}/{maxSelect} selected</span>}
        {meta.touched && meta.error === 'required' && <div style={errorTextStyle}>This field is required.</div>}
      </div>
    );
  }

}