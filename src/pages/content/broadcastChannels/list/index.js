import React, { Component, PropTypes } from 'react';
import Header from '../../../app/header';
import { Root } from '../../../_common/styles';
import Radium from 'radium';
import SpecificHeader from '../../header';
import List from './list';

@Radium
export default class BroadcastChannel extends Component {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    })
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { children, location } = this.props;

    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <List location={location}/>
        {children}
      </Root>
    );
  }
}
