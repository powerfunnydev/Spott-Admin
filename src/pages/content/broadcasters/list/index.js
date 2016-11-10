import React, { Component, PropTypes } from 'react';
import Header from '../../../app/header';
import { Root } from '../../../_common/styles';
import Broadcasters from './broadcasters';
import Radium from 'radium';
import SpecificHeader from '../../header';
/* eslint-disable no-alert */

@Radium
export default class List extends Component {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired
  };

  render () {
    const { location, children } = this.props;
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <Broadcasters {...this.props}/>
        {children}
      </Root>
    );
  }
}
