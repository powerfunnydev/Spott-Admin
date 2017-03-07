import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import Widget from './widget';

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
          url: require('./images/cluster.png'),
          width: 40,
          fontSize: '14px',
          fontFamily: 'Rubik-Medium',
          textColor: 'white'
        } ]}>

        {props.markers.map((marker, index) => <Marker {...marker} key={index}/>)}
      </MarkerClusterer>
  </GoogleMap>
));

@Radium
export default class MapWidget extends Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  constructor (props) {
    super(props);

    const markers = [];

    for (let i = 0; i < 10000; i++) {
      markers.push({
        label: `${Math.round(Math.random() * 100)}`,
        position: { lat: 50.3 + Math.random() * 2, lng: 4 + Math.random() * 2 }
      });
    }

    this.state = {
      markers
    };
  }

  render () {
    const { style, title } = this.props;
    return (
      <Widget style={style} title={title}>
        <RegionMap
          containerElement={
            <div style={{ height: 400 }} />
          }
          mapElement={
            <div style={{ height: 400 }} />
          }
          markers={this.state.markers}/>
      </Widget>
    );
  }
}
