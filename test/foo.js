import React from 'react';
import { mount, shallow } from 'enzyme';
import TvGuideList from '../src/pages/tvGuide/list';
import Login from '../src/pages/login';

console.log('Test');

it('allows us to set props', () => {
  const wrapper = mount(<Login/>);
  console.log('wrapper', wrapper);
});
