import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

/* eslint-disable */
export function renderSVG (fill = '#17262b', style) {
  return (
    <svg style={style} width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path d="M-2-2h18v18H-2z"/>
        <path d="M13.692 7.742c.025-.243.042-.491.042-.742 0-.252-.017-.5-.043-.744L11.847 5.6a5.075 5.075 0 0 0-.436-1.051l.838-1.765a6.817 6.817 0 0 0-1.052-1.052l-1.767.839a5.046 5.046 0 0 0-1.048-.434L7.727.293A6.723 6.723 0 0 0 6.985.25c-.252 0-.5.016-.744.043l-.656 1.844c-.37.107-.722.252-1.05.434l-1.766-.839c-.388.312-.74.664-1.052 1.052l.839 1.765a5.048 5.048 0 0 0-.434 1.05l-1.845.657A6.967 6.967 0 0 0 .235 7c0 .251.016.499.043.743l1.845.656c.106.37.25.72.434 1.05l-.839 1.766a6.78 6.78 0 0 0 1.052 1.052l1.764-.839c.33.182.682.328 1.052.435l.656 1.845c.243.025.491.042.743.042.251 0 .499-.017.743-.043l.656-1.846c.37-.106.72-.25 1.05-.434l1.766.839a6.78 6.78 0 0 0 1.052-1.052l-.839-1.765c.182-.33.327-.684.435-1.05l1.844-.657zm-6.707 2.07a2.812 2.812 0 1 1 0-5.625 2.812 2.812 0 0 1 0 5.625z" fill={fill}/>
      </g>
    </svg>
  );
}

@Radium
export default class GearWhealSVG extends Component {

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
