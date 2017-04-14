import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import moment from 'moment';
import Highcharts from 'react-highcharts';
import Papa from 'papaparse';
import * as globalActions from '../../../actions/global';
import ListView from '../../_common/components/listView/index';
import { tableDecorator } from '../../_common/components/table/index';
import MultiSelectInput from '../../_common/inputs/multiSelectInput';
import { colors, fontWeights, makeTextStyle, Container } from '../../_common/styles';
import { SideMenu } from '../../app/sideMenu';
import Header from '../../app/multiFunctionalHeader';
import { ageConfig, genderConfig } from './defaultHighchartsConfig';
import DemographicsWidget from './demographicsWidget';
import Filters from './filters';
import NumberWidget from './numberWidget';
import MapWidget from './mapWidget';
import Widget from './widget';
import ImageTitle from './imageTitle';
import OpportunitiesWidget from './opportunitiesWidget';
import * as actions from './actions';
import selector, { topMediaPrefix, topPeoplePrefix, topProductsPrefix } from './selector';

const colorStyle = {
  borderRadius: '100%',
  height: 6,
  width: 6,
  marginRight: 6
};

@Radium
class ColorValue extends Component {

  static propTypes = {
    children: React.PropTypes.node,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.object
  };

  render () {
    const event = this.props.value.item;
    return (
			<div className='Select-value' title={this.props.value.title}>
				<span className='Select-value-label'>
					{event &&
            <div style={{ alignItems: 'center', display: 'flex' }}>
              <div style={[ colorStyle, { backgroundColor: event.get('color') } ]} />
              {event.get('description')}
            </div>}
				</span>
			</div>
    );
  }

}

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
            sortDirection={topMediaSortDirection}
            sortField={topMediaSortField}
            onSortField={(name) => onSortField.bind(this, name)} />
        </div>
      </Widget>
    );
  }
}

@tableDecorator(topPeoplePrefix)
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
        title={topPeople.getIn([ 'character', 'name' ])}/>
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
            sortDirection={topMediaSortDirection}
            sortField={topMediaSortField}
            onSortField={(name) => onSortField.bind(this, name)} />
        </div>
      </Widget>
    );
  }
}

@tableDecorator(topProductsPrefix)
class TopProducts extends Component {

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
            sortDirection={topMediaSortDirection}
            sortField={topMediaSortField}
            onSortField={(name) => onSortField.bind(this, name)} />
        </div>
      </Widget>
    );
  }
}

@connect(selector, (dispatch) => ({
  loadDateData: bindActionCreators(actions.loadDateData, dispatch),
  loadEvents: bindActionCreators(actions.loadEvents, dispatch),
  loadKeyMetrics: bindActionCreators(actions.loadKeyMetrics, dispatch),
  loadTopMedia: bindActionCreators(actions.loadTopMedia, dispatch),
  loadTopPeople: bindActionCreators(actions.loadTopPeople, dispatch),
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch)
}))
@Radium
export default class BrandDashboard extends Component {

  static propTypes = {
    // children: PropTypes.node.isRequired,
    dateDataConfig: PropTypes.object.isRequired,
    events: ImmutablePropTypes.map.isRequired,
    eventsById: ImmutablePropTypes.map.isRequired,
    loadDateData: PropTypes.func.isRequired,
    loadEvents: PropTypes.func.isRequired,
    loadKeyMetrics: PropTypes.func.isRequired,
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

  async componentDidMount () {
    const location = this.props.location;
    const query = {
      // We assume the ALL event will be always there.
      endDate: moment().startOf('day').format('YYYY-MM-DD'),
      startDate: moment().startOf('day').subtract(1, 'months').date(1).format('YYYY-MM-DD'),
      ...location.query
    };
    await this.props.routerPushWithReturnTo({ ...location, query });

    await this.props.loadEvents();
    await this.props.loadKeyMetrics();
    await this.props.loadTopMedia();
    await this.props.loadTopPeople();
    await this.props.loadDateData();
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
    widget: {
      paddingBottom: '1.5em',
      paddingLeft: '0.75em',
      paddingRight: '0.75em',
      width: '50%'
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
    widgets: {
      alignItems: 'flex-start',
      display: 'flex',
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    filters: {
      paddingTop: '1.5em',
      paddingBottom: '1em'
    },
    topProductsWidget: {
      paddingBottom: '1.5em'
    }
  };

  // downloadCsv () {
  //   const csv = Papa.unparse({
  //     fields: [ 'Column 1', 'Column 2' ],
  //     data: [
  //   		[ 'foo', 'bar' ],
  //   		[ 'abc', 'def' ]
  //     ]
  //   });
  //
  //   const csvData = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' });
  //   // Fix for IE11, see: https://github.com/mholt/PapaParse/issues/175
  //   const csvUrl = navigator.msSaveBlob ? navigator.msSaveBlob(csvData, 'download.cv') : window.URL.createObjectURL(csvData);
  //   const a = window.document.createElement('a');
  //   a.href = csvUrl;
  //   a.setAttribute('download', 'download.csv');
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }

  render () {
    const styles = this.constructor.styles;
    const {
      children, dateDataConfig, eventsById, events, loadTopMedia, loadTopPeople, location, location:
      { query: { ages, brandActivityEvents, endDate, genders, languages, startDate } },
      keyMetrics, routerPushWithReturnTo, topMedia, topPeople
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
              <span>{keyMetrics.get('taggedProducts') || 0}</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Brand subscriptions'>
              <span>{keyMetrics.get('brandSubscriptions') || 0}</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Product impressions'>
              <span>{keyMetrics.get('productImpressions') || 0}</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Product views'>
              <span>{keyMetrics.get('productViews') || 0}</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Product buys'>
              <span>{keyMetrics.get('productBuys') || 0}</span>
            </NumberWidget>
            <NumberWidget style={styles.numberWidget} title='Conversion'>
              <span>{keyMetrics.get('conversion') || 0}%</span>
            </NumberWidget>
          </div>
          <Widget
            header={
              <MultiSelectInput
                first
                getItem={(id) => eventsById.get(id)}
                getItemText={(id) => eventsById.getIn([ id, 'description' ])}
                input={{ value: typeof brandActivityEvents === 'string' ? [ brandActivityEvents ] : brandActivityEvents }}
                name='brandActivityEvents'
                options={events.get('data').map((e) => e.get('id')).toJS()}
                placeholder='Events'
                style={[ styles.field, { paddingRight: '0.75em' } ]}
                valueComponent={ColorValue}
                onChange={this.onChangeFilter.bind(this, 'brandActivityEvents', 'array')} />
            }
            style={styles.paddingBottom} title='Brand activity'>
            {/* <button onClick={(e) => { e.preventDefault(); this.downloadCsv(); }}>
              Donwload csv
            </button> */}
            <Highcharts config={dateDataConfig} isPureConfig />
          </Widget>
          <div style={styles.widgets}>
            <TopMedia
              data={topMedia}
              load={() => loadTopMedia(location.query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.widget} />
            <TopPeople
              data={topPeople}
              load={() => loadTopPeople(location.query)}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.widget} />
          </div>
          <TopProducts
            data={topMedia}
            load={() => loadTopPeople(location.query)}
            location={location}
            routerPushWithReturnTo={routerPushWithReturnTo}
            style={styles.topProductsWidget}/>
          <div style={styles.widgets}>
            <Widget style={styles.widget} title='Age'>
              <Highcharts config={ageConfig} isPureConfig />
            </Widget>
            <Widget style={styles.widget} title='Gender'>
              <Highcharts config={genderConfig} isPureConfig />
            </Widget>
          </div>
          <MapWidget style={styles.paddingBottom} title='Brand activity by region' />

          <DemographicsWidget style={styles.paddingBottom} title='Demographics' />
          <OpportunitiesWidget style={styles.paddingBottom}/>
        </Container>
        {children}
      </SideMenu>
    );
  }
}
