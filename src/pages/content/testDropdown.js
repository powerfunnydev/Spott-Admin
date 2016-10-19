import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push as routerPush } from 'react-router-redux';
import Radium from 'radium';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

@Radium
export default class Test extends Component {

  static propTypes = {

  };

  static styles = {

  }

  render () {
    console.log('Dropdown', <Dropdown/>);
    return (
      <div>
        <Dropdown>
          <DropdownTrigger>Profile</DropdownTrigger>
          <DropdownContent>
            <ul>
              <li>
                <a href='/profile'>Profile</a>
              </li>
              <li>
                <a href='/favorites'>Favorites</a>
              </li>
              <li>
                <a href='/logout'>Log Out</a>
              </li>
            </ul>
          </DropdownContent>
        </Dropdown>
      </div>
    );
  }

}
