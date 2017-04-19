/* eslint-disable react/no-set-state */
/* eslint-disable no-return-assign */
import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typeahead } from 'react-typeahead';
import { slowdown } from '../../_helpers/utils';
import './style.css';

@Radium
export class Search extends Component {

  static propTypes = {
    customListComponent: PropTypes.func.isRequired,
    displayOption: PropTypes.func.isRequired,
    focus: PropTypes.bool,
    inputClass: PropTypes.string,
    options: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    style: PropTypes.object,
    value: PropTypes.string,
    onOptionSelected: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
    // We delay the search with 300 milliseconds.
    // Only the latest search will be performed.
    this.search = slowdown(::this.search, 300);
  }

  componentDidMount () {
    // Focus the first input. For some weird reason this does not work
    // when not wrapped in a setTimeout(). To be investigated if someone
    // has a lot of time, but for now it'll do.
    if (this.props.focus) {
      setTimeout(() => {
        this.typeahead.focus();
      }, 0);
    }
  }

  search (searchString) {
    this.props.search({ searchString });
  }

  // When changing the text we deselect the current option.
  onChange (e) {
    this.props.onOptionSelected(null);
    this.search(e.target.value);
  }

  render () {
    const { customListComponent, displayOption, inputClass, options, value, onOptionSelected } = this.props;
    /**
      * customListComponent: the component which will render the entire list.
      * displayOption: which field of the option should be shown in the input field?
      * filterOption: which items should be shown? Always show all options
      *               because filtering is done by the server.
      */

    // Rerender the component bacause otherwise the initial value won't be shown.
    if (value) {
      return (
        <Typeahead
          customClasses={{ input: inputClass || 'search__input-blue' }}
          customListComponent={customListComponent}
          displayOption={displayOption}
          filterOption={() => true}
          key='typeahead'
          options={options}
          ref={(c) => this.typeahead = c}
          value={value}
          onChange={this.onChange}
          onOptionSelected={onOptionSelected} />
      );
    }
    return (
      <Typeahead
        customClasses={{ input: inputClass || 'search__input-blue' }}
        customListComponent={customListComponent}
        displayOption={displayOption}
        filterOption={() => true}
        key='typeahead2'
        options={options}
        ref={(c) => this.typeahead = c}
        onChange={this.onChange}
        onOptionSelected={onOptionSelected} />
    );
  }
}
