import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import SearchInput from '../../inputs/searchInput';
import Button from '../../buttons/button';
import PlusButton from '../../buttons/plusButton';
import { generalStyles } from './index';
import { buttonStyles } from '../../../_common/styles';
import DisplayMode from './displayMode';

/* eslint-disable no-alert */

@Radium
export default class UtilsBar extends Component {

  static propTypes = {
    display: PropTypes.string,
    isLoading: PropTypes.bool,
    numberSelected: PropTypes.number,
    searchString: PropTypes.string,
    textCreateButton: PropTypes.string,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func,
    onClickDeleteSelected: PropTypes.func,
    onClickNewEntry: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.onRemove = :: this.onRemove;
  }

  async onRemove (e) {
    const result = window.confirm('Are you sure you want to trigger this action?');
    if (result) {
      await this.props.onClickDeleteSelected(e);
    }
  }

  render () {
    const { display, isLoading, searchString, onChangeDisplay, onChangeSearchString, numberSelected, textCreateButton, onClickDeleteSelected, onClickNewEntry } = this.props;
    return (
      <div style={generalStyles.searchContainer}>
        { onChangeSearchString && <SearchInput isLoading={isLoading} value={searchString} onChange={onChangeSearchString}/>}
        <DisplayMode display={display} onChangeDisplay={onChangeDisplay}/>
        <div style={generalStyles.floatRight}>
          {numberSelected !== undefined && onClickDeleteSelected && <Button key='delete' style={[ buttonStyles.blue ]} text={`Delete ${numberSelected}`} onClick={this.onRemove}/>}
          {textCreateButton && onClickNewEntry && <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text={textCreateButton} onClick={onClickNewEntry} />}
        </div>
      </div>
    );
  }
}
