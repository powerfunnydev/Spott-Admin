import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

/* eslint-disable */
export function renderSVG (fill = '#17262b', style) {
  return (
    <svg style={style} width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <title>E5648783-B7D5-4398-88D6-CC2328D7A5B1</title>
      <g fill="none" fillRule="evenodd">
        <path d="M-4-4h18v18H-4z"/>
        <path d="M6 4V.51A.507.507 0 0 0 5.495 0h-.99A.5.5 0 0 0 4 .51V4H.51a.507.507 0 0 0-.51.505v.99A.5.5 0 0 0 .51 6H4v3.49c0 .282.226.51.505.51h.99A.5.5 0 0 0 6 9.49V6h3.49c.282 0 .51-.226.51-.505v-.99A.5.5 0 0 0 9.49 4H6z" fill={fill}/>
      </g>
    </svg>);
}

@Radium
export default class PlusSVG extends Component {

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
