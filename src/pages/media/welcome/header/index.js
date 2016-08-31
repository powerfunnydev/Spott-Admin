import Radium from 'radium';
import React, { Component } from 'react';
import Menu from '../menu';

const logoImage = require('./apptvateLogo.svg');

@Radium
export default class Header extends Component {

  static styles = {
    container: {
      height: 40,
      marginTop: 30,
      marginLeft: 40,
      marginRight: 40,
      display: 'flex',
      alignContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      wrapper: {
        flex: '1 0'
      },
      image: {
        height: 40
      }
    }
  };

  render () {
    const { styles } = this.constructor;
    return (
      <div style={styles.container}>

        {/* Logo */}
        <div style={styles.logo.wrapper}><img src={logoImage} style={styles.logo.image} /></div>

        {/* Menu */}
        <Menu />

      </div>
    );
  }

}
