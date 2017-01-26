import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Hover from './hover';

@Radium
export default class MinimizeSVG extends Component {

  static propTypes = {
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    style: PropTypes.object
  };

  renderSVG (fill = '#aab5b8', style) {
    return (
      <svg width='14px' height='14px' viewBox='0 0 14 14' version='1.1' xmlns='http://www.w3.org/2000/svg'>
          <defs>
              <rect id='path-1' x='0' y='0' width='14' height='14' rx='1' />
              <mask id='mask-2' maskContentUnits='userSpaceOnUse' maskUnits='objectBoundingBox' x='0' y='0' width='14' height='14' fill='white'>
                  <use />
              </mask>
          </defs>
          <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <g id='Guide---Icons' transform='translate(-667.000000, -384.000000)'>
                  <g id='Icons/Collapse-Close-Gray' transform='translate(665.000000, 382.000000)'>
                      <polygon id='Bounds' points='0 0 18 0 18 18 0 18' />
                      <g id='Group-2' strokeWidth='1' fillRule='evenodd' transform='translate(2.000000, 2.000000)' stroke='#AAB5B8'>
                          <use id='Rectangle' mask='url(#mask-2)' strokeWidth='2' />
                      </g>
                      <rect id='Rectangle-2' fill='#AAB5B8' fillRule='evenodd' x='6' y='8' width='6' height='2' rx='0.5' />
                  </g>
              </g>
          </g>
      </svg>

    );
  }

  render () {
    const { color, hoverColor, style } = this.props;
    return <Hover color={color} hoverColor={hoverColor} renderSVG={this.renderSVG} style={style} />;
  }
}
