import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import * as globalActions from '../../actions/global';
import NumberWidget from './numberWidget';
import HighchartsWidget from './highchartsWidget';
import MapWidget from './mapWidget';
import ListWidget from './listWidget';
import ListView from '../_common/components/listView/index';
import { tableDecorator } from '../_common/components/table/index';

import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';
import { SideMenu } from '../app/sideMenu';
import Header from '../app/multiFunctionalHeader';
import { brandActivityConfig } from './defaultHighchartsConfig';

@tableDecorator('topMedia')
class TopMedia extends Component {

  static propTypes = {
    data: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static columns = [
    { clickable: true, name: 'title', sort: true, sortField: 'TITLE', title: 'TITLE', type: 'custom' },
    { clickable: true, name: 'taggedProducts', sort: true, sortField: 'TAGGED_PRODUCTS', title: 'TAGGED PRODUCTS', type: 'custom' },
    { clickable: true, name: 'subscriptions', sort: true, sortField: 'SUBSCRIPTIONS', title: 'SUBSCRIPTIONS', type: 'custom' }
  ];

  render () {
    const columns = this.constructor.columns;
    const { data, load, location: { query: { topMediaSortDirection, topMediaSortField } }, routerPushWithReturnTo, style, onSortField } = this.props;

    return (
      <ListWidget style={style} title='Top media for your brand'>
        <ListView
          columns={columns}
          data={data}
          load={load}
          routerPushWithReturnTo={routerPushWithReturnTo}
          sortDirection={topMediaSortDirection}
          sortField={topMediaSortField}
          onSortField={(name) => onSortField.bind(this, name)} />
      </ListWidget>
    );
  }
}

@connect(null, (dispatch) => ({
  // loadActivities: bindActionCreators(actions.loadActivities, dispatch),
  // loadRankings: bindActionCreators(actions.loadRankings, dispatch),
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch)
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

  constructor (props) {
    super(props);
    this.state = {
      topMedia: {
        data: Map({
          _status: 'loaded',
          data: List()
        })
        // sortDirection sortField
      }
    };
  }

  static styles = {
    paddingBottom: {
      paddingBottom: '1.5em'
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
      paddingTop: '1.5em',
      paddingBottom: '3em'
    },
    listWidgets: {
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    }
  };

  onSortField (listName) {
    console.warn('Sort fields', arguments);
  }

  render () {
    const styles = this.constructor.styles;
    const { children, location, routerPushWithReturnTo } = this.props;

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
          <HighchartsWidget config={brandActivityConfig} style={styles.paddingBottom} title='Brand activity' />
          <MapWidget style={styles.paddingBottom} title='Brand activity by region' />
          <div style={styles.listWidgets}>
            <TopMedia
              data={this.state.topMedia.data}
              load={(query) => console.warn('Query', query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.paddingBottom} />
            {/* <ListWidget style={styles.paddingBottom} title='Top media for your brand'>
              <ListView
                columns={columns}
                data={this.state.topMedia.data}
                load={() => 4} // this.props.load(this.props.location.query
                routerPushWithReturnTo={this.props.routerPushWithReturnTo}
                // sortDirection={sortDirection}
                // sortField={sortField}
                onSortField={this.onSortField.bind(this, 'topMedia')}/> */}
            <ListWidget style={styles.paddingBottom} title='Top people and characters for your brand' />
          </div>

        </Container>
        {children}
      </SideMenu>
    );
  }
}
