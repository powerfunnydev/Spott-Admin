import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Highcharts from 'react-highcharts';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../_common/styles';
import Spinner from '../_common/components/spinner';

export const mediumWidgetStyle = {
  width: '100%',
  marginBottom: '1.75em',
  paddingLeft: '0.75em',
  paddingRight: '0.75em',
  [mediaQueries.medium]: {
    display: 'inline-block',
    width: '50%'
  },
  [mediaQueries.large]: {
    width: '50%'
  }
};

export const largeWidgetStyle = {
  width: '100%',
  marginBottom: '1.75em',
  paddingLeft: 0,
  paddingRight: 0,
  [mediaQueries.medium]: {
    display: 'block',
    width: '100%'
  },
  [mediaQueries.large]: {
    width: '100%'
  }
};

@Radium
export default class Widget extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentStyle: PropTypes.object,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: 2,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.lightGray3,
      paddingTop: '1.8em',
      paddingBottom: '1.5em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    },
    wrapper: {
      position: 'relative'
    },
    content: {

    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: '2em'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: colors.veryDarkGray,
      textTransform: 'uppercase'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, config, contentStyle, isLoading, style, title } = this.props;
    return (
      <div style={[ mediumWidgetStyle, style ]}>
        <div style={styles.container}>
          <div style={styles.wrapper}>
            <div style={styles.header}>
              <h2 style={styles.title}>{title}&nbsp;&nbsp;&nbsp;</h2>
              {isLoading && <Spinner size='small' />}
            </div>
            <Highcharts config={config} isPureConfig />
          </div>

        </div>
      </div>
    );
  }
}
