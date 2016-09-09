/* eslint no-nested-ternary: 0 */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { DESCRIPTION_TAB, SOURCE_VIDEO_TAB, PROCESSING_TAB, CONFIRM_TAB } from '../../../../constants/createMediaTabTypes';
import { colors } from '../../../_common/styles';

const ACTIVE_STATUS = 'active';
const COMPLETED_STATUS = 'completed';
const INACTIVE_STATUS = 'inactive';

@Radium
class Tab extends Component {

  static propTypes = {
    status: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick();
  }

  static styles = {
    dot: {
      base: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 12,
        height: 12,
        borderRadius: '100%',
        border: `2px solid ${colors.lightGray}`,
        backgroundColor: 'rgb(205, 209, 210)',
        marginBottom: 10
      },
      active: {
        backgroundColor: colors.secondaryPink,
        border: `2px solid ${colors.secondaryPink}`
      },
      completed: {
        backgroundColor: colors.primaryBlue
      }
    },
    tab: {
      base: {
        cursor: 'pointer',
        flexGrow: 1,
        padding: '25px 15px 25px 15px'
      }
    },
    text: {
      active: {
        color: colors.black
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { status, text } = this.props;
    return (
      <button disabled={status !== COMPLETED_STATUS} style={[ styles.tab.base ]} onClick={this.onClick}>
        <div style={[ styles.dot.base, status === ACTIVE_STATUS && styles.dot.active, status === COMPLETED_STATUS && styles.dot.completed ]} />
        <div style={[ status === ACTIVE_STATUS && styles.text.active ]}>{text}</div>
      </button>
    );
  }

}

@Radium
export default class Tabs extends Component {

  static propTypes = {
    currentTab: PropTypes.string.isRequired,
    onTabClick: PropTypes.func.isRequired
  };

  static styles = {
    tabs: {
      backgroundColor: colors.lightGray,
      color: colors.darkerGray,
      display: 'flex',
      fontSize: '10px',
      justifyContent: 'space-between',
      textAlign: 'center'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { currentTab, onTabClick } = this.props;

    return (
      <div style={styles.tabs}>
        <Tab
          status={currentTab === DESCRIPTION_TAB ? ACTIVE_STATUS : COMPLETED_STATUS}
          text='DESCRIPTION'
          onClick={onTabClick.bind(this, DESCRIPTION_TAB)} />
        <Tab
          status={currentTab === SOURCE_VIDEO_TAB ? ACTIVE_STATUS : (currentTab === DESCRIPTION_TAB ? INACTIVE_STATUS : COMPLETED_STATUS)}
          text='SOURCE VIDEO'
          onClick={onTabClick.bind(this, SOURCE_VIDEO_TAB)} />
        <Tab
          status={currentTab === PROCESSING_TAB ? ACTIVE_STATUS : (currentTab === CONFIRM_TAB ? COMPLETED_STATUS : INACTIVE_STATUS)}
          text='PROCESSING'
          onClick={onTabClick.bind(this, PROCESSING_TAB)} />
        <Tab
          status={currentTab === CONFIRM_TAB ? ACTIVE_STATUS : INACTIVE_STATUS}
          text='CONFIRM'
          onClick={onTabClick.bind(this, CONFIRM_TAB)} />
      </div>
    );
  }

}
