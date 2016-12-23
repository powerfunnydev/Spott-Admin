import React, { Component, PropTypes } from 'react';
import { Root } from '../../../_common/styles';
import Radium from 'radium';
import List from './list';
import { SideMenu } from '../../../app/sideMenu';

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
      <SideMenu>
        <Root>
          <List location={location}/>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
