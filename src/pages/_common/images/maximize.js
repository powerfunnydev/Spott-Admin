import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Hover from './hover';

@Radium
export default class MaximizeSVG extends Component {

  static propTypes = {
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    style: PropTypes.object
  };

  renderSVG (fill = '#aab5b8', style) {
    return (
      <svg height='14' viewBox='0 0 14 14' width='14' xmlns='http://www.w3.org/2000/svg'>
        <g fill='none' fillRule='evenodd' transform='translate(-2 -2)'>
          <path d='M0 0h18v18H0z'/>
          <rect height='14' rx='1' stroke={fill} strokeWidth='2'
            transform='translate(2 2)' width='14'/>
          <rect fill={fill} height='2' rx='.5' width='6' x='6' y='8'/>
          <rect fill={fill} height='2' rx='.5' transform='rotate(90 9 9)'
            width='6' x='6' y='8'/>
        </g>
      </svg>
    );
  }

  render () {
    const { color, hoverColor, style } = this.props;
    return <Hover color={color} hoverColor={hoverColor} renderSVG={this.renderSVG} style={style} />;
  }
}
