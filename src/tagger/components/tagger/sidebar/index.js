import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sidebarSelector from '../../../selectors/sidebar';
import { setCurrentTabName } from '../../../actions/sidebar';
import { Tab, Tabs, TabPanel } from '../_helpers/tabs';
import FrameTab from './frameTab';
import GlobalTab from './globalTab';
import colors from '../colors';

@connect(sidebarSelector, (dispatch) => ({
  setCurrentTabName: bindActionCreators(setCurrentTabName, dispatch)
}))
@Radium
class Sidebar extends Component {

  static propTypes = {
    // Provided by connecting to the sidebarSelector.
    currentTabName: PropTypes.string.isRequired,
    setCurrentTabName: PropTypes.func.isRequired,
    // Override the inline-styles of the root element.
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.onTabSelect = ::this.onTabSelect;
  }

  onTabSelect (tabName) {
    // Make the clicked tab active.
    this.props.setCurrentTabName(tabName);
  }

  static styles = {
    container: {
      // Tabs and current tab stack in a column
      display: 'flex',
      flexDirection: 'column',
      // Styling
      backgroundColor: colors.black3,
      fontFamily: 'Rubik-Regular'
    },
    tabBar: {
      flex: '0 0 40px',
      marginBottom: 1
    },
    tabPage: {
      height: '100%'
    },
    tab: {
      outline: 'none'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { currentTabName } = this.props;

    return (
      <div style={[ styles.container, this.props.style ]}>

        {/* Render the bar of tabs at the top */}
        <Tabs style={styles.tabBar}>
          <Tab
            selected={currentTabName === 'frame'}
            tabName='frame'
            text='Frame'
            title='View and manipulate content that has an index of the current frame'
            onSelect={this.onTabSelect} />
          <Tab
            selected={currentTabName === 'global'}
            tabName='global'
            text='Global'
            onSelect={this.onTabSelect} />
          {/* Todo: more serious tabs that actually do something
          <Tab
            selected={currentTabName === 'history'}
            tabName='history'
            text='&nbsp;'
            onSelect={() => {}} />*/}
        </Tabs>

        {/* Render the contents of the currently selected tab */}
        {(() => {
          switch (currentTabName) {
            case 'frame':
              return (
                <TabPanel style={styles.tabPage} tabName='frame'>
                  <FrameTab style={styles.tab} />
                </TabPanel>
              );
            case 'global':
              return (
                <TabPanel style={styles.tabPage} tabName='global'>
                  <GlobalTab style={styles.tab} />
                </TabPanel>
              );
            // case 'history': return (<TabPanel tabName='history'><HistoryTab /></TabPanel>);
          }
        })()}

      </div>
    );
  }

}

export default Sidebar;
