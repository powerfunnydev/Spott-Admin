import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

export function renderSVG (fill = '#17262b', style) {
  return (
    <svg style={style} width='8' height='5' viewBox='0 0 8 5' xmlns='http://www.w3.org/2000/svg'>
      <title>71A9D509-326D-42CF-8D8C-D98C8FA3003D</title>
      <g fill='none' fillRule='evenodd'>
        <path d='M-5-6h18v18H-5z'/>
        <path d='M.412 5h7.176c.348 0 .538-.4.317-.666L4.49.229a.64.64 0 0 0-.981 0L.095 4.334A.407.407 0 0 0 .412 5' fill={fill}/>
      </g>
    </svg>);
}

@Radium
export default class ArrowSVG extends Component {

  static propTypes = {
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
  }

  static styles = {
  };

  render () {
    const styles = this.constructor.styles;
    const { style, color } = this.props;
    return (renderSVG(color, style));
  }
}
