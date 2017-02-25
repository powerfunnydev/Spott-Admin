import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

import { colors, fontWeights, makeTextStyle } from '../_common/styles';
import Spinner from '../_common/components/spinner';

function sizeCalculator (markers) {
  return {
    index: 1,
    text: markers.reduce((total, marker) => total + parseInt(marker.label, 10), 0)
  };
}

const RegionMap = withGoogleMap((props) => (
  <GoogleMap
    defaultCenter={{ lat: 50.9333, lng: 4.0333 }}
    defaultZoom={9}
    ref={(map) => console.log(map)}
    onClick={() => console.warn('test')}>

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

  static styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: 2,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.lightGray3,
      paddingTop: '1.8em',
      paddingBottom: '1.5em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    },
    wrapper: {
      position: 'relative'
    },
    content: {

    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: '2em',
      marginBottom: '1em'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: colors.veryDarkGray,
      textTransform: 'uppercase'
    },
    widget: {
      width: '100%'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { isLoading, style, title } = this.props;
    return (
      <div style={[ styles.widget, style ]}>
        <div style={styles.container}>
          <div style={styles.wrapper}>
            <div style={styles.header}>
              <h2 style={styles.title}>{title}&nbsp;&nbsp;&nbsp;</h2>
              {isLoading && <Spinner size='small' />}
            </div>
            <RegionMap
              containerElement={
                <div style={{ height: 400 }} />
              }
              mapElement={
                <div style={{ height: 400 }} />
              }
              markers={this.state.markers}/>
          </div>

        </div>
      </div>
    );
  }
}
