import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Dropdown, { styles as dropdownStyles } from '../actionDropdown';
import { confirmation } from '../../../_common/askConfirmation';
import CogWheal from '../../images/cogWheal';
import { fontWeights } from '../../styles';

@Radium
export default class BulkOperationDropdown extends Component {

  static propTypes = {
    numberSelected: PropTypes.number,
    onDeleteSelected: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.onDeleteSelected = ::this.onDeleteSelected;
  }

  async onDeleteSelected (e) {
    e.preventDefault();
    const { onDeleteSelected } = this.props;
    const result = await confirmation();
    if (result) {
      onDeleteSelected();
    }
  }

  static styles = {
    smallPadding: {
      paddingLeft: '3px',
      paddingTop: '3px',
      paddingBottom: '3px',
      paddingRight: '3px'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    centerHeight: {
      display: 'flex',
      alignItems: 'center'
    },
    medium: {
      fontFamily: fontWeights.medium
    }
  }

  render () {
    const { styles } = this.constructor;
    const { numberSelected, onDeleteSelected } = this.props;
    return (
      <div>
      {typeof numberSelected === 'number' && numberSelected > 0 &&
        <Dropdown
          color='blue'
          elementShown={
            <div style={styles.row}>
              <div key='wheal' style={[ dropdownStyles.option, dropdownStyles.borderLeft, dropdownStyles.blue, styles.smallPadding, styles.centerHeight ]}>
                <CogWheal color='white'/>
              </div>
              <div key='numberSelected' style={[ dropdownStyles.option, dropdownStyles.blue, styles.smallPadding, styles.centerHeight, styles.medium ]}>
                {numberSelected}
              </div>
            </div>
          }>
          {onDeleteSelected &&
            <div
              key='bulkOperationDropdownMenu1'
              style={dropdownStyles.floatOption}
              onClick={this.onDeleteSelected}>
                Remove
            </div>}
        </Dropdown>}
      </div>
    );
  }
}
