import { fromJS } from 'immutable';

export const brandActivityConfig = {
  exporting: {
    buttons: {
      contextButton: {
        align: 'right',
        x: 0,
        y: -100,
        verticalAlign: 'top'
      }
    }
  },
  chart: {
    spacingTop: 100,
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
  yAxis: [ {
    title: {
      text: 'Events'
    },
    min: 0
  }, {
    title: {
      text: 'Users'
    },
    min: 0,
    opposite: true
  } ],
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
    series: {
      animation: false
    },
    spline: {
      marker: {
        enabled: true
      }
    }
  },
  series: [ {
    type: 'column',
    data: [ [ new Date().getTime(), 1000 ], [ new Date().getTime() + 100000000, 690 ], [ new Date().getTime() + 200000000, 650 ], [ new Date().getTime() + 300000000, 600 ] ],
    name: 'users',
    yAxis: 1
  }, {
    type: 'spline',
    data: [ [ new Date().getTime(), 890 ], [ new Date().getTime() + 100000000, 590 ], [ new Date().getTime() + 200000000, 450 ], [ new Date().getTime() + 300000000, 600 ] ],
    name: 'Impressions'
  }, {
    type: 'spline',
    data: [ [ new Date().getTime(), 560 ], [ new Date().getTime() + 100000000, 510 ], [ new Date().getTime() + 200000000, 410 ], [ new Date().getTime() + 300000000, 510 ] ],
    name: 'Subscriptions'
  } ]
};

export const ageConfig = {
  chart: {
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'column'
  },
  credits: false,
  title: {
    text: null
  },
  xAxis: {
    categories: [ '-18', '18-25', '26-35', '36-45', '46-65', '66+' ], // TODO '-18', '18-25', '26-35', '36-45', '46-65', '66+'
    labels: {
      style: {
        color: '#aab5b8',
        font: 'normal 12px Rubik-Regular, Verdana, sans-serif'
      }
    }
  },
  yAxis: {
    title: {
      // No title 'Values' on the y-axis.
      text: null
    }
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#ced6da',
    borderRadius: 2,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">{eventType} ({point.x})</p>',
    pointFormat: '<p style="font-size: 12px; margin-bottom: 7px; margin-left: 3px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y:.0f}</b></p>',
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
    data: [ 1000, 690, 650, 600, 700, 800 ],
    name: 'Brand subscriptions'
  } ],
  plotOptions: {
    series: {
      animation: false
    }
  }
};

export const genderConfig = {
  chart: {
    style: {
      fontFamily: 'Rubik-Regular, Verdana, sans-serif'
    },
    type: 'column'
  },
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
    title: {
      // No title 'Values' on the y-axis.
      text: null
    }
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#ced6da',
    borderRadius: 2,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    headerFormat: '<p style="font-size: 10px; color: #6d8791; margin-bottom: 9px; margin-left: 3px; margin-top: 3px;">{eventType} ({point.x})</p>',
    pointFormat: '<p style="font-size: 12px; margin-bottom: 7px; margin-left: 3px;"><span style="color:{point.color};">{series.name}</span>\u00a0\u00a0\u00a0\u00a0<b>{point.y:.0f}</b></p>',
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
    data: [ 1000, 690 ],
    name: 'Brand subscriptions'
  } ],
  plotOptions: {
    series: {
      animation: false
    }
  }
};
