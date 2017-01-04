import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

/* eslint-disable */
export function renderSVG (fill = '#aab5b8', style) {
  return (
    <svg width='12px' height='12px' viewBox='0 0 12 12' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <g id='Guide---Icons' transform='translate(-596.000000, -385.000000)'>
                <g id='Icons/Circular-Question-Gray' transform='translate(593.000000, 382.000000)'>
                    <g id='Icon-Close' strokeWidth='1'>
                        <polygon id='Bounds' points='0 0 18 0 18 18 0 18' />
                    </g>
                    <path d='M8.99996763,3 C5.6870084,3 3,5.69885642 3,9.00762389 C3,12.3163914 5.6870084,15 8.99996763,15 C12.3129269,15 14.9999353,12.3163914 14.9999353,9.00762389 C15.0152024,5.69885642 12.328194,3 8.99996763,3 L8.99996763,3 Z M8.9320593,13.5487733 C8.41570081,13.5487733 7.99710956,13.1352291 7.99710956,12.6250964 C7.99710956,12.1149637 8.41570081,11.7014194 8.9320593,11.7014194 C9.44841778,11.7014194 9.86700904,12.1149637 9.86700904,12.6250964 C9.86605266,13.1348372 9.44802112,13.5478285 8.9320593,13.5487733 Z M9.68756005,9.94788692 L9.68756005,10.5526535 C9.68756005,10.9715266 9.32877097,11.3110903 8.8861822,11.3110903 C8.44359344,11.3110903 8.08480436,10.9715266 8.08480436,10.5526535 L8.08480436,9.94788692 C8.09201447,9.25982038 8.56233732,8.65283712 9.25357392,8.4395112 C9.73094913,8.28873665 10.0468702,7.85897053 10.0302595,7.38294004 C9.99801399,6.80133076 9.49477184,6.34301535 8.87944794,6.33486677 C8.44377931,6.3366723 8.04769838,6.57446725 7.86032877,6.94671495 C7.66816837,7.32413093 7.18911293,7.4826574 6.79032847,7.30079374 C6.39154402,7.11893008 6.22404211,6.66554436 6.41620248,6.28812837 C6.86705215,5.39377411 7.8189599,4.82252491 8.8659794,4.81799316 L8.88244094,4.81799316 C10.3634095,4.82611822 11.5747502,5.93695852 11.6300221,7.33761796 C11.6707963,8.48016947 10.9136838,9.51236061 9.76837127,9.87565485 C9.76687476,9.87707116 9.68756005,9.90398115 9.68756005,9.94788692 Z' id='Shape' fill={fill} />
                </g>
            </g>
        </g>
    </svg>
  );
}

@Radium
export default class QuestionSVG extends Component {

  static propTypes = {
    color: PropTypes.string,
    style: PropTypes.object,
    onHoverColor: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { hover: false };
  }

  static styles = {
    container: {
      display: 'inline-flex'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { style, color, onHoverColor } = this.props;
    return (<div
      style={styles.container}
      onMouseEnter={() => { this.setState({ hover: true }); }}
      onMouseLeave={() => { this.setState({ hover: false }); }}>
       {renderSVG(this.state.hover ? onHoverColor || color : color, style)}
      </div>);
  }
}
