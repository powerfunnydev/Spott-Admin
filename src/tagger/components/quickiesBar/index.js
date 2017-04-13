import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import quickiesBarSelector from '../../selectors/quickiesBar';
import * as quickiesActions from '../../actions/quickies';
import { CHARACTERS, LATEST, SCENES } from '../../constants/quickiesTabTypes';
import { Tab, Tabs, TabPanel } from '../_helpers/tabs';
import LatestTab from './latestTab';
import CharactersTab from './charactersTab';
import ScenesTab from './scenesTab';
import ProductDetails from './productDetails';

@connect(quickiesBarSelector, (dispatch) => ({
  selectTab: bindActionCreators(quickiesActions.selectTab, dispatch)
}))
@Radium
export default class QuickiesBar extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    selectTab: PropTypes.func.isRequired,
    selectedProduct: ImmutablePropTypes.map,
    style: PropTypes.object
  };

  static styles = {
    container: {
      // Tabs and current tab stack in a column
      display: 'flex',
      flexDirection: 'column',
      // Styling
      backgroundColor: '#252525',
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
    const { activeTab, style, selectTab, selectedProduct } = this.props;

    return (
      <div style={[ styles.container, style ]}>

        {/* Render the bar of tabs at the top */}
        <Tabs style={styles.tabBar}>
          <Tab
            selected={activeTab === LATEST}
            tabName={LATEST}
            text='Latest'
            title='View recently added products and characters.'
            onSelect={selectTab} />
          <Tab
            selected={activeTab === SCENES}
            tabName={SCENES}
            text='Scenes'
            title='Manage scenes and their products.'
            onSelect={selectTab} />
          <Tab
            selected={activeTab === CHARACTERS}
            tabName={CHARACTERS}
            text='Characters'
            title='Manage characters and their outfits.'
            onSelect={selectTab} />
        </Tabs>

        {/* Render the contents of the currently selected tab */}
        {activeTab === LATEST &&
          <TabPanel style={styles.tabPage} tabName='latest'>
            <LatestTab />
          </TabPanel>}

        {activeTab === SCENES &&
          <TabPanel style={styles.tabPage} tabName='scenes'>
            <ScenesTab />
          </TabPanel>}

        {activeTab === CHARACTERS &&
          <TabPanel style={styles.tabPage} tabName='characters'>
            <CharactersTab />
          </TabPanel>}

        <ProductDetails product={selectedProduct} />
      </div>
    );
  }

}
