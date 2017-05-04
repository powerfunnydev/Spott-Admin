import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

/* eslint-disable */
export function renderSVG (fill = '#17262b', style) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10">
        <g fill="none" fillRule="evenodd" transform="translate(-3 -4)">
            <path d="M0 0h18v18H0z"/>
            <rect width="12" height="2" x="3" y="4" fill="#AAB5B8" rx=".5"/>
            <rect width="12" height="2" x="3" y="8" fill="#AAB5B8" rx=".5"/>
            <rect width="12" height="2" x="3" y="12" fill="#AAB5B8" rx=".5"/>
        </g>
    </svg>
  );
}

@Radium
export default class HamburgerSVG extends Component {

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
