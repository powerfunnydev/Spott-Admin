import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

/* eslint-disable */
export function renderSVG (fill = '#17262b', style) {
  return (
    <svg style={style} width="8" height="6" viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
      <title>52F879BD-8298-4B77-8A45-4CB2BF3BC1F1</title>
      <g fill="none" fillRule="evenodd">
        <path d="M-5-6h18v18H-5z"/>
        <path d="M6.293.293L3 3.585 1.707 2.293A1 1 0 0 0 .293 3.708l2 1.999c.18.181.431.292.707.292a.996.996 0 0 0 .707-.292l4-4A1 1 0 1 0 6.293.293z" fill={fill}/>
      </g>
    </svg>);
}

@Radium
export default class CompletedSVG extends Component {

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
