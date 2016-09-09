import Radium from 'radium';
import { Grid, Cell } from 'radium-grid';
import React, { Component, PropTypes } from 'react';
import Section from '../../../_common/section';
import { colors } from '../../../_common/styles';

// TODO: temp replaced by iMinds logo, as requested by Michel
const imindsIcon = require('./iminds.svg');
const bbdoIcon = require('./bbdo.svg');

const bbdoPdf = require('./bbdo.pdf');
const livingLabsPdf = require('./livingLabs.pdf');

class Whitepaper extends Component {

  static propTypes = {
    icon: PropTypes.string.isRequired,
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
    const { icon, name, url } = this.props;
    return (
      <a href={url} target='_blank'>
        <div>
          <img src={icon} style={styles.download.icon} />
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
    inner: {
      maxWidth: 680
    },
    title: {
      color: '#adadad',
      fontFamily: 'Rubik-Regular',
      fontSize: '18px',
      marginBottom: 60,
      textAlign: 'center'
    },
    nonLastCell: {
      '@media only screen and (max-width: 640px)': {
        paddingBottom: 35
      }
    }
  };

  render () {
    const { styles } = this.constructor;
    return (
      <Section innerStyle={styles.inner} style={styles.outer}>
        <h1 style={styles.title}>Check out the whitepapers</h1>
        <Grid align='center' cellWidth='1' gutter='80px' largeCellWidth='1/2' mediumCellWidth='1/2'
          xlargeCellWidth='1/2'>
          <Cell style={styles.nonLastCell}><Whitepaper icon={imindsIcon} name='Living Labs' url={livingLabsPdf} /></Cell>
          <Cell><Whitepaper icon={bbdoIcon} name='BBDO' url={bbdoPdf} /></Cell>
        </Grid>
      </Section>
    );
  }

}
