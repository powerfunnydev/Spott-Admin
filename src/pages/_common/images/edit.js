import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Hover from './hover';

@Radium
export default class EditSVG extends Component {

  static propTypes = {
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    style: PropTypes.object
  };

  renderSVG (fill = '#aab5b8', style) {
    return (
      <svg height='13' viewBox='0 0 11 13' width='11' xmlns='http://www.w3.org/2000/svg'>
        <g fill='none' fillRule='evenodd'>
          <path d='M-3-3h18v18H-3z'/>
          <path d='M11 11.75c0 .414-.341.75-.756.75H.756A.751.751 0 0 1 0 11.75c0-.414.341-.75.756-.75h9.488c.417 0 .756.333.756.75zM1 10V7.808L8.814 0 11 2.192 3.186 10H1z' fill={fill}/>
        </g>
      </svg>
    );
  }

  render () {
    const { color, hoverColor, style } = this.props;
    return <Hover color={color} hoverColor={hoverColor} renderSVG={this.renderSVG} style={style} />;
  }
}
