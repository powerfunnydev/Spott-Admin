import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../../_common/styles';
import Widget from './widget';

@Radium
export default class OpportunitiesWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static styles = {
    title: {
      ...makeTextStyle(fontWeights.medium, '1.5em'),
      color: colors.veryDarkGray,
      textAlign: 'center'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { style, title } = this.props;
    return (
      <Widget style={style} title={title}>
        <div style={styles.title}>Your Opportunities</div>
      </Widget>
    );
  }
}
