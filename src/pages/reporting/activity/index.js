import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Highcharts from 'react-highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { routerPushWithReturnTo } from '../../../actions/global';
import moment from 'moment';
// Note that Highcharts has to be in the codebase already
// Highcharts more
import HighchartsMore from 'highcharts-more';
// Highcharts exporting
import HighchartsExporting from 'highcharts-exporting';
import HighchartsExportCsv from 'highcharts-export-csv';
import Widget, { largeWidgetStyle, mediumWidgetStyle } from '../widget';
import { colors, fontWeights, makeTextStyle, Container } from '../../_common/styles';
import { isLoading } from '../../../constants/statusTypes';
import ActivityFilterForm from './filters';
import * as actions from './actions';
import { activitySelector } from './selector';
import { arraysEqual, slowdown } from '../../../utils';
import MarkersMap from '../_markersMap';
import HamburgerDropdown, { styles as dropdownStyles } from '../../_common/components/hamburgerDropdown';
import { actionTypes, downloadFile, renderHamburgerDropdown } from '../highchart';

HighchartsMore(Highcharts.Highcharts);
HighchartsExporting(Highcharts.Highcharts);
HighchartsExportCsv(Highcharts.Highcharts);

Highcharts.Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

@connect(activitySelector, (dispatch) => ({
  loadActivities: bindActionCreators(actions.loadActivities, dispatch),
  loadLocationData: bindActionCreators(actions.loadLocationData, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReportingActivity extends Component {

  static propTypes = {
    ageConfig: PropTypes.object.isRequired,
    genderConfig: PropTypes.object.isRequired,
    isLoadingAge: PropTypes.bool.isRequired,
    isLoadingGender: PropTypes.bool.isRequired,
    isLoadingTimeline: PropTypes.bool.isRequired,
    loadActivities: PropTypes.func.isRequired,
    loadLocationData: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    markers: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    timelineConfig: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeActivityFilter = ::this.onChangeActivityFilter;
    this.loadActivities = slowdown(props.loadActivities, 300);
  }

  async componentDidMount () {
    const location = this.props.location;
    const query = {
      // We assume the ALL event will be always there.
      endDate: moment().startOf('day').format('YYYY-MM-DD'),
      events: [ 'MEDIUM_SUBSCRIPTIONS' ],
      startDate: moment().startOf('day').subtract(1, 'months').date(1).format('YYYY-MM-DD'),
      ...location.query
    };
    await this.props.routerPushWithReturnTo({ ...location, query });
    await this.loadActivities(query);
    await this.props.loadLocationData();
  }

  componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;

    if (query.endDate !== nextQuery.endDate ||
      !arraysEqual(query.events, nextQuery.events) ||
      query.startDate !== nextQuery.startDate ||
      !arraysEqual(query.media, nextQuery.media)) {
      this.loadActivities(nextProps.location.query);
      this.props.loadLocationData();
    }
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

  onChangeActivityFilter (field, type, value) {
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      query: {
        ...this.props.location.query,
        [field]: type === 'string' || type === 'array' ? value : value.format('YYYY-MM-DD')
      }
    });
  }

  static styles = {
    paddingBottom: {
      paddingBottom: '1.5em'
    },
    activityFilterForm: {
      paddingBottom: '1.5em'
    },
    header: {
      backgroundColor: colors.black
    },
    tab: {
      base: {
        ...makeTextStyle(fontWeights.bold, '0.75em', '0.237em'),
        color: 'white',
        opacity: 0.5,
        paddingBottom: '1em',
        paddingTop: '1em',
        textDecoration: 'none',
        textAlign: 'center',
        minWidth: '12.5em',
        display: 'inline-block',
        borderBottomWidth: 4,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.dark
      },
      active: {
        borderBottomColor: colors.darkPink,
        opacity: 1
      }
    },
    charts: {
      backgroundColor: colors.lightGray,
      paddingBottom: '1.5em',
      paddingTop: '1.5em',
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: '#ced6da'
    },
    widgets: {
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    dateRangeForm: {
      paddingTop: '1.5em',
      paddingBottom: '1.5em',
      display: 'flex',
      alignItems: 'center'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { ageConfig, genderConfig, isLoadingAge, isLoadingGender, isLoadingTimeline,
      location: { query: { startDate, endDate, events } }, markers, timelineConfig } = this.props;
    return (
      <div>
        <div style={styles.charts}>
          <Container>
            <ActivityFilterForm
              fields={{
                // TODO validation
                endDate: moment(endDate),
                startDate: moment(startDate),
                events: typeof events === 'string' ? [ events ] : (events || [])
              }}
              style={styles.activityFilterForm}
              onChange={this.onChangeActivityFilter} />
            <Widget
              header={
               renderHamburgerDropdown(this.refs.timelineHighchart)
              }
              isLoading={isLoadingTimeline}
              style={largeWidgetStyle}
              title='Timeline'>
              <Highcharts config={timelineConfig} isPureConfig ref='timelineHighchart'/>
            </Widget>
            <Widget
              isLoading={isLoading(markers)}
              style={largeWidgetStyle}
              title='Activity by region'>
              <MarkersMap markers={markers.get('data')} />
            </Widget>
            <div style={styles.widgets}>
              <Widget
                header={
                 renderHamburgerDropdown(this.refs.ageHighchart)
                }
                isLoading={isLoadingAge}
                style={mediumWidgetStyle} title='Age'>
                <Highcharts config={ageConfig} isPureConfig ref='ageHighchart'/>
              </Widget>
              <Widget
                header={
                 renderHamburgerDropdown(this.refs.genderHighchart)
                }
                isLoading={isLoadingGender}
                style={mediumWidgetStyle}
                title='Gender'>
                <Highcharts config={genderConfig} isPureConfig ref='genderHighchart'/>
              </Widget>
            </div>
              {/*
              <Widget title='Location'>
                <Highcharts config={locationConfig} isPureConfig />
              </Widget>
              */}
          </Container>
        </div>
      </div>
    );
  }
}
