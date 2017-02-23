import React, { Component, PropTypes } from 'react';
import { routerPushWithReturnTo } from '../../actions/global';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import NumberWidget from './numberWidget';
import HighchartsWidget, { largeWidgetStyle } from './highchartsWidget';

import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';
import { SideMenu } from '../app/sideMenu';
import Header from '../app/multiFunctionalHeader';
import { brandActivityConfig } from './defaultHighchartsConfig';

@connect(null, (dispatch) => ({
  // loadActivities: bindActionCreators(actions.loadActivities, dispatch),
  // loadRankings: bindActionCreators(actions.loadRankings, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class BrandDashboard extends Component {

  static propTypes = {
    // children: PropTypes.node.isRequired,
    // loadActivities: PropTypes.func.isRequired,
    // loadRankings: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }),
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  static styles = {
    brandActivity: {
      // Compensate for the padding Highcharts uses.
      paddingBottom: '1em'
    },
    tabs: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.lightGray2
    },
    numberWidgets: {
      display: 'flex',
      marginLeft: -12,
      marginRight: -12,
      marginBottom: 29
    },
    numberWidget: {
      width: `${100 / 6}%`,
      marginLeft: 12,
      marginRight: 12
    },
    wrapper: {
      backgroundColor: colors.lightGray4,
      paddingTop: '1.5em ',
      paddingBottom: '3em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, location } = this.props;
    return (
      <SideMenu location={location}>
        <Header hierarchy={[ { title: 'Dashboard', url: '/brand-dashboard' } ]}/>
        <Container style={styles.wrapper}>
          <div style={styles.numberWidgets}>
            <NumberWidget style={styles.numberWidget} title='Tagged products'>
              <span>124</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Brand subscriptions'>
              <span>2586</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Product impressions'>
              <span>403</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Product views'>
              <span>280</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Product buys'>
              <span>8</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Conversion'>
              <span>4%</span>
            </NumberWidget>
          </div>
          <HighchartsWidget config={brandActivityConfig} style={[ largeWidgetStyle, styles.brandActivity ]} title='Brand activity' />

        </Container>
        {children}
      </SideMenu>
    );
  }
}
