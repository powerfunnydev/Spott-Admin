import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import markerImage from './images/cluster.png';
// import { colors, fontWeights, makeTextStyle } from '../../_common/styles';

function sizeCalculator (markers) {
  return {
    index: 1,
    text: markers.reduce((total, marker) => total + parseInt(marker.label, 10), 0)
  };
}
// ref={(map) => console.log(map)}
// onClick={() => { console.warn('test') }}>
const RegionMap = withGoogleMap((props) => (
  <GoogleMap
    defaultCenter={{ lat: 50.9333, lng: 4.0333 }}
    defaultZoom={9}>
      <MarkerClusterer
        averageCenter
        calculator={sizeCalculator}
        enableRetinaIcons
        gridSize={60}
        styles={[ {
          height: 40,
          url: markerImage,
          width: 40,
          fontSize: '14px',
          fontFamily: 'Rubik-Medium',
          textColor: 'white'
        } ]}>

        {props.markers.map((marker, index) => <Marker {...marker} icon={markerImage} key={index} />)}
      </MarkerClusterer>
  </GoogleMap>
));

@Radium
export default class MarkersMap extends Component {

  static propTypes = {
    markers: PropTypes.array
  };

  render () {
    const { markers } = this.props;
    return (
      <RegionMap
        containerElement={
          <div style={{ height: 400 }} />
        }
        mapElement={
          <div style={{ height: 400 }} />
        }
        markers={markers}/>
    );
  }
}
