import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-scroll';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { buttonStyles } from '../../_common/styles';
import { menuSelector } from './selectors';
import localized from '../../_common/localized';
import * as actions from '../actions';

@localized
@connect(menuSelector, (dispatch) => ({
  logout: bindActionCreators(actions.logout, dispatch)
}))
@Radium
export default class Menu extends Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    neutral: PropTypes.bool,
    t: PropTypes.func.isRequired,
    onOpenLoginModal: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onSignInClick = ::this.onSignInClick;
    this.onLogOutClick = ::this.onLogOutClick;
  }

  onSignInClick (e) {
    e.preventDefault();
    this.props.onOpenLoginModal();
  }

  onLogOutClick (e) {
    e.preventDefault();
    this.props.logout();
  }

  static styles = {
    linkButton: {
      color: 'rgb(135, 141, 143)',
      fontFamily: 'Rubik-Medium',
      textTransform: 'uppercase'
    },
    hideWhenNecessary: {
      '@media only screen and (max-width: 740px)': {
        display: 'none'
      }
    }
    /*
    signOutButton: {
      color: 'rgb(135, 141, 143)',
      textTransform: 'uppercase'
    }
    */
  };

  /* TODO: temporarily removed, add when login system is being implemented
   <button style={[ buttonStyles.base, buttonStyles.extraSmall, styles.header.signOutButton ]}>Sign Out</button>*/
  render () {
    const { isAuthenticated, neutral, t } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='about'>
            <button key='about' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>About</button>
          </Link>
        </span>
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='forWho'>
            <button key='forWho' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Clients</button>
          </Link>
        </span>
        {/* TODO: Whitepapers temporarily removed */}
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='howItWorks'>
            <button key='howItWorks' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Product</button>
          </Link>
        </span>
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='contact'>
            <button key='contact' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Contact</button>
          </Link>
        </span>
        {isAuthenticated
          ? <button key='signIn' style={[ buttonStyles.base, buttonStyles.extraSmall, neutral ? styles.linkButton : buttonStyles.pink ]} onClick={this.onSignInClick}>{t('header.login')}</button>
          : <button key='logout' style={[ buttonStyles.base, buttonStyles.extraSmall, neutral ? styles.linkButton : buttonStyles.pink ]} onClick={this.onLogOutClick}>{t('header.logout')}</button>}}
      </div>
    );
  }

}
