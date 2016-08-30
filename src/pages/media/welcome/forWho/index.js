import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Grid, Cell } from 'radium-grid';
import { Element, Link } from 'react-scroll';
import Section from '../section';

const broadcastersImage = require('./broadcasters.svg');
const contentProducersImage = require('./contentProducers.svg');
const brandsImage = require('./brands.svg');

class Target extends Component {

  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  static styles = {
    button: {
      color: 'rgba(255, 255, 255, 0.502)',
      fontFamily: 'Rubik-Bold',
      fontSize: '14px',
      textTransform: 'uppercase'
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 350
    },
    title: {
      fontSize: '30px',
      fontFamily: 'Rubik-Medium',
      color: 'rgb(214, 14, 79)',
      margin: '30px 0 30px 0'
    },
    text: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '18px',
      lineHeight: 1.5,
      marginBottom: 30
    },
    line: {
      width: 40,
      height: 4,
      backgroundColor: 'rgb(214, 14, 79)',
      marginBottom: 30
    }
  }

  render () {
    const { styles } = this.constructor;
    const { imageUrl, title, text } = this.props;
    return (
      <div style={styles.container}>
        <img src={imageUrl} />
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.text}>{text}</div>
        <div style={styles.line}></div>
        {/* TODO: is "go to features" in design, but replaced by "how it works" */}
        <Link duration={500} offset={50} smooth spy to='howItWorks'>
          <button style={styles.button}>How It Works</button>
        </Link>
      </div>
    );
  }

}

@Radium
export default class ForWho extends Component {

  static styles = {
    section: {
      outer: {
        backgroundColor: '#101b21',
        color: '#fff',
        fontSize: '18px',
        textAlign: 'center'
      },
      inner: {
        maxWidth: 1100
      }
    },
    nonLastCell: {
      '@media only screen and (max-width: 1024px)': {
        paddingBottom: 95
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <Element name='forWho'>
        <Section innerStyle={styles.section.inner} style={styles.section.outer}>
          <Grid align='center' cellWidth='1' gutter='30px' largeCellWidth='1/3' xlargeCellWidth='1/3'>

            {/* For broadcasters */}
            <Cell style={styles.nonLastCell}>
              <Target imageUrl={broadcastersImage}
                text='We allow broadcasters to improve the viewing experience by allowing interactivity'
                title='For Broadcasters' />
            </Cell>

            {/* For content producers */}
            <Cell style={styles.nonLastCell}>
              <Target imageUrl={contentProducersImage}
                text='We allow content producers to increase the value of product placement deals'
                title='For Content Producers' />
            </Cell>

            {/* For brands */}
            <Cell>
              <Target imageUrl={brandsImage}
                text='We allow brands to evolve from push marketing to pull marketing campaigns'
                title='For Brands' />
            </Cell>
          </Grid>
        </Section>
      </Element>
    );
  }

}
