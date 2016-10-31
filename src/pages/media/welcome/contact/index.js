import GoogleMaps from 'google-maps';
import Radium from 'radium';
import { Grid, Cell } from 'radium-grid';
import React, { Component } from 'react';
import { Element } from 'react-scroll';
import ReactDOM from 'react-dom';
import { colors } from '../../../_common/styles';
import Section from '../../../_common/section';

const facebookImage = require('./facebook.svg');
const twitterImage = require('./twitter.svg');
const markerImage = require('./marker.svg');

class Map extends Component {

  componentDidMount () {
    // Get DOM node of container div
    const mapContainerEl = ReactDOM.findDOMNode(this.mapContainer);
    // Load Google maps API and render in div
    GoogleMaps.load(({ maps }) => {
      const map = new maps.Map(mapContainerEl, {
        center: { lat: 50.94397, lng: 4.04182 },
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        scrollwheel: false,
        streetViewControl: false,
        zoomControl: false,
        zoom: 17
      });
      new maps.Marker({ // eslint-disable-line no-new
        position: { lat: 50.94397, lng: 4.04182 },
        map,
        icon: markerImage
      });
    });
  }

  static styles = {
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    linkToGoogleMaps: {
      fontFamily: 'Rubik-Medium',
      fontSize: 20,
      color: colors.secondaryPink,
      position: 'absolute',
      bottom: 10,
      right: 20
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <div>
        <div ref={(x) => { this.mapContainer = x; }} style={styles.map} />
        <div>
          <a href='https://www.google.be/maps/place/Appiness/@50.9455304,4.0385531,17z/data=!3m1!4b1!4m2!3m1!1s0x47c397e3c9fbdfc9:0xe00fdbd49b06d2d'
            style={styles.linkToGoogleMaps}
            target='_blank'>
            Open in Google maps
          </a>
        </div>
      </div>
    );
  }

}

@Radium
class Info extends Component {

  static styles = {
    container: {
      paddingTop: 90,
      paddingBottom: 90,
      maxWidth: 330,
      '@media only screen and (max-width: 1024px)': {
        textAlign: 'center'
      }
    },
    title: {
      color: '#101b21',
      fontFamily: 'Rubik-Medium',
      fontSize: 32,
      paddingBottom: 10
    },
    block: {
      base: {
        paddingTop: 20
      },
      first: {
        paddingTop: 0
      }
    },
    comeVisitEmph: {
      textDecoration: 'underline'
    },
    companyName: {
      fontFamily: 'Rubik-Medium'
    },
    emailLink: {
      color: '#101b21'
    },
    socialMediaButton: {
      base: {
        display: 'inline-block',
        marginLeft: 20
      },
      first: {
        marginLeft: 0
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <div style={styles.container}>
        {/* Come visit block */}
        <div style={[ styles.block.base, styles.block.first ]}>
          <h1 style={styles.title}>Come visit</h1>
          <p>Located in Aalst, Belgium, Apptvate is
          available weekdays from 9am to
          6pm <span style={styles.comeVisitEmph}>by appointment</span></p>
        </div>
        {/* Contact Block */}
        <div style={[ styles.block.base ]}>
          <h1 style={[ styles.title ]}>Contact</h1>
          <p><span style={styles.companyName}>Appiness NV</span><br />
          Hershage 10, 9300 Aalst, Belgium<br />
          +32 493 137 160<br />
          <a href='mailto:info@apptvate.com' style={styles.emailLink}>info@apptvate.com</a></p>
        </div>
        {/* Social media block */}
        <div style={[ styles.block.base ]}>
          <a href='https://twitter.com/AppTVate' style={[ styles.socialMediaButton.base, styles.socialMediaButton.first ]} target='_blank'><img src={twitterImage} /></a>
          <a href='https://www.facebook.com/Appiness-935394883167074/' style={styles.socialMediaButton.base} target='_blank'><img src={facebookImage} /></a>
        </div>
      </div>
    );
  }

}

@Radium
export default class Contact extends Component {

  static styles = {
    section: {
      outer: {
        backgroundColor: '#f5f5f5',
        color: '#4d5254',
        fontFamily: 'Rubik-Regular',
        fontSize: 18
      },
      inner: {
        paddingBottom: 0,
        paddingTop: 0,
        '@media only screen and (max-width: 1024px)': {
          paddingLeft: 0,
          paddingRight: 0
        }
      }
    },
    map: {
      position: 'relative',
      minHeight: 400
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <Element name='contact'>
        <Section innerStyle={styles.section.inner} style={styles.section.outer}>
          <Grid align='center' cellWidth='1' gutter='0px' largeCellWidth='1/2' xlargeCellWidth='1/2'>

            {/* Left block */}
            <Cell>
              <Info />
            </Cell>

            {/* Google Maps */}
            <Cell style={styles.map}>
              <Map />
            </Cell>

          </Grid>
        </Section>
      </Element>
    );
  }

}
