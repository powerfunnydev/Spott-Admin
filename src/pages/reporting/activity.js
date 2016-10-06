import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Highcharts from 'react-highcharts';
// Note that Highcharts has to be in the codebase already
// Highcharts more
import HighchartsMore from 'highcharts-more';
// Highcharts exporting
import HighchartsExporting from 'highcharts-exporting';
import Widget, { largeWidgetStyle, mediumWidgetStyle } from './widget';
import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';
import ActivityFilterForm from './forms/activityFilterForm';
import * as actions from './actions';
import { activitySelector } from './selector';

HighchartsMore(Highcharts.Highcharts);
HighchartsExporting(Highcharts.Highcharts);

@connect(activitySelector, (dispatch) => ({
  loadActivities: bindActionCreators(actions.loadActivities, dispatch)
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
    timelineConfig: PropTypes.object.isRequired
  };

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
    const { ageConfig, genderConfig, isLoadingAge, isLoadingGender, isLoadingTimeline, timelineConfig } = this.props;
    return (
      <div>
        <div style={styles.charts}>
          <Container>
            <ActivityFilterForm
              style={styles.activityFilterForm}
              onChange={() => this.props.loadActivities()} />
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
              {/* <Widget title='Location'>
                <Highcharts config={locationConfig} isPureConfig />
              </Widget> */}
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
