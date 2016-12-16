import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Clock from './clock';
import { ORGANIZE, TAG } from '../../constants/mainTabTypes';
import { currentMediumSelector } from '../../selectors/header';
import { selectTab } from '../../actions/global';
import colors from '../colors';

@connect(currentMediumSelector, (dispatch) => ({
  selectTab: bindActionCreators(selectTab, dispatch)
}))
@Radium
class Header extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    currentMedium: ImmutablePropTypes.map,
    selectTab: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  onTabSelect (tab, e) {
    e.preventDefault();
    this.props.selectTab(tab);
  }

  static styles = {
    headerContainer: {
      backgroundColor: 'black',
      // Set paddings (paddingRight ensures that long texts keep a distance from the right side of the browser window)
      paddingLeft: '0.938em',
      paddingRight: '0.938em',
      paddingTop: '0.688em',
      paddingBottom: '0.688em',
      // Center contents
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between'
    },
    contents: {
      // We set color and font here as it also determines design of the ellipsis
      color: colors.warmGray,
      fontFamily: 'Rubik-Regular',
      fontSize: '0.813em',
      // Keep content on one line, showing '...' if it is too long
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    editingTypeText: {
      color: 'white'
    },
    error: {
      color: colors.vividRed
    },
    clock: {
      float: 'right'
    },
    tabContainer: {
      backgroundColor: colors.black1,
      paddingLeft: '0.938em',
      paddingRight: '0.938em',
      paddingTop: '0.75em',
      paddingBottom: '0.75em',
      textAlign: 'center'
    },
    tab: {
      base: {
        borderRadius: '0.25em',
        color: colors.warmGray,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        fontSize: '0.688em',
        letterSpacing: 1,
        paddingBottom: '1em',
        paddingTop: '1em',
        textAlign: 'center',
        textTransform: 'uppercase',
        width: '7.5em',
        marginLeft: '0.5em',
        marginRight: '0.5em'
      },
      selected: {
        backgroundColor: 'black',
        color: colors.vividRed
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { activeTab, currentMedium } = this.props;

    return (
      <div style={this.props.style}>
        {/* Header: Title + Clock */}
        <div style={styles.headerContainer}>
          <div style={styles.contents}>
            <span style={styles.editingTypeText}>Scene Editor&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {/* Render episode title, if any. */}
            {currentMedium && currentMedium.get('title') &&
               <span>{currentMedium.get('title')}</span>}
            {/* Render error message if an error occurred. */}
            {currentMedium && currentMedium.get('_error') &&
              <span style={styles.error}>{'Error retrieving data.'}</span>}
          </div>
          <div style={{ width: 105 }}>
            <Clock style={styles.clock} />
          </div>
        </div>
        {/* Tabs: Organize, Tag, Currate */}
        <div style={styles.tabContainer}>
          <button style={[ styles.tab.base, activeTab === ORGANIZE && styles.tab.selected ]} onClick={this.onTabSelect.bind(this, ORGANIZE)}>
            Organize
          </button>
          <button style={[ styles.tab.base, activeTab === TAG && styles.tab.selected ]} onClick={this.onTabSelect.bind(this, TAG)}>
            Tag
          </button>
        </div>
      </div>
    );
  }

}

export default Header;
