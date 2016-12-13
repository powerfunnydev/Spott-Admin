import Radium from 'radium';
import React, { Component, PropTypes } from 'react';

@Radium
export default class MarkerImageTooltip extends Component {

  static propTypes = {
    imageUrl: PropTypes.string,
    // Procentual location of the marker
    relativeLeft: PropTypes.number.isRequired,
    relativeTop: PropTypes.number.isRequired
  };

  static styles = {
    container: {
      borderRadius: '4px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      backgroundColor: '#fff',
      backgroundSize: 'cover',
      width: 84,
      height: 84,
      marginTop: -42, // Center vertically according to marker
      marginLeft: 24, // Marker width (/2) + arrow + some additional space
      zIndex: 20
    },
    arrow: {
      right: '100%',
      top: '50%',
      borderStyle: 'solid',
      pointerEvents: 'none',
      height: 0,
      width: 0,
      position: 'absolute',
      borderColor: 'rgba(0, 0, 0, 0)',
      borderRightColor: '#fff',
      borderWidth: '5px',
      marginTop: '-5px'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { imageUrl, relativeLeft, relativeTop } = this.props;
    return (
      <div style={[ styles.container, imageUrl && { backgroundImage: `url('${imageUrl}?width=160&height=160')`, left: `${relativeLeft}%`, top: `${relativeTop}%` } ]}>
        <div style={styles.arrow}></div>
      </div>
    );
  }

}
