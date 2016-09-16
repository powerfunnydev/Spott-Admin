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
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form/immutable';
import SelectInput from '../_common/inputs/selectInput';
import { colors, fontWeights, makeTextStyle, mediaQueries, Container } from '../_common/styles';
import { FETCHING } from '../../constants/statusTypes';
import * as actions from './actions';
import { eventsFilterSelector, mediaFilterSelector } from './selector';

HighchartsMore(Highcharts.Highcharts);
HighchartsExporting(Highcharts.Highcharts);

const timelineConfig = {
  chart: {
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    }
  },
  colors: [
    '#643dfa',
    '#f0b609'
  ],
  credits: false,
  title: {
    text: null
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: { // don't display the dummy year
      month: '%e. %b',
      year: '%b'
    },
    title: {
      text: 'Date'
    }
  },
  yAxis: {
    title: {
      text: null
    },
    min: 0
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#ced6da',
    borderRadius: 2,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">All Events ({point.x:%a %e %b})</p>',
    pointFormat: '<p style="font-size: 12px; margin-bottom: 7px; margin-left: 3px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y}</b></p>',
    shared: true,
    style: {
      padding: 7
    },
    useHTML: true
  },

  plotOptions: {
    spline: {
      marker: {
        enabled: true
      }
    }
  },
  series: [ {
    name: 'Dagelijkse Kost',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
    data: [
      [ Date.UTC(1970, 0, 1), 210 ],
      [ Date.UTC(1970, 0, 2), 220 ],
      [ Date.UTC(1970, 0, 3), 240 ],
      [ Date.UTC(1970, 0, 4), 300 ],
      [ Date.UTC(1970, 0, 5), 230 ],
      [ Date.UTC(1970, 0, 6), 170 ]
    ]
  }, {
    name: 'Familie',
    data: [
      [ Date.UTC(1970, 0, 1), 120 ],
      [ Date.UTC(1970, 0, 2), 120 ],
      [ Date.UTC(1970, 0, 3), 140 ],
      [ Date.UTC(1970, 0, 4), 100 ],
      [ Date.UTC(1970, 0, 5), 140 ],
      [ Date.UTC(1970, 0, 6), 170 ]
    ]
  } ]
};

const ageConfig = {
  chart: {
    polar: true,
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'line'
  },
  colors: [
    '#643dfa',
    '#f0b609'
  ],
  credits: false,
  title: {
    text: null
  },
  pane: {
    size: '75%',
    startAngle: -30
  },
  xAxis: {
    categories: [ '-18', '18-25', '26-35', '36-45', '46-65', '66+' ],
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    },
    tickmarkPlacement: 'on',
    lineWidth: 0
  },
  yAxis: {
    gridLineInterpolation: 'polygon',
    lineWidth: 0,
    min: 0,
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    }
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#ced6da',
    borderRadius: 2,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">All Events ({point.x})</p>',
    pointFormat: '<p style="font-size: 12px; margin-bottom: 7px; margin-left: 3px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y}</b></p>',
    shared: true,
    style: {
      padding: 7
    },
    useHTML: true
  },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    itemStyle: {
      color: '#17262b',
      font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
    }
  },
  series: [ {
    name: 'Dagelijkse Kost',
    data: [ 430, 190, 600, 350, 170, 20 ]
  }, {
    name: 'Familie',
    data: [ 500, 390, 420, 310, 260, 25 ]
  } ]
};

const genderConfig = {
  chart: {
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'column'
  },
  colors: [
    '#643dfa',
    '#f0b609'
  ],
  credits: false,
  title: {
    text: null
  },
  xAxis: {
    categories: [ 'Male', 'Female' ],
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: null
    },
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    },
    stackLabels: {
      enabled: true,
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif',
        textShadow: 'none'
      }
    }
  },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    itemStyle: {
      color: '#17262b',
      font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
    }
  },
  tooltip: {
    // headerFormat: '<b>{point.x}</b><br/>',
    // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    backgroundColor: '#ffffff',
    borderColor: '#ced6da',
    borderRadius: 2,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    headerFormat:
      `<div style="color: #6d8791; margin-left: -11px; margin-right: -11px; margin-bottom: 2px; margin-top: -11px;">
         <p style="font-size: 10px; margin-bottom: 10px;">All Events</p>
         <p style="font-size: 12px;">{point.x}\u00a0\u00a0\u00a0\u00a0<b style="color: #17262b;">56%</b></p>
      </div>`,
    pointFormat:
      `<div style="font-size: 12px; margin-left: -10px; margin-right: -10px;">
        <div style="margin-right: 5px; height: 20px; width: 4px; border-left-width: 1px; border-left-style: solid; border-left-color: #ced6da; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #ced6da; display: inline-block;">\u00a0</div>
        <div style="display: inline-block;vertical-align: bottom; margin-bottom: -6px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y}</b></div>
      </div>`,
    shared: true,
    style: {
      padding: 21
    },
    // hideDelay: 30000000,
    useHTML: true
  },
  plotOptions: {
    column: {
      stacking: 'normal'
    }
  },
  series: [ {
    name: 'Dagelijkse Kost',
    data: [ 300, 380 ]
  }, {
    name: 'Familie',
    data: [ 350, 350 ]
  } ]
};

const locationConfig = {
  chart: {
    polar: true,
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'line'
  },
  colors: [
    '#643dfa',
    '#f0b609'
  ],
  credits: false,
  title: {
    text: null
  },
  pane: {
    size: '75%',
    startAngle: -30
  },
  xAxis: {
    categories: [ 'Antwerp', 'Limburg', 'O. Vla', 'W. Vla', 'Brussel', 'Vla. Bra' ],
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    },
    tickmarkPlacement: 'on',
    lineWidth: 0
  },
  yAxis: {
    gridLineInterpolation: 'polygon',
    lineWidth: 0,
    min: 0,
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    }
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#ced6da',
    borderRadius: 2,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">All Events ({point.x})</p>',
    pointFormat: '<p style="font-size: 12px; margin-bottom: 7px; margin-left: 3px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y}</b></p>',
    shared: true,
    style: {
      padding: 7
    },
    useHTML: true
  },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    itemStyle: {
      color: '#17262b',
      font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
    }
  },
  series: [ {
    name: 'Dagelijkse Kost',
    data: [ 430, 190, 600, 350, 170, 20 ]
  }, {
    name: 'Familie',
    data: [ 500, 390, 420, 310, 260, 25 ]
  } ]
};

@Radium
class Widget extends Component {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static styles = {
    container: {
      borderRadius: 2,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#ced6da'
    },
    header: {
      backgroundColor: '#eaeced',
      paddingTop: '0.625em',
      paddingBottom: '0.625em',
      paddingLeft: '1em',
      paddingRight: '1em',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: '#ced6da'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: '#6d8791',
      textTransform: 'uppercase'
    },
    content: {
      backgroundColor: 'white',
      paddingTop: '2em',
      paddingBottom: '2em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, style, title } = this.props;
    return (
      <div style={[ styles.container, style ]}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

@connect(mediaFilterSelector, (dispatch) => ({
  searchSeries: bindActionCreators(actions.searchSeries, dispatch)
}))
@reduxForm({
  form: 'reportingMediaFilter',
  initialValues: {
    fromDate: moment().startOf('day').subtract(1, 'months').date(1).toDate(),
    toDate: moment().toDate()
  }
})
@Radium
class MediaFilterForm extends Component {

  static propTypes = {
    searchSeries: PropTypes.func.isRequired,
    searchedSeriesIds: ImmutablePropTypes.map.isRequired,
    seriesById: ImmutablePropTypes.map,
    style: PropTypes.object
  };

  static styles = {
    mediaFilter: {
      paddingTop: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { searchSeries, seriesById, searchedSeriesIds, style } = this.props;
    return (
      <form style={style}>
        <Field
          component={SelectInput}
          getItemText={(id) => seriesById.getIn([ id, 'title', seriesById.getIn([ id, 'defaultLocale' ]) ])}
          getOptions={searchSeries}
          isLoading={searchedSeriesIds.get('_status') === FETCHING}
          label='Filter Content'
          multiselect
          name='series'
          options={searchedSeriesIds.get('data').toJS()}
          placeholder='Series'
          style={styles.mediaFilter}
          onChange={(e) => console.warn('UPDATE', e)} />
      </form>
    );
  }
}

@connect(eventsFilterSelector, (dispatch) => ({
  searchEvents: bindActionCreators(actions.searchSeries, dispatch)
}))
@reduxForm({
  form: 'reportingEventsFilter'
})
@Radium
class EventsFilterForm extends Component {

  static propTypes = {
    eventsById: ImmutablePropTypes.map,
    searchEvents: PropTypes.func.isRequired,
    searchedEventIds: ImmutablePropTypes.map.isRequired,
    style: PropTypes.object
  };

  static styles = {
    eventsFilter: {
      paddingTop: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { eventsById, searchEvents, searchedEventIds, style } = this.props;
    return (
      <form style={style}>
        <Field
          component={SelectInput}
          getItemText={(id) => eventsById.getIn([ id, 'title', eventsById.getIn([ id, 'defaultLocale' ]) ])}
          getOptions={searchEvents}
          isLoading={searchedEventIds.get('_status') === FETCHING}
          multiselect
          name='events'
          options={searchedEventIds.get('data').toJS()}
          placeholder='Events'
          style={styles.eventsFilter}
          onChange={(e) => console.warn('UPDATE', e)} />
      </form>
    );
  }
}

@Radium
export default class ReportingActivity extends Component {

  static propTypes = {

  };

  static styles = {
    eventsFilterForm: {
      paddingBottom: '1.5em',
      [mediaQueries.medium]: {
        width: '25%'
      }
    },
    mediaFilterForm: {
      paddingTop: '1.5em',
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
    widget: {
      small: {
        width: '100%',
        marginBottom: '1.75em',
        paddingLeft: '0.75em',
        paddingRight: '0.75em',
        [mediaQueries.medium]: {
          display: 'inline-block',
          width: '33.333333%'
        }
      },
      timeline: {
        marginBottom: '1.75em'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    return (
      <div>
        <Container>
          <MediaFilterForm style={styles.mediaFilterForm} />
        </Container>

        <div style={styles.charts}>
          <Container>
            <EventsFilterForm style={styles.eventsFilterForm} />
            <Widget style={styles.widget.timeline} title='Timeline'>
              <Highcharts config={timelineConfig} isPureConfig />
            </Widget>
            <div style={styles.widgets}>
              <div style={styles.widget.small}>
                <Widget title='Age'>
                  <Highcharts config={ageConfig} isPureConfig />
                </Widget>
              </div>
              <div style={[ styles.widget.small, styles.widget.middle ]}>
                <Widget title='Gender'>
                  <Highcharts config={genderConfig} isPureConfig />
                </Widget>
              </div>
              <div style={styles.widget.small}>
                <Widget title='Location'>
                  <Highcharts config={locationConfig} isPureConfig />
                </Widget>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
