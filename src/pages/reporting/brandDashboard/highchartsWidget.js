import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Highcharts from 'react-highcharts';
import { colors, fontWeights, makeTextStyle } from '../../_common/styles';
import Widget from './widget';

@Radium
export default class HighchartsWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentStyle: PropTypes.object,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  render () {
    const styles = this.constructor.styles;
    const { config, style, title } = this.props;
    return (
      <Widget style={style} title={title}>
        <Highcharts config={config} isPureConfig />
      </Widget>
    );
  }
}
