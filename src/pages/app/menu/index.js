import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { buttonStyles } from '../../_common/styles';
import localized from '../../_common/localized';
import { menuSelector } from '../selectors';
import * as globalActions from '../../../actions/global';
import * as actions from '../../../actions/users';
import { ADMIN, BROADCASTER, CONTENT_MANAGER } from '../../../constants/userRoles';

@localized
@connect(menuSelector, (dispatch) => ({
  logout: bindActionCreators(actions.logout, dispatch),
  openLoginModal: bindActionCreators(globalActions.openLoginModal, dispatch),
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch)
}))
@Radium
export default class Menu extends Component {

  static propTypes = {
    currentLocation: PropTypes.object.isRequired,
    hideHomePageLinks: PropTypes.bool,
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    neutral: PropTypes.bool,
    openLoginModal: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    userRoles: ImmutablePropTypes.list
  };

  constructor (props) {
    super(props);
    this.onSignInClick = ::this.onSignInClick;
    this.onLogOutClick = ::this.onLogOutClick;
  }

  onSignInClick (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/login');
  }

  async onLogOutClick (e) {
    e.preventDefault();
    await this.props.logout();
    await this.props.routerPushWithReturnTo('/');
  }

  static styles = {
    linkButton: {
      color: 'rgb(135, 141, 143)',
      fontFamily: 'Rubik-Medium',
      textTransform: 'uppercase',
      '@media only screen and (max-width: 890px)': {
        marginLeft: 3,
        minWidth: 80
      }
    },
    hideWhenNecessary: {
      '@media only screen and (max-width: 800px)': {
        display: 'none'
      }
    }
  };

  render () {
    const { hideHomePageLinks, isAuthenticated, neutral, t, userRoles } = this.props;
    const { styles } = this.constructor;
    // ScrollLinks are wrapped because media queries (hiding button) won't work with Radium applied on the ScrollLink.
    return (
      <div>
        {!hideHomePageLinks &&
          <span style={styles.hideWhenNecessary}>
            <ScrollLink duration={500} offset={50} smooth spy style={styles.hideWhenNecessary} to='about'>
              <button key='about' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>About</button>
            </ScrollLink>
          </span>}
        {!hideHomePageLinks &&
          <span style={styles.hideWhenNecessary}>
            <ScrollLink duration={500} offset={50} smooth spy to='forWho'>
              <button key='forWho' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Clients</button>
            </ScrollLink>
          </span>}
        {/* TODO: Whitepapers temporarily removed */}
        {!hideHomePageLinks &&
          <span style={styles.hideWhenNecessary}>
            <ScrollLink duration={500} offset={50} smooth spy to='howItWorks'>
              <button key='howItWorks' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Product</button>
            </ScrollLink>
          </span>}
        {!hideHomePageLinks &&
            <span style={styles.hideWhenNecessary}>
            <ScrollLink duration={500} offset={50} smooth spy to='contact'>
              <button key='contact' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Contact</button>
            </ScrollLink>
          </span>}

        {!hideHomePageLinks && isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER)) &&
          <RouterLink to='content'>
            <button key='content' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>CMS</button>
          </RouterLink>}
        {hideHomePageLinks && isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER)) &&
          <RouterLink to='content'>
            <button key='content' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Content</button>
          </RouterLink>}
        {hideHomePageLinks && isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER)) &&
          <RouterLink to='tv-guide'>
            <button key='tv-guide' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>TV Guide</button>
          </RouterLink>}
        {isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER) || userRoles.includes(BROADCASTER)) &&
          <RouterLink to='reporting'>
            <button key='reporting' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Reporting</button>
          </RouterLink>}

        {isAuthenticated
          ? <button key='logout' style={[ buttonStyles.base, buttonStyles.extraSmall, neutral ? styles.linkButton : buttonStyles.pink ]} onClick={this.onLogOutClick}>{t('header.logout')}</button>
          : <button key='signIn' style={[ buttonStyles.base, buttonStyles.extraSmall, neutral ? styles.linkButton : buttonStyles.pink ]} onClick={this.onSignInClick}>{t('header.login')}</button>}
      </div>
    );
  }

}
