import { fromJS } from 'immutable';

export const timelineConfig = fromJS({
  chart: {
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    }
  },
  // colors: [
  //   '#643dfa'
  //   '#f0b609'
  // ],
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
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">{eventType} ({point.x:%a %e %b})</p>',
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
  series: []
});

export const ageConfig = fromJS({
  chart: {
    polar: true,
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'line'
  },
  // colors: [
  //   '#643dfa',
  //   '#f0b609'
  // ],
  credits: false,
  title: {
    text: null
  },
  pane: {
    size: '75%',
    startAngle: -30
  },
  xAxis: {
    categories: [], // '-18', '18-25', '26-35', '36-45', '46-65', '66+'
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
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">{eventType} ({point.x})</p>',
    pointFormat: '<p style="font-size: 12px; margin-bottom: 7px; margin-left: 3px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y:.0f}%</b></p>',
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
  series: []
});

// [ {
//   name: 'Dagelijkse Kost',
//   data: [ 430, 190, 600, 350, 170, 20 ]
// }, {
//   name: 'Familie',
//   data: [ 500, 390, 420, 310, 260, 25 ]
// } ]

export const genderConfig = fromJS({
  chart: {
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'column'
  },
  // colors: [
  //   '#643dfa',
  //   '#f0b609'
  // ],
  credits: false,
  title: {
    text: null
  },
  xAxis: {
    categories: [], // Series
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
         <p style="font-size: 10px; margin-bottom: 10px;">{eventType}</p>
         <p style="font-size: 12px;">{point.x}\u00a0\u00a0\u00a0\u00a0<b style="color: #17262b;"></b></p>
      </div>`,
    pointFormat:
      `<div style="font-size: 12px; margin-left: -10px; margin-right: -10px;">
        <div style="margin-right: 5px; height: 20px; width: 4px; border-left-width: 1px; border-left-style: solid; border-left-color: #ced6da; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #ced6da; display: inline-block;">\u00a0</div>
        <div style="display: inline-block;vertical-align: bottom; margin-bottom: -6px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y:.0f}%</b></div>
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
      stacking: 'percent'
    }
  },
  series: []
 //  {
 //   name: 'Dagelijkse Kost', // Male
 //   data: [ 300, 380 ]
 // }, {
 //   name: 'Familie', // Female
 //   data: [ 350, 350 ]
 // }
});

export const locationConfig = {
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
