import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import SearchInput from '../../inputs/searchInput';
import PlusButton from '../../components/buttons/plusButton';
import { generalStyles } from './index';
import { colors, buttonStyles } from '../../../_common/styles';
import DisplayMode from './displayMode';
import Dropdown, { styles as dropdownStyles } from '../actionDropdown';
import PlusSVG from '../../images/plus';

@Radium
export default class UtilsBar extends Component {

  static propTypes = {
    display: PropTypes.string,
    isLoading: PropTypes.bool,
    menu: PropTypes.node,
    numberSelected: PropTypes.number,
    searchString: PropTypes.string,
    textCreateButton: PropTypes.string,
    topElement: PropTypes.node,
    onChangeDisplay: PropTypes.func,
    onChangeSearchString: PropTypes.func,
    onClickNewEntry: PropTypes.func
  }

  static styles = {
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    paddingRight: {
      paddingRight: '9px'
    }
  }

  render () {
    const { display, isLoading, searchString, onChangeDisplay, onChangeSearchString,
      textCreateButton, onClickNewEntry, topElement, menu } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={generalStyles.searchContainer}>
        { onChangeSearchString && <SearchInput isLoading={isLoading} value={searchString} onChange={onChangeSearchString}/>}
        <DisplayMode display={display} onChangeDisplay={onChangeDisplay}/>
        <div style={generalStyles.floatRight}>
          { /* if there is an topElement and menu, render dropdown */ }
          { topElement && menu && <Dropdown
            arrowStyle={dropdownStyles.bigArrowContainer}
            color= 'blue'
            customDropdown
            elementShown={
              <div key='topElementCreate' style={[
                dropdownStyles.option,
                styles.row,
                dropdownStyles.bigOption,
                dropdownStyles.borderLeft,
                dropdownStyles.blue,
                dropdownStyles.borderRightSeperator
              ]}>
                <div style={styles.paddingRight}>
                  <PlusSVG color={colors.white}/>
                </div>
                <div>
                  {topElement}
                </div>
              </div>
            }>
            {menu}
          </Dropdown> ||
            /* else, render classic button */
            textCreateButton && onClickNewEntry && <PlusButton key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} text={textCreateButton} onClick={onClickNewEntry} />}
        </div>
      </div>
    );
  }
}
