import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import moment from 'moment';
import * as globalActions from '../../../actions/global';
import ListView from '../../_common/components/listView/index';
import { tableDecorator } from '../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, Container } from '../../_common/styles';
import { SideMenu } from '../../app/sideMenu';
import Header from '../../app/multiFunctionalHeader';
import { brandActivityConfig } from './defaultHighchartsConfig';
import DemographicsWidget from './demographicsWidget';
import Filters from './filters';
import NumberWidget from './numberWidget';
import HighchartsWidget from './highchartsWidget';
import MapWidget from './mapWidget';
import Widget from './widget';
import ImageTitle from './imageTitle';
import OpportunitiesWidget from './opportunitiesWidget';
import * as actions from './actions';
import selector, { topMediaPrefix } from './selector';

const listViewContainerStyle = {
  height: 410,
  overflowY: 'scroll'
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
      <ImageTitle
        imageUrl={topMedia.getIn([ 'medium', 'posterImage', 'url' ])}
        title={topMedia.getIn([ 'medium', 'title' ])}/>
    );
  }

  render () {
    const { data, load, location: { query: { topMediaSortDirection, topMediaSortField } }, routerPushWithReturnTo, style, onSortField } = this.props;

    const columns = [
      { clickable: true, colspan: 3, convert: this.getTitle, sort: true, sortField: 'TITLE', title: 'TITLE', type: 'custom' },
      { clickable: true, colspan: 1, name: 'taggedProducts', sort: true, sortField: 'TAGGED_PRODUCTS', title: 'TAGGED PRODUCTS', type: 'custom' },
      { clickable: true, colspan: 1, name: 'subscriptions', sort: true, sortField: 'SUBSCRIPTIONS', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    return (
      <Widget style={style} title='Top media for your brand'>
        <div style={listViewContainerStyle}>
          <ListView
            columns={columns}
            data={data}
            load={load}
            routerPushWithReturnTo={routerPushWithReturnTo}
            sortDirection={topMediaSortDirection}
            sortField={topMediaSortField}
            onSortField={(name) => onSortField.bind(this, name)} />
        </div>
      </Widget>
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

  getTitle (topPeople) {
    return (
      <ImageTitle
        imageUrl={topPeople.getIn([ 'character', 'portraitImage', 'url' ])}
        title={topPeople.getIn([ 'character', 'title' ])}/>
    );
  }

  render () {
    const { data, load, location: { query: { topMediaSortDirection, topMediaSortField } }, routerPushWithReturnTo, style, onSortField } = this.props;

    const columns = [
      { clickable: true, colspan: 3, convert: this.getTitle, sort: true, sortField: 'TITLE', title: 'TITLE', type: 'custom' },
      { clickable: true, colspan: 1, name: 'taggedProducts', sort: true, sortField: 'TAGGED_PRODUCTS', title: 'TAGGED PRODUCTS', type: 'custom' },
      { clickable: true, colspan: 1, name: 'subscriptions', sort: true, sortField: 'SUBSCRIPTIONS', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    return (
      <Widget style={style} title='Top people and characters for your brand'>
        <div style={listViewContainerStyle}>
          <ListView
            columns={columns}
            data={data}
            load={load}
            routerPushWithReturnTo={routerPushWithReturnTo}
            sortDirection={topMediaSortDirection}
            sortField={topMediaSortField}
            onSortField={(name) => onSortField.bind(this, name)} />
        </div>
      </Widget>
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

  constructor (props) {
    super(props);
    this.onChangeFilter = ::this.onChangeFilter;
  }

  onSortField (listName) {
    console.warn('Sort fields', arguments);
  }

  componentDidMount () {
    this.props.loadTopMedia(this.props.location.query);
    this.props.loadTopPeople(this.props.location.query);
  }

  onChangeFilter (field, type, value) {
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      query: {
        ...this.props.location.query,
        [field]: value
      }
    });
  }

  static styles = {
    paddingBottom: {
      paddingBottom: '1.5em'
    },
    listWidget: {
      paddingBottom: '1.5em',
      paddingLeft: '0.75em',
      paddingRight: '0.75em'
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
    },
    filters: {
      paddingTop: '1.5em',
      paddingBottom: '1em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      children, loadTopMedia, loadTopPeople, location, location: { query: { ages,
      endDate, genders, languages, startDate } }, routerPushWithReturnTo, topMedia, topPeople
    } = this.props;
    return (
      <SideMenu location={location}>
        <Header hierarchy={[ { title: 'Dashboard', url: '/brand-dashboard' } ]}/>
        <Container>
          <Filters
            fields={{
              ages: typeof ages === 'string' ? [ ages ] : ages,
              genders: typeof genders === 'string' ? [ genders ] : genders,
              languages: typeof languages === 'string' ? [ languages ] : languages,
              endDate: moment(endDate),
              startDate: moment(startDate)
            }}
            style={styles.filters}
            onChange={this.onChangeFilter}/>
        </Container>
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
          {/* <MapWidget style={styles.paddingBottom} title='Brand activity by region' /> */}
          <div style={styles.listWidgets}>
            <TopMedia
              data={topMedia}
              load={() => loadTopMedia(location.query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.listWidget} />
            <TopPeople
              data={topPeople}
              load={() => loadTopPeople(location.query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.listWidget} />
          </div>
          <DemographicsWidget style={styles.paddingBottom} title='Demographics' />
          <OpportunitiesWidget style={styles.paddingBottom}/>
        </Container>
        {children}
      </SideMenu>
    );
  }
}
