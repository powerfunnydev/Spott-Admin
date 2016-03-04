import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import Slider from 'react-slick';
import Section from '../section';
import './slick.css';

const bbdoIcon = require('./bbdo.jpg');
const codiflyIcon = require('./codifly.jpg');
const imindsIcon = require('./iminds.jpg');
const iwtIcon = require('./iwt.jpg');
const ixorIcon = require('./ixor.jpg');
const medialaanIcon = require('./medialaan.jpg');
const mindshareIcon = require('./mindshare.jpg');
const revolverIcon = require('./revolver.jpg');
const ugentIcon = require('./ugent.jpg');
const unileverIcon = require('./unilever.jpg');
const vrtIcon = require('./vrt.jpg');
const zalandoIcon = require('./zalando.jpg');
const zanoxIcon = require('./zanox.jpg');

class Partner extends Component {

  static propTypes = {
    link: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  static styles = {
    logo: {
      marginRight: 20,
      maxWidth: 180
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { link, logo, title } = this.props;
    return (
      <a alt={title} href={link} target='_blank' title={title}>
        <img alt={title} src={logo} style={styles.logo} title={title} />
      </a>
    );
  }
}

@Radium
export default class Partners extends Component {

  static sliderSettings = {
    arrows: true,
    autoplay: true,
    autoplaySpeed: 8000,
    dots: false,
    draggable: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 450, settings: { autoplaySpeed: 3000, slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 750, settings: { autoplaySpeed: 4000, slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 950, settings: { autoplaySpeed: 5000, slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 1200, settings: { autoplaySpeed: 6000, slidesToShow: 4, slidesToScroll: 4 } }
    ]
  }

  static styles = {
    slider: {
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto'
    },

    logos: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    outer: {
      backgroundColor: '#fff', // f5f5f5 // TODO: in design this is #fff, but this color is better as long as "whitepapers" is not added yet
      color: '#000',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      color: 'rgb(16, 27, 33)',
      marginBottom: 20
    },
    subtitle: {
      fontSize: '18px',
      color: 'rgba(13, 27, 32, 0.6)',
      lineHeight: 1.5,
      marginBottom: 40
    }
  }

  render () {
    const { sliderSettings, styles } = this.constructor;
    return (
      <Section style={styles.outer}>
        <h1 style={styles.title}>We couldn't do this alone</h1>
        <h2 style={styles.subtitle}>We are lucky at Apptvate to be working with some smart folks</h2>
        <div style={styles.slider}>
          <Slider {...sliderSettings} >
            <div>
              <Partner link='http://bbdo.be' logo={bbdoIcon} title='BBDO' />
            </div>
            <div>
              <Partner link='http://codifly.be' logo={codiflyIcon} title='Codifly - Web agency - Web application development' />
            </div>
            <div>
              <Partner link='http://iminds.be' logo={imindsIcon} title='iMinds' />
            </div>
            <div>
              <Partner link='http://iwt.be' logo={iwtIcon} title='IWT' />
            </div>
            <div>
              <Partner link='http://ixor.be' logo={ixorIcon} title='Ixor' />
            </div>
            <div>
              <Partner link='http://medialaan.be' logo={medialaanIcon} title='Medialaan' />
            </div>
            <div>
              <Partner link='http://mindshare.be' logo={mindshareIcon} title='Mindshare' />
            </div>
            <div>
              <Partner link='http://revolver.be' logo={revolverIcon} title='Revolver' />
            </div>
            <div>
              <Partner link='http://ugent.be' logo={ugentIcon} title='UGent' />
            </div>
            <div>
              <Partner link='http://unilever.be' logo={unileverIcon} title='Unilever' />
            </div>
            <div>
              <Partner link='http://vrt.be' logo={vrtIcon} title='VRT' />
            </div>
            <div>
              <Partner link='http://zalando.be' logo={zalandoIcon} title='Zalando' />
            </div>
            <div>
              <Partner link='http://zanox.be' logo={zanoxIcon} title='Zanox' />
            </div>
          </Slider>
        </div>
      </Section>
    );
  }

}
