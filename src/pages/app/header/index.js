import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Menu from '../menu';
import { headerSelector } from '../selectors';

const logoImage = require('./apptvateLogo.svg');

@connect(headerSelector)
@Radium
export default class Header extends Component {

  static propTypes = {
    hideHomePageLinks: PropTypes.bool,
    version: ImmutablePropTypes.mapContains({
      apiVersionFull: PropTypes.string.isRequired,
      versionFull: PropTypes.string.isRequired
    }).isRequired
  };

  static styles = {
    container: {
      height: 40,
      paddingTop: 40,
      paddingBottom: 40,
      paddingLeft: 40,
      paddingRight: 40,
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
    },
    version: {
      display: 'none'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { hideHomePageLinks, version } = this.props;

    return (
      <div style={styles.container}>

        <span style={styles.version}>App version: {version.get('versionFull')} API version: {version.get('apiVersionFull')}</span>

        {/* Logo */}
        <div style={styles.logo.wrapper}>
          <Link to='/'>
            <img src={logoImage} style={styles.logo.image} />
          </Link>
        </div>

        {/* Menu */}
        <Menu hideHomePageLinks={hideHomePageLinks} />

      </div>
    );
  }

}
