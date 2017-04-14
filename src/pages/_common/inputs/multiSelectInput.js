/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import Radium from 'radium';
import Immutable from 'immutable';
import { colors, errorTextStyle } from '../styles';
import Label from './_label';
import PlusSVG from '../images/plus';

require('./styles/multiSelectInputStyle.css');

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
export default class MultiSelectInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    filter: PropTypes.func,
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

  // Will be invoked when an item is selected, not when we are typing in the input (that triggers onInputChange, see render)
  onInternalChange (index, internalValue) {
    const { input, onChange } = this.props;
    const newValues = input.value || [];
    if (internalValue) {
      newValues[index] = internalValue.value;
    } else {
      // Remove element if value was set to null.
      newValues.splice(index, 1);
    }
    input.onChange && input.onChange(newValues);
    onChange && onChange(newValues);
  }

  static styles = {
    container: {
      display: 'flex',
      marginBottom: -12,
      width: '100%',
      flexWrap: 'wrap'
    },
    padTop: {
      paddingTop: '1.25em'
    },
    selectContainer: {
      paddingRight: 12,
      paddingBottom: 12,
      minWidth: 200
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
      lineHeight: 30,
      fontSize: '0.688em',
      color: colors.veryDarkGray
    },
    addButton: {
      base: {
        border: `solid 1px ${colors.lightGray2}`,
        borderRadius: 2,
        height: 22,
        width: 22
      },
      disabled: {
        opacity: 0.5
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      disabled, first, getItemText, getItem, getOptions, filter, input,
      isLoading, label, meta, valueComponent, placeholder,
      required, style
    } = this.props;

    let value;
    // first time we initialize a multiselect, we retrieve a immutable List. The select components
    // expects a classic array. So we invoke toJS on the list.
    if (Immutable.Iterable.isIterable(input.value)) {
      value = (input.value || []).map((o) => ({ item: getItem(o), label: getItemText(o), value: o })).toJS();
    } else { // If it isn't a immutable List, but a classic array.
      // We fall back to [] because of https://github.com/erikras/redux-form/issues/621
      value = (input.value || []).map((o) => ({ item: getItem(o), label: getItemText(o), value: o }));
    }

    if (value.length === 0) {
      value = [ null ];
    }

    const options = (this.props.options ? this.props.options.map((o) => ({ item: getItem(o), label: getItemText(o), value: o })) : [])
      .filter((option) => !(input.value || []).includes(option.value));

    const disableAddButton = !(value[value.length - 1] && value[value.length - 1].label && options.length > 0);

    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <div style={styles.container}>
          {value.map((v, i) => (
            <div key={i} style={styles.selectContainer}>
              <WrappedSelect
                // {...input}
                cache={false}
                className='Multi'
                clearable={i !== 0} // First input field is not clearable.
                disabled={disabled}
                filterOption={filter ? filter : () => true}
                isLoading={isLoading}
                options={options}
                placeholder={placeholder}
                style={mergeStyles([
                  styles.base,
                  styles.text,
                  disabled && styles.disabled,
                  meta && meta.touched && meta.error && styles.error
                ])}
                value={v} // Overides value of of {...field}
                valueComponent={valueComponent}
                // onBlur={() => input.onBlur && input.onBlur(input.value)} // Overides onBlur of {...field}
                onChange={this.onInternalChange.bind(this, i)}  // Overides onChange of {...field};
                // onInputChange={(val) => {
                //   this.setState({ value: val });
                //   getOptions && getOptions(val);
                // }}
                onOpen={getOptions} />
            </div>
          ))}
          <button disabled={disableAddButton} style={[ styles.addButton.base, disableAddButton && styles.addButton.disabled ]} title='Add' onClick={() => {
            const lastValue = value[value.length - 1];
            if (lastValue && lastValue.label) {
              this.onInternalChange(value.length, {});
            }
          }}>
            <PlusSVG color={colors.darkGray2} />
          </button>
        </div>
        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
