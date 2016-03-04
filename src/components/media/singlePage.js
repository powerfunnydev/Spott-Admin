import Radium from 'radium';
import React, { Component, PropTypes } from 'react';

const logoImage = require('./welcome/hero/header/apptvateLogo.svg');
const backgroundImage = require('./welcome/hero/background.jpg');

@Radium
export default class MediaModule extends Component {

  static propTypes = {
    children: PropTypes.node
  };

  static styles = {
    container: {
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Rubik-Regular',
      height: '100%',
      left: 0,
      minHeight: 400,
      minWidth: 800,
      position: 'absolute',
      top: 0,
      width: '100%'
    },
    header: {
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
      /* TODO: temporarily removed, add when login system is being implemented
      signInButton: {
        textTransform: 'uppercase'
      },
      signOutButton: {
        color: 'rgb(135, 141, 143)',
        textTransform: 'uppercase'
      }
      */
    },
    body: {
      display: 'flex',
      position: 'relative',
      flex: '1 0',
      alignItems: 'center',
      paddingLeft: 90,
      paddingRight: 60
    },
    quote: {
      color: 'rgb(86, 88, 89)',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontStyle: 'italic',
      position: 'absolute',
      bottom: 30,
      right: 40,
      fontSize: '12px'
    }
  };

  render () {
    const styles = this.constructor.styles;

    return (
      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.header.container}>
          <div style={styles.header.logo.wrapper}><img src={logoImage} style={styles.header.logo.image} /></div>
          {/* TODO: temporarily removed, add when login system is being implemented
           <button style={[ buttonStyles.base, buttonStyles.extraSmall, styles.header.signOutButton ]}>Sign Out</button>
           <button style={[ buttonStyles.base, buttonStyles.extraSmall, buttonStyles.pink, styles.header.signInButton ]}>Sign In</button> */}
        </div>
        {/* Page body */}
        <div style={styles.body}>
          {this.props.children}
          <div style={styles.quote}>
            — Spectre, Universal 2016
          </div>
        </div>
      </div>
    );
  }

}
