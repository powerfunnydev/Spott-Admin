import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class NavigationArrow extends Component {

  static propTypes = {
    color: PropTypes.string,
    style: PropTypes.object
  };

  render () {
    const { color = '#17262b', style } = this.props;
    return <svg height='12' style={style} viewBox='0 0 8 12' width='8' xmlns='http://www.w3.org/2000/svg'><g fill='none' fillRule='evenodd'><path d='M-8-6h24v24H-8z'/><path d='M2 0L.59 1.41 5.17 6 .59 10.59 2 12l6-6z' fill={color}/></g></svg>;
  }
}
