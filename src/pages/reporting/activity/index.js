import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Highcharts from 'react-highcharts';
import { routerPushWithReturnTo } from '../../../actions/global';
import moment from 'moment';
// Note that Highcharts has to be in the codebase already
// Highcharts more
import HighchartsMore from 'highcharts-more';
// Highcharts exporting
import HighchartsExporting from 'highcharts-exporting';
import Widget, { largeWidgetStyle, mediumWidgetStyle } from '../widget';
import { colors, fontWeights, makeTextStyle, Container } from '../../_common/styles';
import ActivityFilterForm from './filters';
import * as actions from './actions';
import { activitySelector } from './selector';
import { arraysEqual, slowdown } from '../../../utils';

HighchartsMore(Highcharts.Highcharts);
HighchartsExporting(Highcharts.Highcharts);

Highcharts.Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

@connect(activitySelector, (dispatch) => ({
  loadActivities: bindActionCreators(actions.loadActivities, dispatch),
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
    location: PropTypes.object.isRequired,
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
  }

  componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;

    if (query.endDate !== nextQuery.endDate ||
      !arraysEqual(query.events, nextQuery.events) ||
      query.startDate !== nextQuery.startDate ||
      !arraysEqual(query.media, nextQuery.media)) {
      this.loadActivities(nextProps.location.query);
    }
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
    const { ageConfig, genderConfig, isLoadingAge, isLoadingGender, isLoadingTimeline, location: { query: { startDate, endDate, events } }, timelineConfig } = this.props;
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
            <Widget isLoading={isLoadingTimeline} style={largeWidgetStyle} title='Timeline'>
              <Highcharts config={timelineConfig} isPureConfig />
            </Widget>
            <div style={styles.widgets}>
              <Widget isLoading={isLoadingAge} style={mediumWidgetStyle} title='Age'>
                <Highcharts config={ageConfig} isPureConfig />
              </Widget>
              <Widget isLoading={isLoadingGender} style={mediumWidgetStyle} title='Gender'>
                <Highcharts config={genderConfig} isPureConfig />
              </Widget>
              {/*
              <Widget title='Location'>
                <Highcharts config={locationConfig} isPureConfig />
              </Widget>
              */}
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
