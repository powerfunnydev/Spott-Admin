import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Hover from './hover';

@Radium
export default class InfoSVG extends Component {

  static propTypes = {
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    style: PropTypes.object
  };

  renderSVG (fill = '#aab5b8', style) {
    return (
      <svg height='12' viewBox='0 0 12 12' width='12' xmlns='http://www.w3.org/2000/svg'>
        <g fill='none' fillRule='evenodd'>
          <path d='M-3-3h18v18H-3z'/>
          <path d='M6 0C2.687 0 0 2.699 0 6.008A5.997 5.997 0 0 0 6 12c3.313 0 6-2.684 6-5.992C12.015 2.698 9.328 0 6 0zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5 6c0-.552.444-1 1-1 .552 0 1 .444 1 1v3c0 .552-.444 1-1 1-.552 0-1-.444-1-1V6z' fill={fill}/>
        </g>
      </svg>
    );
  }

  render () {
    const { color, hoverColor, style } = this.props;
    return <Hover color={color} hoverColor={hoverColor} renderSVG={this.renderSVG} style={style} />;
  }
}
