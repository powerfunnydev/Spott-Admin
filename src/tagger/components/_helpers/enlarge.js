import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

// Frame visibility images
const zoomIn = require('../_images/zoomIn.svg');

@Radium
export default class ZoomIn extends Component {

  static propTypes = {
    // Override the inline-styles of the root element.
    style: PropTypes.object,
    // Actions triggered by this component
    onEnlarge: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onEnlarge = ::this.onEnlarge;
  }

  onEnlarge (e) {
    e.preventDefault();
    this.props.onEnlarge();
  }

  static styles = {
    button: {
      border: '1px solid #fff',
      borderRadius: 2,
      display: 'flex',
      height: 24,
      justifyContent: 'center',
      width: 24
    },
    image: {
      width: 16
    }
  };

  render () {
    const { styles } = this.constructor;
    const { style } = this.props;

    return (
      <button style={[ styles.button, style ]} title='Enlarge frame' onClick={this.onEnlarge}>
        <img src={zoomIn} style={styles.image}/>
      </button>
    );
  }

}
