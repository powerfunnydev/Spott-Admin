import Radium from 'radium';
import { Grid, Cell } from 'radium-grid';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-scroll';
import Section from '../section';
import { colors } from '../../../_common/styles';

const freeImage = require('./free.svg');
const premiumImage = require('./premium.svg');

@Radium
class Formula extends Component {

  static propTypes = {
    buttonTarget: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    formula: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    infoText: PropTypes.node.isRequired
  };

  static styles = {
    container: {
      flexDirection: 'column',
      textAlign: 'center'
    },
    title: {
      fontFamily: 'Rubik-Medium',
      fontSize: 30
    },
    image: {
      paddingBottom: 25
    },
    info: {
      fontFamily: 'Rubik-Regular',
      fontSize: 18,
      paddingTop: 20,
      paddingBottom: 20
    },
    button: {
      cursor: 'pointer',
      fontFamily: 'Rubik-Bold',
      fontSize: 14,
      textTransform: 'uppercase'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { buttonTarget, buttonText, color, formula, imageUrl, infoText } = this.props;
    return (
      <div style={styles.container}>
        <img src={imageUrl} style={styles.image} />
        <h2 style={[ styles.title, { color } ]}>{formula}</h2>
        <p style={styles.info}>{infoText}</p>
        <Link duration={500} offset={50} smooth spy to={buttonTarget}>
          <p style={[ styles.button, { color } ]}>{buttonText}</p>
        </Link>
      </div>
    );
  }

}

export default class Pricing extends Component {

  static styles = {
    outer: {
      backgroundColor: '#101b21',
      color: '#fff'
    },
    inner: {
      maxWidth: 680
    },
    title: {
      fontFamily: 'Rubik-Medium',
      fontSize: 32,
      textAlign: 'center',
      paddingBottom: 60
    },
    infoEmph: {
      fontFamily: 'Rubik-Medium'
    },
    nonLastCell: {
      '@media only screen and (max-width: 640px)': {
        paddingBottom: 95
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <Section innerStyle={styles.inner} style={styles.outer}>
        <h1 style={styles.title}>There are two ways we can do this!</h1>
        <Grid align='center' cellWidth='1' gutter='80px' largeCellWidth='1/2' mediumCellWidth='1/2'
          xlargeCellWidth='1/2'>

          {/* Formula: free */}
          <Cell style={styles.nonLastCell}>
            {/* TODO: button should be 'Register Now', but temporarily changes to 'contact us' */}
            <Formula buttonTarget='contact' buttonText='Contact Us' color={colors.secondaryPink} formula='Free'
              imageUrl={freeImage}
              infoText={<span>Upload up to <span style={styles.infoEmph}>15 min</span> content and we make it interactive for you!</span>} />
          </Cell>

          {/* Formula: premium */}
          <Cell>
            <Formula buttonTarget='contact' buttonText='Contact Us' color={colors.primaryBlue} formula='Premium'
              imageUrl={premiumImage}
              infoText='This is the real thing. Contact us for structural partnerships.' />
          </Cell>

        </Grid>
      </Section>
    );
  }

}
