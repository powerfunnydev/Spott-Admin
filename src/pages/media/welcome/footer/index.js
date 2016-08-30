import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import Section from '../section';
import Menu from '../menu';

const footerLogoImage = require('./footer.svg');

@Radium
export default class Footer extends Component {

  static propTypes = {
    onOpenLoginModal: PropTypes.func.isRequired
  };

  static styles = {
    section: {
      outer: {
        backgroundColor: '#101b21',
        color: '#fff'
      },
      inner: {
        paddingBottom: 30,
        paddingTop: 30,
        paddingLeft: 40,
        paddingRight: 40,
        display: 'flex',
        alignContent: 'space-between',
        alignItems: 'center'
      }
    },
    logo: {
      wrapper: {
        flex: '1 0'
      },
      image: {
        height: 40
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    const { onOpenLoginModal } = this.props;

    return (
      <Section innerStyle={styles.section.inner} style={styles.section.outer}>
        {/* Logo */}
        <div style={styles.logo.wrapper}><img src={footerLogoImage} style={styles.logo.image} /></div>
        {/* Menu */}
        <Menu neutral onOpenLoginModal={onOpenLoginModal} />
      </Section>
    );
  }
}
