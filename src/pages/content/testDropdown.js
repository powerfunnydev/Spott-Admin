import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push as routerPush } from 'react-router-redux';
import Radium from 'radium';
// import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import Dropdown, { styles as dropdownStyles } from '../_common/components/dropdown';

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
        <Dropdown onChange={(e) => { console.log(e); }} elementShown={<div key={0} style={[ dropdownStyles.clickable, { width: '100%' } ]} onClick={() => { console.log('top'); }}>A</div>}>
          <div key={1} style={dropdownStyles.option} onClick={() => { console.log('rest'); }}>A</div>
          <div key={2} style={dropdownStyles.option} onClick={() => { console.log('rest'); }}>B</div>
          <div key={3} style={dropdownStyles.option} onClick={() => { console.log('rest'); }}>C</div>
        </Dropdown>
      </div>
    );
  }

}

/*
<div>
  <Dropdown>
    <DropdownTrigger>Edit</DropdownTrigger>
    <DropdownContent>
      <p>Edit</p>
      <p>Show</p>
      <p>Delete</p>
    </DropdownContent>
  </Dropdown>
</div>
*/
