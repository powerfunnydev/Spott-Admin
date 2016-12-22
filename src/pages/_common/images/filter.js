import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

/* eslint-disable */
export function renderSVG (fill = '#17262b', style) {
  return (
    <svg width="12px" height="10px" viewBox="0 0 12 10" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>92F3C29F-EF1A-4D28-B52F-C8D83B95F0D2</title>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Guide---Icons" transform="translate(-704.000000, -350.000000)">
                <g id="Icons/Filter-Gray" transform="translate(701.000000, 346.000000)">
                    <g id="Icon-Filter">
                        <polygon id="Bounds" points="0 0 18 0 18 18 0 18"></polygon>
                        <path d="M7,14 L11,14 L11,12 L7,12 L7,14 L7,14 Z M3,4 L3,6 L15,6 L15,4 L3,4 L3,4 Z M5,10 L13,10 L13,8 L5,8 L5,10 L5,10 Z" id="Shape" fill={fill}></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>

  );
}

@Radium
export default class FilterSVG extends Component {

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
