import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Search } from '../../_helpers/search';
import CharacterList from './list';

export default class CharacterSearch extends Component {

  static propTypes = {
    focus: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    onOptionSelected: PropTypes.func.isRequired
  };

  render () {
    return (
      <Search
        customListComponent={CharacterList}
        displayOption={(c) => c.get('name')}
        focus={focus}
        {...this.props}/>
    );
  }
}
