import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Dropdown, { styles as dropdownStyles } from '../actionDropdown';
import Checkbox from '../../inputs/checkbox';
import { confirmation } from '../../../_common/askConfirmation';

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
    const { onDeleteSelected } = this.props;
    const result = await confirmation();
    if (result) {
      await onDeleteSelected(e);
    }
  }

  static styles = {
    smallPadding: {
      paddingLeft: '2px',
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingRight: '2px'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { numberSelected, onDeleteSelected } = this.props;
    return (
      <div>
      { typeof numberSelected === 'number' && numberSelected !== 0 &&
        <Dropdown
          color='blue'
          elementShown={
            <div style={styles.row}>
              <Checkbox checked color='blue' style={[ dropdownStyles.option, dropdownStyles.borderLeft, dropdownStyles.blue, styles.smallPadding ]}/>
              <div
                style={[ dropdownStyles.option, dropdownStyles.blue, styles.smallPadding ]}>
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
            </div>
          }
        </Dropdown>
      }
      </div>
    );
  }
}
