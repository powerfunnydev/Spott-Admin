/* eslint-disable react/no-set-state */
import Autosuggest from 'react-autosuggest';
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Spinner from '../../components/spinner';
import './style.css';

const searchIcon = require('../../../../assets/images/searchIcon.png');
@Radium
export default class AutoSuggest extends Component {

  static propTypes = {
    getItemText: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    input: PropTypes.object,
    isLoading: PropTypes.bool,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    renderOption: PropTypes.func.isRequired,
    onChange: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.onSuggestionSelected = ::this.onSuggestionSelected;
    this.onSuggestionsFetchRequested = ::this.onSuggestionsFetchRequested;
    this.renderInputComponent = ::this.renderInputComponent;
    this.state = { value: '' };
  }

  componentWillMount () {
    // When we render this component, we need to fetch data.
    this.props.getOptions && this.props.getOptions();
  }

  onSuggestionsClearRequested () {

  }

  // if we click in the input or type somethin, this function will be invoked
  onSuggestionsFetchRequested ({ value }) {
    console.log('onSuggestionsFetchRequested', value);
    const { getOptions } = this.props;
    if (this.state.value !== value) { // we need to be sure that the new value is different than the previous one
      getOptions(value);
      this.setState({ value });
    }
  }

  // Will be invoked when an item is selected, not when we are typing in the input
  onSuggestionSelected (event, { suggestion }) {
    console.log('onSuggestionSelected');
    const { getItemText, input, onChange } = this.props;
    // input is derived from redux-form
    input && input.onChange && input.onChange(suggestion);
    // onChange, if we don't use redux-form
    onChange && onChange(suggestion);
    // finally, we need to set our input field
    this.setState({ value: getItemText(suggestion) });
  }

  static styles = {
    searchIconContainer: {
      padding: '9px'
    },
    searchIcon: {
      width: '12px',
      height: '12px'
    },
    input: {
      height: '100%',
      width: '100%',
      outline: 'none',
      border: 'none'
    },
    spinnerContainer: {
      padding: '6px'
    },
    spinner: {
      width: '18px',
      height: '18px'
    }
  }

  renderInputComponent ({ className, ...restProps }) {
    const { styles } = this.constructor;
    return (<div className={className}>
      <div style={styles.searchIconContainer}><img src={searchIcon} style={styles.searchIcon}/></div>
      <input style={styles.input} {...restProps} />
      {this.props.isLoading && <div style={styles.spinnerContainer}><Spinner style={styles.spinner}/></div>}
    </div>);
  }

  render () {
    const { /* disabled, first, */ getItemText, input, placeholder, renderOption, /* required, */ options } = this.props;
    const inputProps = {
      placeholder,
      value: this.state.value,
      onBlur: () => { input && input.onBlur && input.onBlur(input.value); },
      onChange: (event, { newValue, method }) => { console.log('method', method); }
    };
    return (
      <Autosuggest
        focusInputOnSuggestionClick={false}
        getSuggestionValue={getItemText}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        renderSuggestion={renderOption}
        shouldRenderSuggestions = {() => true}
        suggestions={options}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        // Will be invoked when we types something in the input field.
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}/>
    );
  }
}
