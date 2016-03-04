import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import Section from '../section';
import { colors } from '../../../_common/styles';

// TODO: temp replaced by iMinds logo, as requested by Michel
const pdfIcon = require('./iminds.svg');

const livingLabsPdf = require('./livingLabs.pdf');

class Whitepaper extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }

  static styles = {
    name: {
      color: 'rgb(13, 27, 32)',
      fontSize: '18px',
      fontFamily: 'Rubik-Bold'
    },
    download: {
      base: {
        color: colors.secondaryPink,
        fontFamily: 'Rubik-Regular',
        textDecoration: 'none'
      },
      emph: {
        fontFamily: 'Rubik-Medium'
      },
      icon: {
        marginTop: 5
      }
    },
    group: {
      display: 'inline-block',
      marginLeft: 15,
      lineHeight: 1.5
    }
  }

  render () {
    const { styles } = this.constructor;
    const { name, url } = this.props;
    return (
      <a href={url} target='_blank'>
        <div>
          <img src={pdfIcon} style={styles.download.icon} />
          <div style={styles.group} >
            <p style={styles.name}>{name}</p>
            <p style={styles.download.base}>download <span style={styles.download.emph}>.pdf</span></p>
          </div>
        </div>
      </a>
    );
  }

}

@Radium
export default class Whitepapers extends Component {

  static styles = {
    outer: {
      backgroundColor: '#f5f5f5'
    },
    title: {
      color: '#adadad',
      fontFamily: 'Rubik-Regular',
      fontSize: '18px',
      marginBottom: 60,
      textAlign: 'center'
    },
    whitepapers: {
      display: 'flex',
      justifyContent: 'center'
    }
  };

  render () {
    const { styles } = this.constructor;
    return (
      <Section style={styles.outer}>
        <h1 style={styles.title}>Check out the whitepapers</h1>
        <div style={styles.whitepapers}>
          <Whitepaper name='Living Labs' url={livingLabsPdf} />
        </div>
      </Section>
    );
  }

}
