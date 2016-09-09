import Radium from 'radium';
import React, { Component } from 'react';
import { Grid, Cell } from 'radium-grid';
import { Element } from 'react-scroll';
import Section from '../../../_common/section';

const magicIcon = require('./magic.svg');
const shopTvIcon = require('./shopTv.svg');
const pieIcon = require('./pie.svg');

// TODO: add these according to design
// const arrowIcon = require('./arrow.svg');

@Radium
export default class About extends Component {

  static styles = {
    section: {
      outer: {
        backgroundColor: '#fff',
        color: 'rgb(14, 26, 32)',
        fontSize: 18
      },
      inner: {
        maxWidth: 1100
      }
    },
    title: {
      base: {
        color: 'rgb(128, 136, 138)',
        textAlign: 'center',
        marginBottom: 95
      },
      emph: {
        fontFamily: 'Rubik-Bold'
      }
    },
    item: {
      group: {
        base: {
          '@media only screen and (max-width: 1024px)': {
            marginBottom: 30
          },
          marginLeft: 10
        },
        last: {
          '@media only screen and (max-width: 1024px)': {
            marginBottom: 0
          }
        }
      },
      title: {
        fontFamily: 'Rubik-Bold',
        textTransform: 'uppercase'
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <Element name='about'>
        <Section innerStyle={styles.section.inner} style={styles.section.outer}>
          <div style={styles.title.base}>Upload your content now. <span style={styles.title.emph}>Without touching</span> it we can</div>
          <Grid align='center' cellWidth='1' largeCellWidth='1/3' xlargeCellWidth='1/3'>
            <Cell>
              <img src={magicIcon} />
              <div style={styles.item.group.base}>
                <div style={styles.item.title}>Enrich your video</div>
                <div>with metadata</div>
              </div>
            </Cell>
            <Cell>
              <img src={shopTvIcon} />
              <div style={styles.item.group.base}>
                <div style={styles.item.title}>Let viewers buy</div>
                <div>what they see on screen</div>
              </div>
            </Cell>
            <Cell>
              <img src={pieIcon} />
              <div style={[ styles.item.group.base, styles.item.group.last ]}>
                <div style={styles.item.title}>Provide data</div>
                <div>for your content</div>
              </div>
            </Cell>
          </Grid>
        </Section>
      </Element>
    );
  }

}
