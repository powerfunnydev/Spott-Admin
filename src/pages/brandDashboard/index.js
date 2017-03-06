import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import * as actions from './actions';
import * as globalActions from '../../actions/global';
import NumberWidget from './numberWidget';
import HighchartsWidget from './highchartsWidget';
import MapWidget from './mapWidget';
import ListWidget from './listWidget';
import ListView from '../_common/components/listView/index';
import { tableDecorator } from '../_common/components/table/index';
import DemographicsWidget from './demographicsWidget';

import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';
import { SideMenu } from '../app/sideMenu';
import Header from '../app/multiFunctionalHeader';
import { brandActivityConfig } from './defaultHighchartsConfig';

import selector, { topMediaPrefix } from './selector';

const listViewStyle = {
  height: 410,
  overflowY: 'scroll'
};

const rowStyles = {
  container: {
    paddingRight: 10,
    display: 'inline-flex'
  },
  image: {
    borderRadius: 2,
    height: 29,
    objectFit: 'contain',
    width: 29
  },
  imagePlaceholder: {
    paddingRight: 39
  }
};

@tableDecorator(topMediaPrefix)
class TopMedia extends Component {

  static propTypes = {
    data: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.getTitle = ::this.getTitle;
  }

  getTitle (topMedia) {
    return (
      <div style={{ alignItems: 'center', display: 'inline-flex' }}>
        {(topMedia.getIn([ 'medium', 'posterImage' ]) &&
          <div style={rowStyles.container}>
            <img src={`${topMedia.getIn([ 'medium', 'posterImage', 'url' ])}?height=150&width=150`} style={rowStyles.image} />
          </div>) || <div style={rowStyles.imagePlaceholder}/>}
        {topMedia.getIn([ 'medium', 'title' ])}
      </div>
    );
  }

  render () {
    const { data, load, location: { query: { topMediaSortDirection, topMediaSortField } }, routerPushWithReturnTo, onSortField } = this.props;

    const columns = [
      { clickable: true, convert: this.getTitle, sort: true, sortField: 'TITLE', title: 'TITLE', type: 'custom' },
      { clickable: true, name: 'taggedProducts', sort: true, sortField: 'TAGGED_PRODUCTS', title: 'TAGGED PRODUCTS', type: 'custom' },
      { clickable: true, name: 'subscriptions', sort: true, sortField: 'SUBSCRIPTIONS', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    return (
      <ListWidget title='Top media for your brand'>
        <ListView
          columns={columns}
          data={data}
          load={load}
          routerPushWithReturnTo={routerPushWithReturnTo}
          sortDirection={topMediaSortDirection}
          sortField={topMediaSortField}
          style={listViewStyle}
          onSortField={(name) => onSortField.bind(this, name)} />
      </ListWidget>
    );
  }
}

@tableDecorator(topMediaPrefix)
class TopPeople extends Component {

  static propTypes = {
    data: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.getTitle = ::this.getTitle;
  }

  getTitle (topMedia) {
    return (
      <div style={{ alignItems: 'center', display: 'inline-flex' }}>
        {(topMedia.getIn([ 'character', 'portraitImage' ]) &&
          <div style={rowStyles.container}>
            <img src={`${topMedia.getIn([ 'character', 'portraitImage', 'url' ])}?height=150&width=150`} style={rowStyles.image} />
          </div>) || <div style={rowStyles.imagePlaceholder}/>}
        {topMedia.getIn([ 'character', 'name' ])}
      </div>
    );
  }

  render () {
    const { data, load, location: { query: { topMediaSortDirection, topMediaSortField } }, routerPushWithReturnTo, style, onSortField } = this.props;

    const columns = [
      { clickable: true, convert: this.getTitle, sort: true, sortField: 'TITLE', title: 'TITLE', type: 'custom' },
      { clickable: true, name: 'taggedProducts', sort: true, sortField: 'TAGGED_PRODUCTS', title: 'TAGGED PRODUCTS', type: 'custom' },
      { clickable: true, name: 'subscriptions', sort: true, sortField: 'SUBSCRIPTIONS', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    return (
      <ListWidget style={style} title='Top people and characters for your brand'>
        <ListView
          columns={columns}
          data={data}
          load={load}
          routerPushWithReturnTo={routerPushWithReturnTo}
          sortDirection={topMediaSortDirection}
          sortField={topMediaSortField}
          style={listViewStyle}
          onSortField={(name) => onSortField.bind(this, name)} />
      </ListWidget>
    );
  }
}

@connect(selector, (dispatch) => ({
  loadTopMedia: bindActionCreators(actions.loadTopMedia, dispatch),
  loadTopPeople: bindActionCreators(actions.loadTopPeople, dispatch),
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch)
}))
@Radium
export default class BrandDashboard extends Component {

  static propTypes = {
    // children: PropTypes.node.isRequired,
    loadTopMedia: PropTypes.func.isRequired,
    loadTopPeople: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    topMedia: ImmutablePropTypes.map.isRequired
  };

  onSortField (listName) {
    console.warn('Sort fields', arguments);
  }

  componentDidMount () {
    this.props.loadTopMedia(this.props.location.query);
    this.props.loadTopPeople(this.props.location.query);
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
      alignItems: 'flex-start',
      display: 'flex',
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, loadTopMedia, topPeople, loadTopPeople, location, routerPushWithReturnTo, topMedia } = this.props;
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
              data={topMedia}
              load={() => loadTopMedia(location.query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.paddingBottom} />
            <TopPeople
              data={topPeople}
              load={() => loadTopPeople(location.query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.paddingBottom} />
          </div>
          <DemographicsWidget title='Demographics' />
        </Container>
        {children}
      </SideMenu>
    );
  }
}
