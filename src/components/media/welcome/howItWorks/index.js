import Radium from 'radium';
import { Grid, Cell } from 'radium-grid';
import React, { Component, PropTypes } from 'react';
import { Element } from 'react-scroll';
import Section from '../section';
import { colors } from '../../../_common/styles';

const arrowImage = require('./arrow.svg');
const bulletImage = require('./bullet.svg');
const integrateImage = require('./integrate.svg');
const scorecardsImage = require('./scorecards.svg');
const timelineImage = require('./timeline.svg');

const backgroundImage = require('./background.svg');

class Step extends Component {

  static propTypes = {
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired
  }

  static styles = {
    description: {
      fontFamily: 'Rubik-Medium',
      fontSize: 26,
      paddingBottom: 30,
      paddingTop: 30
    },
    image: {
      paddingBottom: 30,
      width: 200
    }
  }

  render () {
    const { styles } = this.constructor;
    const { description, imageUrl } = this.props;
    return (
      <div>
        <p style={styles.description}>{description}</p>
        <img src={imageUrl} style={styles.image} />
      </div>
    );
  }

}

function StepSeparator () {
  return (
    <img src={arrowImage} />
  );
}

class InsightsBullet extends Component {

  static propTypes = {
    insight: PropTypes.string.isRequired
  }

  static styles = {
    bulletImage: {
      paddingBottom: 20
    },
    description: {
      base: {
        fontFamily: 'Rubik-Regular',
        fontSize: 18
      },
      emph: {
        fontFamily: 'Rubik-Medium'
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    const { insight } = this.props;
    return (
      <div>
        <img src={bulletImage} style={styles.bulletImage} />
        <p style={styles.description.base}><span style={styles.description.emph}>{insight}</span> Insights</p>
      </div>
    );
  }

}

@Radium
export default class HowItWorks extends Component {

  static styles = {
    section: {
      backgroundColor: '#fff',
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: '100% auto',
      color: '#000',
      textAlign: 'center'
    },
    title: {
      style: 'Rubik-Medium',
      fontSize: 58,
      color: colors.secondaryPink
    },
    bullets: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 620,
      width: '100%'
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <Element name='howItWorks'>
        <Section style={styles.section}>

          {/* Title */}
          <h1 style={styles.title}>How it works</h1>

          {/* Steps */}
          <div>
            <Step description='We create a timeline' imageUrl={timelineImage} />
            <StepSeparator />
            <Step description='We integrate our metadata into your apps' imageUrl={integrateImage} />
            <StepSeparator />
            <Step description='We give you scorecards for your content' imageUrl={scorecardsImage} />
          </div>

          {/* Bullets */}
          <div style={styles.bullets}>
            <Grid align='center' cellWidth='1/3' gutter='0px'>
              <Cell><InsightsBullet insight='Content' /></Cell>
              <Cell><InsightsBullet insight='Brand' /></Cell>
              <Cell><InsightsBullet insight='Consumer' /></Cell>
            </Grid>
          </div>

        </Section>
      </Element>
    );
  }

}
