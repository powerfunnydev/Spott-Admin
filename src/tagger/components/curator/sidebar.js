import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { sidebarSelector } from '../../selectors/curator';
import colors from '../colors';

@connect(sidebarSelector)
@Radium
export default class Sidebar extends Component {
  static propTyes = {
    sceneGroups: ImmutablePropTypes.list.isRequired,
    style: PropTypes.object
  };

  static styles = {
    container: {
      backgroundColor: colors.black3
    }
  }
  render () {
    const styles = this.constructor.styles;
    const { style } = this.props;
    return <div style={[ style, styles.container ]} />;
  }
}
