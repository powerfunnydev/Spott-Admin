/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Highcharts from 'react-highcharts';
import HighchartsExporting from 'highcharts-exporting';
import HighchartsExportCsv from 'highcharts-export-csv';
import HighchartsMore from 'highcharts-more';
import Papa from 'papaparse';
import * as globalActions from '../../../actions/global';
import ListView from '../../_common/components/listView/index';
import { tableDecorator } from '../../_common/components/table/index';
import MultiSelectInput from '../../_common/inputs/multiSelectInput';
import { colors, fontWeights, makeTextStyle, Container } from '../../_common/styles';
import SelectInput from '../../_common/inputs/selectInput';
import { FETCHING, isLoading } from '../../../constants/statusTypes';
import { SideMenu } from '../../app/sideMenu';
import Header from '../../app/multiFunctionalHeader';
import Filters from './filters';
import NumberWidget from './numberWidget';
import MarkersMap from '../_markersMap';
import Widget from './widget';
import ImageTitle from './imageTitle';
import * as actions from './actions';
import selector, { topMediaPrefix, topPeoplePrefix, topProductsPrefix, topCommercialsPrefix } from './selector';
import HamburgerDropdown, { styles as dropdownStyles } from '../../_common/components/hamburgerDropdown';

HighchartsMore(Highcharts.Highcharts);
HighchartsExporting(Highcharts.Highcharts);
HighchartsExportCsv(Highcharts.Highcharts);

const actionTypes = {
  PRINT: 'PRINT',
  PNG: 'PNG',
  JPEG: 'JPEG',
  PDF: 'PDF',
  SVG: 'SVG',
  CSV: 'CSV'
};

Highcharts.Highcharts.setOptions({
  navigation: {
    buttonOptions: {
      enabled: false
    }
  }
});

const colorStyle = {
  borderRadius: '100%',
  height: 6,
  width: 6,
  marginRight: 6
};

function getFormatedDate (dateString) {
  const date = new Date(dateString);
  return moment(date).format('YYYY-MM-DD HH:mm');
}

// Generic method that generate a CSV file.
function downloadCsv (columns, data, title = 'download') {
  const newColumns = columns.map((column) => column.title[0].toUpperCase() + column.title.slice(1).toLowerCase());
  const newData = data.get('data').map((item, index) => {
    return columns.map((column, subindex) => {
      if (column.dataType === 'date') {
        return getFormatedDate(item.get(column.name));
      }
      const result = (column.convert || ((text) => text))(column.name ? item.get(column.name) : item);
      if (typeof result === 'object') {
        return result.props.title;
      }
      return result;
    });
  });
  const csv = Papa.unparse({
    fields: newColumns,
    data: newData.toJS()
  });

  const csvData = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' });
  // Fix for IE11, see: https://github.com/mholt/PapaParse/issues/175
  const csvUrl = navigator.msSaveBlob ? navigator.msSaveBlob(csvData, 'download.cv') : window.URL.createObjectURL(csvData);
  const a = window.document.createElement('a');
  a.href = csvUrl;
  a.setAttribute('download', title.concat('.csv'));
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

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
    style: PropTypes.object,
    onSortField: PropTypes.func.isRequired
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
    const { data, load, location: { query: { topMediaSortDirection, topMediaSortField } }, style, onSortField } = this.props;

    const columns = [
      { clickable: true, colspan: 3, convert: this.getTitle, title: 'TITLE', type: 'custom' },
      { clickable: true, colspan: 1, name: 'taggedProductCount', sort: true, sortField: 'TAGGED_PRODUCT_COUNT', title: 'TAGGED PRODUCTS', type: 'custom' },
      { clickable: true, colspan: 1, name: 'subscriptionCount', sort: true, sortField: 'SUBSCRIBER_COUNT', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    return (
      <Widget
        header={
          <HamburgerDropdown style={{ marginLeft: 'auto' }}>
            <div key='CSV' style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); downloadCsv(columns, data, 'TopMedia'); }}>Download CSV</div>
          </HamburgerDropdown>
        }
        style={style}
        title='Top media for your brand'>
        <div style={listViewContainerStyle}>
          <ListView
            columns={columns}
            data={data}
            load={load}
            sortDirection={topMediaSortDirection}
            sortField={topMediaSortField}
            onSortField={(name) => (...args) => {
              // Update url
              onSortField(name, ...args);
              // Trigger load actions
              load();
            }} />
        </div>
      </Widget>
    );
  }
}

@tableDecorator(topCommercialsPrefix)
class TopCommercials extends Component {

  static propTypes = {
    data: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    style: PropTypes.object,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.getTitle = ::this.getTitle;
  }

  getTitle (topCommercials) {
    return (
      <ImageTitle
        imageUrl={topCommercials.getIn([ 'commercial', 'posterImage', 'url' ])}
        title={topCommercials.getIn([ 'commercial', 'title' ])}/>
    );
  }

  render () {
    const { data, load, location: { query: { topCommercialsSortDirection, topCommercialsSortField } }, style, onSortField } = this.props;

    const columns = [
      { clickable: true, colspan: 3, convert: this.getTitle, title: 'TITLE', type: 'custom' },
      { clickable: true, colspan: 1, name: 'syncs', sort: true, sortField: 'SYNCS', title: 'SYNCS', type: 'custom' },
      { clickable: true, colspan: 1, name: 'bannerClicks', sort: true, sortField: 'BANNER_CLICKS', title: 'BANNER CLICKS', type: 'custom' }
    ];

    return (
      <Widget
        header={
          <HamburgerDropdown style={{ marginLeft: 'auto' }}>
            <div key='CSV' style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); downloadCsv(columns, data, 'topCommercials'); }}>Download CSV</div>
          </HamburgerDropdown>
        }
        style={style}
        title='Commercials for your brand'>
        <div style={listViewContainerStyle}>
          <ListView
            columns={columns}
            data={data}
            load={load}
            sortDirection={topCommercialsSortDirection}
            sortField={topCommercialsSortField}
            onSortField={(name) => (...args) => {
              // Update url
              onSortField(name, ...args);
              // Trigger load actions
              load();
            }} />
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
    style: PropTypes.object,
    onSortField: PropTypes.func.isRequired
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
    const { data, load, location: { query: { topPeopleSortDirection, topPeopleSortField } }, style, onSortField } = this.props;

    const columns = [
      { clickable: true, colspan: 3, convert: this.getTitle, title: 'TITLE', type: 'custom' },
      { clickable: true, colspan: 1, name: 'taggedProductCount', sort: true, sortField: 'TAGGED_PRODUCT_COUNT', title: 'TAGGED PRODUCTS', type: 'custom' },
      { clickable: true, colspan: 1, name: 'subscriptionCount', sort: true, sortField: 'SUBSCRIBER_COUNT', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    return (
      <Widget
        header={
          <HamburgerDropdown style={{ marginLeft: 'auto' }}>
            <div key='CSV' style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); downloadCsv(columns, data, 'TopPeople'); }}>Download CSV</div>
          </HamburgerDropdown>
        }
        style={style}
        title='Top people and characters for your brand'>
        <div style={listViewContainerStyle}>
          <ListView
            columns={columns}
            data={data}
            load={load}
            sortDirection={topPeopleSortDirection}
            sortField={topPeopleSortField}
            onSortField={(name) => (...args) => {
              // Update url
              onSortField(name, ...args);
              // Trigger load actions
              load();
            }} />
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
    style: PropTypes.object,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.getTitle = ::this.getTitle;
  }

  getTitle (topProduct) {
    return (
      <ImageTitle
        imageUrl={topProduct.getIn([ 'product', 'logo', 'url' ])}
        title={topProduct.getIn([ 'product', 'fullName' ])}/>
    );
  }

  getSales (topProduct) {
    // TODO Add support for other currencies.
    return `€ ${topProduct.getIn([ 'sales', 'amount' ])}`;
  }

  render () {
    const { data, load, location: { query: { topProductsSortDirection, topProductsSortField } }, style, onSortField } = this.props;

    const columns = [
      { clickable: true, colspan: 3, convert: this.getTitle, title: 'TITLE', type: 'custom' },
      { clickable: true, colspan: 1, name: 'clicks', sort: true, sortField: 'CLICKS', title: 'CLICKS', type: 'custom' },
      { clickable: true, colspan: 1, name: 'buys', sort: true, sortField: 'BUYS', title: 'BUYS', type: 'custom' },
      { clickable: true, colspan: 1, convert: this.getSales, sort: true, sortField: 'TOTAL_SALES', title: 'EST. SALES', type: 'custom' }
    ];

    return (
      <Widget
        header={
          <HamburgerDropdown style={{ marginLeft: 'auto' }}>
            <div key='CSV' style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); downloadCsv(columns, data, 'TopProducts'); }}>Download CSV</div>
          </HamburgerDropdown>
        }
        style={style}
        title='Top products for your brand'>
        <div style={listViewContainerStyle}>
          <ListView
            columns={columns}
            data={data}
            load={load}
            sortDirection={topProductsSortDirection}
            sortField={topProductsSortField}
            onSortField={(name) => (...args) => {
              // Update url
              onSortField(name, ...args);
              // Trigger load actions
              load();
            }} />
        </div>
      </Widget>
    );
  }
}

@connect(selector, (dispatch) => ({
  fetchBrand: bindActionCreators(actions.fetchBrand, dispatch),
  loadAgeData: bindActionCreators(actions.loadAgeData, dispatch),
  loadDateData: bindActionCreators(actions.loadDateData, dispatch),
  loadEvents: bindActionCreators(actions.loadEvents, dispatch),
  loadGenderData: bindActionCreators(actions.loadGenderData, dispatch),
  loadLocationData: bindActionCreators(actions.loadLocationData, dispatch),
  loadKeyMetrics: bindActionCreators(actions.loadKeyMetrics, dispatch),
  loadTopMedia: bindActionCreators(actions.loadTopMedia, dispatch),
  loadTopPeople: bindActionCreators(actions.loadTopPeople, dispatch),
  loadTopProducts: bindActionCreators(actions.loadTopProducts, dispatch),
  loadTopCommercials: bindActionCreators(actions.loadTopCommercials, dispatch),
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch),
  searchBrands: bindActionCreators(actions.searchBrands, dispatch)
}))
@Radium
export default class BrandDashboard extends Component {

  static propTypes = {
    ageDataConfig: PropTypes.object.isRequired,
    brandsById: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    dateDataConfig: PropTypes.object.isRequired,
    events: ImmutablePropTypes.map.isRequired,
    eventsById: ImmutablePropTypes.map.isRequired,
    fetchBrand: PropTypes.func.isRequired,
    genderDataConfig: PropTypes.object.isRequired,
    loadAgeData: PropTypes.func.isRequired,
    loadDateData: PropTypes.func.isRequired,
    loadEvents: PropTypes.func.isRequired,
    loadGenderData: PropTypes.func.isRequired,
    loadKeyMetrics: PropTypes.func.isRequired,
    loadLocationData: PropTypes.func.isRequired,
    loadTopCommercials: PropTypes.func.isRequired,
    loadTopMedia: PropTypes.func.isRequired,
    loadTopPeople: PropTypes.func.isRequired,
    loadTopProducts: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    topMedia: ImmutablePropTypes.map.isRequired,
    topCommercials: ImmutablePropTypes.map.isRequired,
    topPeople: ImmutablePropTypes.map.isRequired,
    topProducts: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeFilter = ::this.onChangeFilter;
    this.hideBar = ::this.hideBar;
    this.state = { headerHidden: false };
  }

  async componentDidMount () {
    const location = this.props.location;
    let brand;
    try {
      if (location.query.brand) {
        await this.props.fetchBrand({ brandId: location.query.brand });
      } else {
        const brands = await this.props.searchBrands();
        if (brands.length > 0) {
          // Ùse first brand id.
          brand = brands[0].id;
        }
      }
    } catch (e) {
      console.warn('Error', e);
    }

    const query = {
      brand,
      brandActivityByRegionEvent: 'PRODUCT_IMPRESSIONS',
      brandActivityEvents: [ 'PRODUCT_IMPRESSIONS' ],
      // We assume the ALL event will be always there.
      endDate: moment().startOf('day').format('YYYY-MM-DD'),
      startDate: moment().startOf('day').subtract(1, 'months').date(1).format('YYYY-MM-DD'),
      ...location.query
    };
    await this.props.routerPushWithReturnTo({ ...location, query });

    await this.props.loadEvents();
    await this.props.loadKeyMetrics();
    await this.props.loadDateData();
    await this.props.loadTopMedia();
    await this.props.loadTopPeople();
    await this.props.loadTopProducts();
    await this.props.loadTopCommercials();
    await this.props.loadAgeData();
    await this.props.loadGenderData();
    await this.props.loadLocationData();
  }

  /*
   * This function triggers an method, depending on the given actionType.
   */
  downloadFile (actionType = actionTypes.PNG) {
    const chart = this.refs.brandActivityHighchart.getChart();
    actionType === actionTypes.PRINT && chart.print();
    actionType === actionTypes.PNG && chart.exportChart();
    actionType === actionTypes.JPEG && chart.exportChart({ type: 'image/jpeg' });
    actionType === actionTypes.PDF && chart.exportChart({ type: 'application/pdf' });
    actionType === actionTypes.SVG && chart.exportChart({ type: 'image/svg+xml' });
    actionType === actionTypes.CSV && chart.downloadCSV();
  }

  hideBar (event) {
    const { headerHidden } = this.state;
    event.currentTarget.scrollTop > 70 ?
       !headerHidden && this.setState({ headerHidden: true })
       : headerHidden && this.setState({ headerHidden: false });
  }

  async onChangeFilter (field, type, value) {
    await this.props.routerPushWithReturnTo({
      ...this.props.location,
      query: {
        ...this.props.location.query,
        [field]: type === 'date' ? value.format('YYYY-MM-DD') : value
      }
    });

    if (field === 'brandActivityEvents') {
      // If the brandActivityEvents are changed we only need to update the date data.
      await this.props.loadDateData();
    } else if (field === 'brandActivityByRegionEvent') {
      await this.props.loadLocationData();
    } else {
      await this.props.loadKeyMetrics();
      await this.props.loadDateData();
      await this.props.loadTopMedia();
      await this.props.loadTopPeople();
      await this.props.loadTopProducts();
      await this.props.loadTopCommercials();
      await this.props.loadAgeData();
      await this.props.loadGenderData();
      await this.props.loadLocationData();
    }
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
      // position: 'fixed'
    },
    fixedFilters: {
      position: 'fixed',
      left: 200,
      right: 0,
      top: 0,
      backgroundColor: colors.white,
      zIndex: 10,
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    },
    topMediaWidget: {
      paddingBottom: '1.5em'
    },
    topProductsWidget: {
      paddingBottom: '1.5em'
    },
    brand: {
      width: '100%',
      maxWidth: 200
    },
    slash: {
      ...makeTextStyle(fontWeights.regular, '17px'),
      color: colors.lightGray3
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      ageDataConfig, brandsById, children, dateDataConfig, eventsById, events, genderDataConfig,
      loadTopMedia, loadTopPeople, loadTopProducts, loadTopCommercials,
      location, location: { query: { ages, brand, brandActivityByRegionEvent, brandActivityEvents, endDate, genders, /* languages, */ startDate } },
      keyMetrics, markers, routerPushWithReturnTo, searchBrands, searchedBrandIds, topMedia, topPeople, topProducts, topCommercials
    } = this.props;
    const { headerHidden } = this.state;
    const brandActivityEventsValue = typeof brandActivityEvents === 'string' ? [ brandActivityEvents ] : brandActivityEvents;

    return (
      <SideMenu location={location} onScroll={this.hideBar}>
        <Header hierarchy={[ { title: 'Dashboard', url: '/brand-dashboard' } ]}>
          <SelectInput
            first
            getItemText={(id) => brandsById.getIn([ id, 'name' ])}
            getOptions={searchBrands}
            input={{ value: brand }}
            isLoading={searchedBrandIds.get('_status') === FETCHING}
            name='brand'
            options={searchedBrandIds.get('data').toJS()}
            placeholder='Brand name'
            required
            style={styles.brand}
            onChange={this.onChangeFilter.bind(this, 'brand', 'string')}/>
          <span style={styles.slash}>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        </Header>
        <div style={headerHidden ? { visibility: 'visible', height: 102 } : { visibility: 'hidden' }} />
        <Container>
          <Filters
            fields={{
              ages: typeof ages === 'string' ? [ ages ] : ages,
              genders: typeof genders === 'string' ? [ genders ] : genders,
              // languages: typeof languages === 'string' ? [ languages ] : languages,
              endDate: moment(endDate),
              startDate: moment(startDate)
            }}
            style={[ styles.filters, headerHidden && styles.fixedFilters ]}
            onChange={this.onChangeFilter}/>
        </Container>
        <Container style={styles.wrapper}>
          <div style={styles.numberWidgets}>
            <NumberWidget style={styles.numberWidget} title='Tagged products'>
              <span>{keyMetrics.get('taggedProductCount') || 0}</span>
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
              <span>{keyMetrics.get('productConversionRatePercentage') || 0}%</span>
            </NumberWidget>
          </div>
          <Widget
            header={
              <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                <MultiSelectInput
                  first
                  getItem={(id) => eventsById.get(id)}
                  getItemText={(id) => eventsById.getIn([ id, 'description' ])}
                  input={{ value: brandActivityEventsValue }}
                  multiselect
                  name='brandActivityEvents'
                  options={events.get('data').map((e) => e.get('id')).toJS()}
                  placeholder='Events'
                  style={[ styles.field, { paddingRight: '0.75em' } ]}
                  valueComponent={ColorValue}
                  onChange={this.onChangeFilter.bind(this, 'brandActivityEvents', 'array')} />
                  <HamburgerDropdown style={{ marginLeft: 'auto' }}>
                    <div key='print' style={dropdownStyles.floatOption} onClick={this.downloadFile.bind(this, actionTypes.PRINT)}>Print</div>
                    <div key='png' style={dropdownStyles.floatOption} onClick={this.downloadFile.bind(this, actionTypes.PNG)}>Download PNG</div>
                    <div key='jpeg' style={dropdownStyles.floatOption} onClick={this.downloadFile.bind(this, actionTypes.JPEG)}>Download JPEG</div>
                    <div key='pdf' style={dropdownStyles.floatOption} onClick={this.downloadFile.bind(this, actionTypes.PDF)}>Download PDF</div>
                    <div key='svg' style={dropdownStyles.floatOption} onClick={this.downloadFile.bind(this, actionTypes.SVG)}>Download SVG</div>
                    <div key='csv' style={dropdownStyles.floatOption} onClick={this.downloadFile.bind(this, actionTypes.CSV)}>Download CSV</div>
                  </HamburgerDropdown>
              </div>
            }
            isLoading={isLoading(dateDataConfig)}
            style={styles.paddingBottom} title='Brand activity'>
            <Highcharts config={dateDataConfig.get('data')} isPureConfig ref='brandActivityHighchart'/>
          </Widget>
          <TopMedia
            data={topMedia}
            load={loadTopMedia}
            location={location}
            routerPushWithReturnTo={routerPushWithReturnTo}
            style={styles.topMediaWidget} />
          <div style={styles.widgets}>
            <TopCommercials
              data={topCommercials}
              load={loadTopCommercials}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.widget} />
            <TopPeople
              data={topPeople}
              load={loadTopPeople}
              location={location}
              routerPushWithReturnTo={routerPushWithReturnTo}
              style={styles.widget} />
          </div>
          <TopProducts
            data={topProducts}
            load={loadTopProducts}
            location={location}
            routerPushWithReturnTo={routerPushWithReturnTo}
            style={styles.topProductsWidget}/>
          <div style={styles.widgets}>
            <Widget isLoading={isLoading(ageDataConfig)} style={styles.widget} title='Age'>
              <Highcharts config={ageDataConfig.get('data')} isPureConfig />
            </Widget>
            <Widget isLoading={isLoading(genderDataConfig)} style={styles.widget} title='Gender'>
              <Highcharts config={genderDataConfig.get('data')} isPureConfig />
            </Widget>
          </div>
          <Widget
            header={
              <MultiSelectInput
                first
                getItem={(id) => eventsById.get(id)}
                getItemText={(id) => eventsById.getIn([ id, 'description' ])}
                input={{ value: brandActivityByRegionEvent }}
                name='brandActivityByRegionEvent'
                options={events.get('data').map((e) => e.get('id')).toJS()}
                placeholder='Event'
                style={[ styles.field, { paddingRight: '0.75em' } ]}
                valueComponent={ColorValue}
                onChange={this.onChangeFilter.bind(this, 'brandActivityByRegionEvent', 'string')} />
              }
            isLoading={isLoading(markers)}
            style={styles.paddingBottom}
            title='Brand activity by region'>
            <MarkersMap markers={markers.get('data')} />
          </Widget>

          {/* <DemographicsWidget style={styles.paddingBottom} title='Demographics' />
          <OpportunitiesWidget style={styles.paddingBottom}/> */}
        </Container>
        {children}
      </SideMenu>
    );
  }
}
